// app/api/generate/route.ts — POST: prompt → Granite → store → return result
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { generateContract } from '@/lib/watsonx';
import { parseContract, MalformedContractError } from '@/lib/parse';
import { mockStore } from '@/lib/store';
import { buildBobPrompt } from '@/lib/bob-handoff';
import { env } from '@/lib/env';
import { responseCache } from '@/lib/cache';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface GenerateRequest {
  prompt?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  pathSlug?: string;
  modelId?: string;
}

export async function POST(req: NextRequest) {
  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }

  // Check cache first
  const method = body.method || 'GET';
  const cachedResponse = responseCache.get(prompt, method);
  if (cachedResponse) {
    // Return cached response with a header indicating it's from cache
    return NextResponse.json(cachedResponse, {
      headers: {
        'X-Cache': 'HIT',
        'X-Cache-Age': String(Date.now() - parseInt(cachedResponse.id, 36)),
      },
    });
  }

  let raw: string;
  try {
    raw = await generateContract(prompt, {
      method: body.method,
      pathSlug: body.pathSlug,
      modelId: body.modelId,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'watsonx call failed';
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  let contract;
  try {
    contract = parseContract(raw);
  } catch (e) {
    if (e instanceof MalformedContractError) {
      try {
        const retry = await generateContract(prompt, {
          method: body.method,
          pathSlug: body.pathSlug,
          modelId: body.modelId,
          stricter: true,
        });
        contract = parseContract(retry);
      } catch (retryErr) {
        const raw2 = retryErr instanceof MalformedContractError ? retryErr.raw : raw;
        return NextResponse.json(
          { error: 'Granite returned malformed JSON twice', raw: raw2 },
          { status: 502 },
        );
      }
    } else {
      throw e;
    }
  }

  const id = nanoid(8);
  const path = body.pathSlug || contract.suggested_path || 'endpoint';
  const entry = {
    id,
    payload: contract.mock_response,
    method: (body.method ?? contract.http_method) as 'GET' | 'POST' | 'PUT' | 'DELETE',
    path,
    javaCode: contract.java_boilerplate,
    prompt,
    createdAt: Date.now(),
  };
  mockStore.put(entry);

  const origin = req.nextUrl.origin;
  
  // Extract region from WATSONX_URL (e.g., "us-south" from "https://us-south.ml.cloud.ibm.com")
  const regionMatch = env.WATSONX_URL.match(/https:\/\/([^.]+)\./);
  const region = regionMatch ? regionMatch[1] : 'unknown';
  
  const response = {
    id,
    mockUrl: `${origin}/api/mock/${id}`,
    mockResponse: contract.mock_response,
    javaBoilerplate: contract.java_boilerplate,
    bobHandoff: buildBobPrompt(entry),
    method: entry.method,
    path,
    region,
    modelUsed: body.modelId || env.WATSONX_MODEL_ID,
  };

  // Cache the response
  responseCache.set(prompt, method, response);

  return NextResponse.json(response, {
    headers: {
      'X-Cache': 'MISS',
    },
  });
}

// Made with Bob

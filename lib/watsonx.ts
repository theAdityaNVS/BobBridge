// lib/watsonx.ts — single watsonx.ai client, exposes generateContract()
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';
import { env } from './env';
import { SYSTEM_PROMPT, buildUserMessage } from './prompt';

let client: WatsonXAI | null = null;

function getClient(): WatsonXAI {
  if (client) return client;
  client = WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl: env.WATSONX_URL,
    authenticator: new IamAuthenticator({ apikey: env.WATSONX_API_KEY }),
  });
  return client;
}

export interface GenerateOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  pathSlug?: string;
  stricter?: boolean; // used on retry after malformed output
  modelId?: string; // allow model selection from UI
}

export async function generateContract(
  userPrompt: string,
  options: GenerateOptions = {},
): Promise<string> {
  const svc = getClient();
  const modelId = options.modelId || env.WATSONX_MODEL_ID;
  const response = await svc.textChat({
    modelId,
    projectId: env.WATSONX_PROJECT_ID,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserMessage(userPrompt, options) },
    ],
    temperature: 0,
    maxTokens: 2500,
  });

  const content = response.result?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || content.length === 0) {
    throw new Error('watsonx returned empty content');
  }
  return content;
}

// Made with Bob

// app/api/mock/[id]/route.ts — serves the stored mock payload for any verb
import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/store';

export const runtime = 'nodejs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

function serve(id: string) {
  const entry = mockStore.get(id);
  if (!entry) {
    return NextResponse.json(
      { error: 'Mock not found or expired' },
      { status: 404, headers: CORS },
    );
  }
  return NextResponse.json(entry.payload, { status: 200, headers: CORS });
}

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return serve(id);
}
export async function POST(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return serve(id);
}
export async function PUT(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return serve(id);
}
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return serve(id);
}
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// Made with Bob

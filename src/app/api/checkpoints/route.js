import { NextResponse } from 'next/server';
import { getCheckpoints, addCheckpoint } from '@/server/checkpoints';

export async function GET() {
  const checkpoint = await getCheckpoints();
  return NextResponse.json(checkpoint);
}

export async function POST(request) {
  const { name, description, tags } = await request.json();
  const result = await addCheckpoint({ name, description, tags });
  return NextResponse.json(result, { status: 201 });
}

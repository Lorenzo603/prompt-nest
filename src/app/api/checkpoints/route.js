import { NextResponse } from 'next/server';
import { getCheckpoints, addCheckpoint } from '@/server/checkpoints';

export async function GET() {
  const checkpoint = await getCheckpoints();
  return NextResponse.json(checkpoint);
}

export async function POST(request) {
  const { name, description, filename, 
    urls, settings, baseModel, relatedModels, tags } = await request.json();
  const result = await addCheckpoint({ name, description, filename, 
    urls, settings, baseModel, relatedModels, tags });
  return NextResponse.json(result, { status: 201 });
}

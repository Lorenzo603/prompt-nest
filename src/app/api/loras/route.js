import { NextResponse } from 'next/server';
import { getLoras, addLora } from '@/server/loras';

export async function GET() {
  const loras = await getLoras();
  return NextResponse.json(loras);
}

export async function POST(request) {
  const { name, description, triggerWords, tags, baseModel, filename, urls } = await request.json();
  const result = await addLora({ name, description, triggerWords, tags, baseModel, filename, urls });
  return NextResponse.json(result, { status: 201 });
}

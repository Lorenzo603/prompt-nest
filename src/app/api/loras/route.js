import { NextResponse } from 'next/server';
import { getLoras, addLora, updateLora, deleteLora } from '@/server/loras';

export async function GET() {
  const loras = await getLoras();
  return NextResponse.json(loras);
}

export async function POST(request) {
  const { name, description, filename, triggerWords, urls, settings, baseModel, tags, version, publishedDate, hash, imageUrl } = await request.json();
  const result = await addLora({ name, description, filename, triggerWords, urls, settings, baseModel, tags, version, publishedDate, hash, imageUrl });
  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request) {
  const { id, name, description, filename, triggerWords, urls, settings, baseModel, tags, version, publishedDate, hash, imageUrl } = await request.json();
  const result = await updateLora({ id, name, description, filename, triggerWords, urls, settings, baseModel, tags, version, publishedDate, hash, imageUrl });
  return NextResponse.json(result);
}

export async function DELETE(request) {
  const { id } = await request.json();
  const result = await deleteLora(id);
  return NextResponse.json(result);
}

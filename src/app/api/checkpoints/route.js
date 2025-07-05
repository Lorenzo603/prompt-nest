import { NextResponse } from 'next/server';
import { getCheckpoints, addCheckpoint, updateCheckpoint, deleteCheckpoint } from '@/server/checkpoints';

export async function GET() {
  const checkpoint = await getCheckpoints();
  return NextResponse.json(checkpoint);
}

export async function POST(request) {
  const { name, description, filename, 
    urls, settings, baseModel, relatedModels, tags, version, publishedDate, hash, imageUrl } = await request.json();
  const result = await addCheckpoint({ name, description, filename, 
    urls, settings, baseModel, relatedModels, tags, version, publishedDate, hash, imageUrl });
  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request) {
  const { id, name, description, filename, 
    urls, settings, baseModel, relatedModels, tags, version, publishedDate, hash, imageUrl } = await request.json();
  const result = await updateCheckpoint({ id, name, description, filename, 
    urls, settings, baseModel, relatedModels, tags, version, publishedDate, hash, imageUrl });
  return NextResponse.json(result);
}

export async function DELETE(request) {
  const { id } = await request.json();
  const result = await deleteCheckpoint(id);
  return NextResponse.json(result);
}

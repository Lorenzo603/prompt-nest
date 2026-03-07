import { NextResponse } from 'next/server';
import { getBaseModels } from '@/server/baseModels';

export async function GET() {
  try {
    const baseModels = await getBaseModels();
    return NextResponse.json(baseModels);
  } catch (error) {
    console.error('Error fetching base models:', error);
    return NextResponse.json({ error: 'Failed to fetch base models' }, { status: 500 });
  }
}

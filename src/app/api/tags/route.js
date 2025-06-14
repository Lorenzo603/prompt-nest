import { NextResponse } from 'next/server';
import db from '@/db';
import { tagsTable } from '@/db/schema';
import { ilike } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    let tags;
    if (query) {
      // Search for tags that contain the query string
      tags = await db.select().from(tagsTable)
        .where(ilike(tagsTable.name, `%${query}%`))
        .limit(10);
    } else {
      // Return all tags
      tags = await db.select().from(tagsTable).limit(50);
    }
    
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

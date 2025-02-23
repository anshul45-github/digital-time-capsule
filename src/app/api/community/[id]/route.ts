import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const community = await db.community.findUnique({
            where: { id }
        });

        if (!community) {
            return NextResponse.json({ error: 'Community not found' }, { status: 404 });
        }

        console.log(community);

        return NextResponse.json(community);
    } catch (error) {
        console.error(`[COMMUNITY_ID_GET] : ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
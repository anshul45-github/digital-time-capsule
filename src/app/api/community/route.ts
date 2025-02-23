import { NextResponse } from 'next/server';
import { auth } from '~/auth';
import { db } from '~/server/db';

export async function POST(req: Request) {
    try {
        const { title, description } = await req.json();

        if (!title) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const session = await auth();

        if(!session || !session.user || !session.user.email)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const currentUser = await db.user.findUnique({
            where: {
            email: session.user.email,
            },
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const creatorId = currentUser.id;

        const joinCode = Math.floor(100000 + Math.random() * 900000).toString();

        const community = await db.community.create({
            data: {
                name: title,
                description,
                joinCode,
                members: {
                    create: {
                        userId: creatorId,
                        admin: true,
                    },
                },
            },
        });

        return NextResponse.json(community, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create community' }, { status: 500 });
    }
}

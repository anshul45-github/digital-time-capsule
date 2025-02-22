import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '~/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    if(!session || !session.user || !session.user.email)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if(!currentUser)
        return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ id: currentUser.id, name: currentUser.name });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update user name' }, { status: 500 });
  }
}
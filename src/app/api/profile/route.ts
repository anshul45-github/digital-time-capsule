import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '~/auth';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if(!session || !session.user || !session.user.email)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { displayName } = await req.json();

    if (!displayName) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name: displayName },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update user name' }, { status: 500 });
  }
}
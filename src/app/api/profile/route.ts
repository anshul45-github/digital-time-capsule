import { NextResponse } from "next/server";
import { auth } from "~/auth";
import { db } from "~/server/db";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const currentUser = await db.user.findUnique({
            where: { email: session.user.email },
        });
        if(!currentUser)
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        return NextResponse.json({ user: currentUser });
    }
    catch(error) {
        console.error("Failed to fetch user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { displayName } = await req.json();
        if(!displayName)
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        const currentUser = await db.user.findUnique({
            where: { email: session.user.email },
        });
        if(!currentUser)
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        await db.user.update({
            where: { id: currentUser.id },
            data: { name: displayName },
        });
        return NextResponse.json({ user: currentUser });
    }
    catch(error) {
        console.error("Failed to update user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
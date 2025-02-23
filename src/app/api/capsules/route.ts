import { NextResponse } from "next/server";
import { auth } from "~/auth";
import { db } from "~/server/db";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, caption } = await req.json();

        if(!title || !caption)
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });

        const currentUser = await db.user.findUnique({
            where: { email: session.user.email },
        });

        if(!currentUser)
            return NextResponse.json({ error: "User not found" }, { status: 404 });

        // TODO : Add proper method to generate invite code
        const inviteCode = "123456";


        // return NextResponse.json(newCapsule);
    }
    catch(error) {
        console.error("Failed to update user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
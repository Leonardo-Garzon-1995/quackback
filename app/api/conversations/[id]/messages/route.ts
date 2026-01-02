import clientPromise from "../../../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import type { Collection } from "mongodb";

type DuckMessage = {
  user: string;
  ai: string;
  createdAt: Date;
};

type Conversation = {
  _id: ObjectId;
  messages: DuckMessage[];
  createdAt?: Date;
  updatedAt?: Date;
};

export async function POST(req: Request, { params }: { params: any }) {
  try {
    // Unwrap params if it's a Promise (Next.js dynamic API route fix)
    const awaitedParams =
      typeof params?.then === "function" ? await params : params;
    const id = awaitedParams?.id;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();
    const { user, ai, userId } = body;
    let aiText = ai;
    if (Array.isArray(ai)) {
      aiText = ai.join("\n");
    }
    if (
      typeof user !== "string" ||
      typeof aiText !== "string" ||
      typeof userId !== "string"
    ) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    const oid = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db("ducktype");
    const now = new Date();

    // ✅ type the collection
    const conversations: Collection<Conversation> =
      db.collection<Conversation>("conversations");

    const result = await conversations.findOneAndUpdate(
      { _id: oid, userId },
      {
        $push: { messages: { user, ai: aiText, createdAt: now } },
        $set: { updatedAt: now },
      },
      { returnDocument: "after" }
    );

    const conv = (
      result && "value" in result ? result.value : result
    ) as Conversation | null;
    if (
      !conv ||
      !conv.messages ||
      !Array.isArray(conv.messages) ||
      conv.messages.length === 0
    ) {
      return NextResponse.json(
        { error: "Not found or no messages" },
        { status: 404 }
      );
    }

    const lastMsg = conv.messages[conv.messages.length - 1];

    return NextResponse.json({
      message: {
        ...lastMsg,
        createdAt: lastMsg?.createdAt
          ? new Date(lastMsg.createdAt).toISOString()
          : null,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import lagoClient from "@/lib/lagoClient";
import { EXTERNAL_SUBSCRIPTION_ID } from "@/lib/constants";

export async function POST(request: Request) {
  const body = await request.json();
  const type = body.type;
  const tokens = body.tokens;

  try {
    const response = await lagoClient.events.createEvent({
      event: {
        transaction_id: crypto.randomUUID(),
        external_subscription_id: EXTERNAL_SUBSCRIPTION_ID,
        code: "tokens",
        timestamp: Math.floor(Date.now() / 1000).toString(),
        properties: {
          type,
          total: tokens,
        },
      },
    });

    return NextResponse.json(response.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lago event failed" }, { status: 500 });
  }
}

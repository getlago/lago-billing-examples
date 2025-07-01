import { NextResponse } from "next/server";
import lagoClient from "@/lib/lagoClient";

export async function POST(request: Request) {
  const body = await request.json();
  const seatId = body.seat_id;
  const operationType = body.operation_type;
  const external_subscription_id = body.external_subscription_id;

  if (!external_subscription_id) {
    return NextResponse.json(
      { error: "External subscription ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await lagoClient.events.createEvent({
      event: {
        transaction_id: crypto.randomUUID(),
        external_subscription_id,
        code: "seats",
        timestamp: Math.floor(Date.now() / 1000).toString(),
        properties: {
          seat_id: seatId,
          operation_type: operationType ?? "add", // default to add if not provided
        },
      },
    });

    return NextResponse.json(response.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lago event failed" }, { status: 500 });
  }
}

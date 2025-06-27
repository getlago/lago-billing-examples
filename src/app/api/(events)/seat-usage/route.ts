import { NextResponse } from 'next/server';
import lagoClient from '@/lib/lagoClient';
import { EXTERNAL_SUBSCRIPTION_ID } from '@/lib/constants';

export async function POST(request: Request) {
  const body = await request.json();
  const seatId = body.seat_id;
  const operationType = body.operation_type;

  try {
    const response = await lagoClient.events.createEvent({
      event: {
        transaction_id: crypto.randomUUID(),
        external_subscription_id: EXTERNAL_SUBSCRIPTION_ID,
        code: 'seats',
        timestamp: Math.floor(Date.now() / 1000).toString(),
        properties: {
            seat_id: seatId,
            operation_type: operationType ?? "add" // default to add if not provided
        },
      },
    });

    return NextResponse.json(response.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Lago event failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import lagoClient from '@/lib/lagoClient';
import { EXTERNAL_SUBSCRIPTION_ID_HYBRID } from '@/lib/constants';

export async function POST(request: Request) {
  const body = await request.json();
  const user_id = body.user_id;

  try {
    const response = await lagoClient.events.createEvent({
      event: {
        transaction_id: crypto.randomUUID(),
        external_subscription_id: EXTERNAL_SUBSCRIPTION_ID_HYBRID,
        code: 'hybrid', // TODO: Replace with your own billable metric code
        timestamp: Math.floor(Date.now() / 1000).toString(),
        properties: { user_id },
      },
    });

    return NextResponse.json(response.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Lago event failed' }, { status: 500 });
  }
}

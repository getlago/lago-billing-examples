import { NextResponse } from 'next/server';
import lagoClient from '@/lib/lagoClient';

// TODO: Replace with your own values
// Recommended: save values into your customer object
const EXTERNAL_SUBSCRIPTION_ID="28f75338-8a47-4ffa-bfc6-75b19ff8f813";
const EXTERNAL_CUSTOMER_ID="56b83f3e-8685-4279-bb57-6e028df11d21";

export async function GET() {
  try {
    const response = await lagoClient.customers.findCustomerCurrentUsage(
      EXTERNAL_CUSTOMER_ID,
      { external_subscription_id: EXTERNAL_SUBSCRIPTION_ID }
    );
    return NextResponse.json(response.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const type = body.type;

  try {
    const response = await lagoClient.events.createEvent({
      event: {
        transaction_id: crypto.randomUUID(),
        external_subscription_id: EXTERNAL_SUBSCRIPTION_ID,
        code: 'tokens',
        timestamp: Math.floor(Date.now() / 1000).toString(),
        properties: {
            type,
            total: 1000
        },
      },
    });

    return NextResponse.json(response.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Lago event failed' }, { status: 500 });
  }
}

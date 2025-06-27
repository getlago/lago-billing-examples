import { NextResponse } from 'next/server';
import lagoClient from '@/lib/lagoClient';
import { EXTERNAL_CUSTOMER_ID, EXTERNAL_SUBSCRIPTION_ID } from '@/lib/constants';

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
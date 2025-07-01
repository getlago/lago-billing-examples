import { NextResponse } from "next/server";
import lagoClient from "@/lib/lagoClient";
import { EXTERNAL_CUSTOMER_ID } from "@/lib/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const external_subscription_id = searchParams.get("external_subscription_id");

  if (!external_subscription_id) {
    return NextResponse.json(
      { error: "External subscription ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await lagoClient.customers.findCustomerCurrentUsage(
      EXTERNAL_CUSTOMER_ID,
      { external_subscription_id }
    );
    return NextResponse.json(response.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    );
  }
}

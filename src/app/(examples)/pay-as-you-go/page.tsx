"use client";

import { useEffect, useState } from "react";
import JsonView from "@uiw/react-json-view";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUsage } from "@/lib/utils";
import { EXTERNAL_SUBSCRIPTION_ID } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PayAsYouGoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [apiRequests, setApiRequests] = useState<number>(1);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/payg-usage", {
        method: "POST",
        body: JSON.stringify({
          requests: apiRequests,
          external_subscription_id: EXTERNAL_SUBSCRIPTION_ID, // TODO: Replace with your own customer's subscription ID
        }),
      });
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsage = async () => {
      const usage = await getCurrentUsage();
      setUsage(usage);
    };

    fetchUsage();
  }, [event]);

  return (
    <main>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Pay-as-you-go Billing
      </h1>
      <p className="text-gray-600 mb-6">
        This simulates pay-as-you-go billing for charging per API request (e.x.
        $0.10/request).
      </p>

      {/* Sample Text Input */}
      <Card className="max-w-sm mb-6">
        <CardHeader>
          <CardTitle>Sample Number of API Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            className="mb-2"
            type="number"
            value={apiRequests === 0 ? "" : apiRequests}
            onChange={(e) => setApiRequests(Number(e.target.value))}
          />
          <Button onClick={handleClick} disabled={isLoading || !apiRequests}>
            {isLoading ? <Loader className="animate-spin" /> : "Send event"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="">
          <CardHeader>
            <CardTitle>Event Response:</CardTitle>
          </CardHeader>
          <CardContent>
            {event ? (
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-96">
                <JsonView value={event} />
              </pre>
            ) : (
              <p className="text-gray-500">No event data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Usage:</CardTitle>
          </CardHeader>
          <CardContent>
            {usage ? (
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-96">
                <JsonView value={usage} />
              </pre>
            ) : (
              <p className="text-gray-500">Loading usage data...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

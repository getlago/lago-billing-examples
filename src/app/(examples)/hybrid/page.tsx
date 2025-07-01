"use client";

import { useEffect, useState } from "react";
import JsonView from "@uiw/react-json-view";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUsage } from "@/lib/utils";
import { EXTERNAL_SUBSCRIPTION_ID_HYBRID } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const IS_HYBRID = true;

export default function HybridPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/hybrid-usage", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          external_subscription_id: EXTERNAL_SUBSCRIPTION_ID_HYBRID, // TODO: Replace with your own customer's subscription ID
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
    setUserId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    const fetchUsage = async () => {
      const usage = await getCurrentUsage(IS_HYBRID);
      setUsage(usage);
    };

    fetchUsage();
  }, [event]);

  return (
    <main>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Hybrid Billing</h1>
      <p className="text-gray-600 mb-6">
        This simulates hybrid billing for charging with a monthly subscription
        and MTUs tracked by user_id.
        <br />
        (e.g. $10/month subscription, 2 free MTUs, overage at $0.10/MTU)
      </p>

      {/* Sample User ID Input */}
      <Card className="max-w-sm mb-6">
        <CardHeader>
          <CardTitle>Sample User ID</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            className="mb-2"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter a user_id"
          />
          <p className="text-sm text-gray-600 mb-4">
            Edit the user_id to see new MTUs.
          </p>
          <Button onClick={handleClick} disabled={isLoading || !userId}>
            {isLoading ? <Loader className="animate-spin" /> : "Send event"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Response</CardTitle>
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
            <CardTitle>Customer Usage</CardTitle>
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

'use client';

import { useEffect, useState } from "react";
import JsonView from '@uiw/react-json-view';
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getCurrentUsage } from "@/lib/utils";
import { EXTERNAL_SUBSCRIPTION_ID_HYBRID } from "@/lib/constants";

export default function HybridPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [userId, setUserId] = useState<string>('');
  const [isHybrid] = useState<boolean>(true);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/hybrid-usage', {
          method: 'POST',
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
      const usage = await getCurrentUsage(isHybrid);
      setUsage(usage);
    };

    fetchUsage();
  }, [event]);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Hybrid Billing</h1>
      <p className="text-gray-600 mb-6">
        This simulates hybrid billing for charging with a monthly subscription and MTUs tracked by user_id.
        <br />
        (e.x. $10/month subscription, 2 free MTUs, overage at 0.10/MTU)
      </p>
      
      {/* Sample Text Input */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Label htmlFor="sample-text" className="text-sm font-medium">
            Sample User ID:
          </Label>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {userId || 'Generating...'}
          </span>
        </div>
        <Input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <p className="text-sm text-gray-600">
          Edit the user_id to see new MTUs.
        </p>
      </div>
      
      <div className="mb-4">
        <Button onClick={handleClick} disabled={isLoading || !userId}>
          {isLoading ? <Loader className="animate-spin" /> : 'Send event'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Event Response:</h2>
          {event ? (
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-96">
              <JsonView value={event} />
            </pre>
          ) : (
            <p className="text-gray-500">No event data yet</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Customer Usage:</h2>
          {usage ? (
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-96">
              <JsonView value={usage} />
            </pre>
          ) : (
            <p className="text-gray-500">Loading usage data...</p>
          )}
        </div>
      </div>
    </main>
  );
}
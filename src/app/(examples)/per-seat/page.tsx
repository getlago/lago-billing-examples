'use client';

import { useEffect, useState } from "react";
import JsonView from '@uiw/react-json-view';
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getCurrentUsage } from "@/lib/utils";
import { EXTERNAL_SUBSCRIPTION_ID } from "@/lib/constants";

export default function PerSeatPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [type, setType] = useState<string>('add');
  const [seatId, setSeatId] = useState<string>('');

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/seat-usage', {
          method: 'POST',
          body: JSON.stringify({
            seat_id: seatId,
            operation_type: type,
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
    setSeatId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    const fetchUsage = async () => {
      const usage = await getCurrentUsage();
      setUsage(usage);
    };

    fetchUsage();
  }, [event]);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Per-seat Billing</h1>
      <p className="text-gray-600 mb-6">This simulates seat-based billing for SaaS applications.</p>
      
      <div className="grid w-full max-w-sm items-center gap-3 mb-4">
        <Label htmlFor="seatId">Example Seat ID</Label>
        <Input type="text" value={seatId || 'Generating...'} onChange={(e) => setSeatId(e.target.value)} />
        <div className="flex flex-row items-center gap-1">
          <p>Operation type:</p>
          <Tabs defaultValue={type} onValueChange={(value: string) => setType(value)}>
            <TabsList>
              <TabsTrigger value="add">Add seat</TabsTrigger>
              <TabsTrigger value="remove">Remove seat</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-row gap-3 mb-4">
        <Button onClick={handleClick} disabled={isLoading}>
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
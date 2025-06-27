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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    <main>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Per-seat Billing</h1>
      <p className="text-gray-600 mb-6">This simulates seat-based billing for SaaS applications.</p>
      
      <Card className="max-w-sm mb-6">
        <CardHeader>
          <CardTitle>Example Seat ID</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            className="mb-2"
            type="text" 
            value={seatId} 
            onChange={(e) => setSeatId(e.target.value)} 
            placeholder="Enter a seat_id"
          />
          <p className="text-sm text-gray-600 mb-4">
            Edit the seat_id to manage different seats.
          </p>
          <div className="flex flex-row items-center gap-2 mb-4">
            <p className="text-sm font-medium">Operation type:</p>
            <Tabs defaultValue={type} onValueChange={(value: string) => setType(value)}>
              <TabsList>
                <TabsTrigger value="add">Add seat</TabsTrigger>
                <TabsTrigger value="remove">Remove seat</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button onClick={handleClick} disabled={isLoading}>
            {isLoading ? <Loader className="animate-spin" /> : 'Send event'}
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
'use client';

import { useEffect, useState } from "react";
import JsonView from '@uiw/react-json-view';
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getCurrentUsage } from "@/lib/utils";
import { EXTERNAL_SUBSCRIPTION_ID } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Simple token counting function (approximation based on GPT-style tokenization)
const countTokens = (text: string): number => {
  if (!text.trim()) return 0;
  
  // Simple approximation: ~4 characters per token on average for English text
  // This is a rough estimate - in production you'd use a proper tokenizer
  const avgCharsPerToken = 4;
  return Math.ceil(text.trim().length / avgCharsPerToken);
};

export default function PerTokenPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [type, setType] = useState<string>('input');
  const [sampleText, setSampleText] = useState<string>('');
  const [tokens, setTokens] = useState<number>(0);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/token-usage', {
          method: 'POST',
          body: JSON.stringify({ 
            type: type,
            tokens: tokens,
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
    const tokens = countTokens(sampleText);
    setTokens(tokens);
  }, [sampleText]);

  useEffect(() => {
    const fetchUsage = async () => {
      const usage = await getCurrentUsage();
      setUsage(usage);
    };

    fetchUsage();
  }, [event]);

  return (
    <main>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Per-token Billing</h1>
      <p className="text-gray-600 mb-6">This simulates usage-based billing for LLM APIs like OpenAI or Mistral.</p>
      
      {/* Sample Text Input */}
      <Card className="max-w-2xl mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Sample Text
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {tokens} tokens
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            id="sample-text"
            placeholder="Enter your sample text here to see token count and simulate API usage..."
            value={sampleText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSampleText(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex flex-row items-center gap-2 mb-4">
            <p className="text-sm font-medium">Tracking:</p>
            <Tabs defaultValue={type} onValueChange={(value: string) => setType(value)}>
              <TabsList>
                <TabsTrigger value="input">Input tokens</TabsTrigger>
                <TabsTrigger value="output">Output tokens</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button onClick={handleClick} disabled={isLoading || tokens === 0}>
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
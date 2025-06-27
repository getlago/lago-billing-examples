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

// Simple token counting function (approximation based on GPT-style tokenization)
const countTokens = (text: string): number => {
  if (!text.trim()) return 0;
  
  // Simple approximation: ~4 characters per token on average for English text
  // This is a rough estimate - in production you'd use a proper tokenizer
  const avgCharsPerToken = 4;
  return Math.ceil(text.length / avgCharsPerToken);
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
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Per-token Billing</h1>
      <p className="text-gray-600 mb-6">This simulates usage-based billing for LLM APIs like OpenAI or Mistral.</p>
      
      {/* Sample Text Input */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Label htmlFor="sample-text" className="text-sm font-medium">
            Sample Text:
          </Label>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {tokens} tokens
          </span>
        </div>
        <textarea
          id="sample-text"
          placeholder="Enter your sample text here to see token count and simulate API usage..."
          value={sampleText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSampleText(e.target.value)}
          className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex flex-row items-center gap-1">
          <p>Tracking:</p>
          <Tabs defaultValue={type} onValueChange={(value: string) => setType(value)}>
            <TabsList>
              <TabsTrigger value="input">Input tokens</TabsTrigger>
              <TabsTrigger value="output">Output tokens</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="mb-4">
        <Button onClick={handleClick} disabled={isLoading || tokens === 0}>
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
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const billingExamples = [
  {
    title: "Pay-as-you-go",
    description: "Charge customers based on their actual usage. Perfect for API calls, compute resources, or data processing.",
    href: "/pay-as-you-go",
    icon: "💰"
  },
  {
    title: "Per-transaction",
    description: "Charge a fixed fee for each transaction or operation. Ideal for payment processing or individual services.",
    href: "/per-transaction", 
    icon: "💳"
  },
  {
    title: "Hybrid",
    description: "Combine multiple billing models for complex pricing strategies. Mix usage, seats, and fixed fees.",
    href: "/hybrid",
    icon: "🔄"
  },
  {
    title: "Per-seat",
    description: "Charge based on the number of users or seats. Common for SaaS platforms and team collaboration tools.",
    href: "/per-seat",
    icon: "👥"
  },
  {
    title: "Per-token",
    description: "Charge based on token consumption. Perfect for AI services, language models, or credit-based systems.",
    href: "/per-token",
    icon: "🎯"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Lago Billing Examples
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore different billing models and pricing strategies with these interactive examples.
        </p>
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {billingExamples.map((example) => (
          <Link key={example.href} href={example.href} className="group">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{example.icon}</span>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {example.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {example.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center border-t pt-8">
        <div className="flex justify-center gap-8 text-sm text-gray-500">
          <a
            href="https://getlago.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-gray-700 transition-colors"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Visit Lago
          </a>
        </div>
      </div>
    </div>
  );
}

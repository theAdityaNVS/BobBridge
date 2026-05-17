'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface PopularSearch {
  title: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  category: string;
}

const POPULAR_SEARCHES: PopularSearch[] = [
  {
    title: "User Profile API",
    description: "Fetch user profile with name, email, avatar, and preferences",
    method: "GET",
    category: "User Management"
  },
  {
    title: "Order History",
    description: "Get order history with item names, prices, quantities, and status",
    method: "GET",
    category: "E-commerce"
  },
  {
    title: "Create Product",
    description: "Create a new product with name, description, price, and category",
    method: "POST",
    category: "E-commerce"
  },
  {
    title: "Update Settings",
    description: "Update user settings including theme, notifications, and language",
    method: "PUT",
    category: "User Management"
  },
  {
    title: "Search Results",
    description: "Search products with filters for category, price range, and rating",
    method: "GET",
    category: "Search"
  },
  {
    title: "Payment Processing",
    description: "Process payment with amount, currency, payment method, and billing info",
    method: "POST",
    category: "Payments"
  }
];

interface Props {
  onSelect: (search: PopularSearch) => void;
}

export function PopularSearches({ onSelect }: Props) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Try These Popular Endpoints</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {POPULAR_SEARCHES.map((search, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(search)}
              className="text-left p-4 rounded-lg border bg-card hover:bg-accent hover:border-primary/40 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {search.title}
                </h3>
                <Badge variant="outline" className="shrink-0 text-xs">
                  {search.method}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {search.description}
              </p>
              <Badge variant="secondary" className="text-xs">
                {search.category}
              </Badge>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Made with Bob
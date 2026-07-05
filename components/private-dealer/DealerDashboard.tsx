"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowRight, 
  Sprout, 
  FlaskConical, 
  ReceiptText, 
  RefreshCw,
  FileText,
  User,
  Weight,
} from "lucide-react";
import { ChartAreaDefault } from "@/components/chart-area";

export default function DealerDashboard() {
  return (
     <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-8xl mx-auto w-full pb-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Storefront Dashboard</h1>
          <p className="text-lg text-muted-foreground">
             Manage inventory, track distribution, and record transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Analytics & Inventory Grid */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Financial Analytics Chart Card */}
            <ChartAreaDefault />

            {/* Storefront Inventory Grid */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Private Stock</h2>
                <button className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1.5">
                  View Full Inventory <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Inventory Card 1 */}
                <Card className="shadow-sm border-border hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">Commercial NPK 15-15-15</h3>
                        <p className="text-sm text-muted-foreground mt-1">AgriCorp Suppliers Ltd.</p>
                      </div>
                      <div className="w-12 h-12 rounded bg-muted/50 border border-border flex items-center justify-center shrink-0">
                        <Sprout className="w-6 h-6 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 mb-4 grid grid-cols-2 gap-3">
                      <div>
                        <span className="font-mono text-muted-foreground block text-xs">Available Batch Qty</span>
                        <span className="text-sm font-semibold text-foreground">450 MT</span>
                      </div>
                      <div>
                        <span className="font-mono text-muted-foreground block text-xs">Expiry Date</span>
                        <span className="text-sm font-semibold text-foreground">Oct 2025</span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-secondary/30 text-secondary-foreground px-3 py-1 rounded-full border border-secondary/50">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-xs font-semibold">Registered on National Grid</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Inventory Card 2 */}
                <Card className="shadow-sm border-border hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">Urea Prilled 46% N</h3>
                        <p className="text-sm text-muted-foreground mt-1">Global Fertilizer Co.</p>
                      </div>
                      <div className="w-12 h-12 rounded bg-muted/50 border border-border flex items-center justify-center shrink-0">
                        <FlaskConical className="w-6 h-6 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 mb-4 grid grid-cols-2 gap-3">
                      <div>
                        <span className="font-mono text-muted-foreground block text-xs">Available Batch Qty</span>
                        <span className="text-sm font-semibold text-foreground">1,200 MT</span>
                      </div>
                      <div>
                        <span className="font-mono text-muted-foreground block text-xs">Expiry Date</span>
                        <span className="text-sm font-semibold text-foreground">Jan 2026</span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-secondary/30 text-secondary-foreground px-3 py-1 rounded-full border border-secondary/50">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-xs font-semibold">Registered on National Grid</span>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </section>
          </div>

          {/* Right Column: Record Transaction Action Point */}
          <aside className="lg:col-span-4">
            <Card className="shadow-sm border-border sticky top-24">
              <CardContent className="pt-6">
                <div className="mb-6 border-b border-border pb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ReceiptText className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Record Sale</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Process transaction and instantly sync with the national ledger.
                  </p>
                </div>
                
                <form className="space-y-4">
                  {/* Invoice Input */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Invoice Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <Input className="pl-10 h-10" placeholder="e.g. INV-2023-0891" />
                    </div>
                  </div>

                  {/* Buyer ID Input */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Buyer National ID / VAT</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <User className="h-5 w-5" />
                      </div>
                      <Input className="pl-10 h-10" placeholder="Enter Buyer ID" />
                    </div>
                  </div>

                  {/* Batch Selector */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Select Product Batch</label>
                    <div className="relative group">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select active batch..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="npk-15">Commercial NPK 15-15-15 (Batch: 450 MT)</SelectItem>
                          <SelectItem value="urea-46">Urea Prilled 46% N (Batch: 1,200 MT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Quantity (MT)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Weight className="h-5 w-5" />
                      </div>
                      <Input className="pl-10 h-10" placeholder="0.00" type="number" />
                    </div>
                  </div>

                  {/* Primary Action */}
                  <button
                    type="button"
                    className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] mt-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Record Sale & Sync Ledger
                  </button>

                  <p className="text-center font-mono text-muted-foreground text-xs opacity-80">
                    Transaction will be immutably recorded.
                  </p>
                </form>
              </CardContent>
            </Card>
          </aside>
          
        </div>
      </main>
    </div>
  );
}

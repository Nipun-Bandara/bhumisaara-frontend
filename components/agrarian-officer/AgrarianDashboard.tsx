"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  QrCode, 
  ScanLine, 
  ScanBarcode, 
  ShieldCheck, 
  PackageOpen
} from "lucide-react";

export default function AgrarianDashboard() {
  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">
        
        {/* Header Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Kandy Agrarian Service Center</h1>
            <p className="text-lg text-muted-foreground">
              Manage inventory and process digital handovers to verified farmers.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2 bg-secondary/30 text-secondary-foreground text-sm font-medium rounded-full border border-secondary/20 w-fit">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Connected to Polygon Amoy Testnet
          </div>
        </div>

        {/* Bento Grid Layout for Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full">
          
          {/* Handover Panel (Primary Column) */}
          <section className="xl:col-span-8 flex flex-col h-full">
            <Card className="border-border shadow-sm flex flex-col h-full">
              <CardHeader className="border-b border-border pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold text-foreground">Digital Handover</CardTitle>
                  <QrCode className="text-muted-foreground w-8 h-8" />
                </div>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                
                {/* Scanning Steps */}
                <div className="flex flex-col gap-8">
                  {/* Step 1 */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">1</span>
                      Scan Farmer Wallet QR Code
                    </label>
                    <button className="w-full bg-background py-6 px-4 rounded-lg border-2 border-dashed border-border text-muted-foreground flex items-center justify-center gap-3 hover:bg-muted/50 transition-colors active:scale-[0.98]">
                      <ScanLine className="w-8 h-8" />
                      <span className="text-lg font-medium">Tap to Scan Wallet</span>
                    </button>
                    <div className="bg-muted/30 px-4 py-3 rounded-md font-mono text-sm text-muted-foreground flex items-center justify-between border border-border/50">
                      <span>0x...</span>
                      <span className="text-xs bg-background px-2 py-0.5 rounded text-muted-foreground border border-border">Pending</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">2</span>
                      Scan Fertilizer Sack Batch QR
                    </label>
                    <button className="w-full bg-background py-6 px-4 rounded-lg border-2 border-dashed border-border text-muted-foreground flex items-center justify-center gap-3 hover:bg-muted/50 transition-colors active:scale-[0.98]">
                      <ScanBarcode className="w-8 h-8" />
                      <span className="text-lg font-medium">Tap to Scan Batch</span>
                    </button>
                    <div className="bg-muted/30 px-4 py-3 rounded-md font-mono text-sm text-muted-foreground flex items-center justify-between border border-border/50">
                      <span>Batch #101</span>
                      <span className="text-xs bg-background px-2 py-0.5 rounded text-muted-foreground border border-border">Pending</span>
                    </div>
                  </div>
                </div>

                {/* Amount and Action Steps */}
                <div className="flex flex-col gap-8 justify-between">
                  {/* Step 3 */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">3</span>
                      Amount to Dispense (KG)
                    </label>
                    <div className="relative">
                      <Input className="h-14 text-lg pr-12" placeholder="Enter amount" type="number" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-muted-foreground">KG</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" className="flex-1 h-12 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-colors">10kg</Button>
                      <Button variant="outline" className="flex-1 h-12 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-colors">25kg</Button>
                      <Button variant="outline" className="flex-1 h-12 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-colors">50kg</Button>
                    </div>
                  </div>

                  {/* Primary Action */}
                  <div className="pt-6 border-t border-border mt-auto">
                    <Button className="w-full h-10 text-lg flex items-center justify-center gap-3 shadow-md active:scale-[0.98] transition-all duration-300">
                      <ShieldCheck className="w-6 h-6" />
                      Authorize Handover
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>
          </section>

          {/* Secondary Column (Inventory) */}
          <section className="xl:col-span-4 flex flex-col h-full">
            <Card className="border-border shadow-sm flex flex-col h-full">
              <CardHeader className="border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <PackageOpen className="text-primary w-6 h-6" />
                  <CardTitle className="text-2xl font-bold text-foreground">Local Inventory</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 flex flex-col gap-6">
                
                {/* Inventory Item 1 */}
                <div className="bg-muted/20 p-6 rounded-lg border border-border flex flex-col gap-3">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Urea</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-primary">450</span>
                    <span className="text-base text-muted-foreground">kg left</span>
                  </div>
                  <div className="w-full bg-muted h-2.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>

                {/* Inventory Item 2 */}
                <div className="bg-muted/20 p-6 rounded-lg border border-border flex flex-col gap-3">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">NPK</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-secondary-foreground">1200</span>
                    <span className="text-base text-muted-foreground">kg left</span>
                  </div>
                  <div className="w-full bg-muted h-2.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-secondary-foreground h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

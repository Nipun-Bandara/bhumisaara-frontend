"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Users, 
  Store,
  PackageOpen
} from "lucide-react";

export default function DistributionLevel() {
  return (
   <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-8xl mx-auto w-full pb-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Distribution Levels</h1>
          <p className="text-lg text-muted-foreground mt">
            National overview of imported fertilizer allocations and current stock.
          </p>
        </div>

        {/* Global Summary */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border shadow-sm bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary/20 rounded-lg text-primary">
                  <PackageOpen className="w-8 h-8" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-4 mb-1">Total National Imports (MT)</p>
              <h3 className="text-5xl font-bold text-foreground">145,200</h3>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card className="border-border shadow-sm">
              <CardContent className="pt-6">
                <div className="p-2 bg-secondary rounded-lg text-secondary-foreground w-10 mb-4 flex justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Distributed to Farmers</p>
                <h3 className="text-2xl font-bold text-foreground">62,400 MT</h3>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardContent className="pt-6">
                <div className="p-2 bg-accent rounded-lg text-accent-foreground w-10 mb-4 flex justify-center">
                  <Store className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Private Agro Dealers</p>
                <h3 className="text-2xl font-bold text-foreground">18,500 MT</h3>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Regional Warehouses */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Regional Warehouse Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { region: "Western Province", stock: "15,200", capacity: "20,000", pct: 76 },
              { region: "Central Province", stock: "12,100", capacity: "15,000", pct: 80 },
              { region: "Northern Province", stock: "8,500", capacity: "10,000", pct: 85 },
              { region: "Southern Province", stock: "10,200", capacity: "15,000", pct: 68 },
              { region: "Eastern Province", stock: "7,800", capacity: "12,000", pct: 65 },
              { region: "Uva Province", stock: "10,500", capacity: "12,000", pct: 87 },
            ].map((wh, idx) => (
              <Card key={idx} className="border-border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {wh.region}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-bold text-foreground">{wh.stock} <span className="text-sm font-normal text-muted-foreground">MT</span></span>
                    <span className="text-sm font-medium text-muted-foreground">{wh.pct}% Full</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${wh.pct}%` }}></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HandoverForm from "./HandoverForm";
import { PackageOpen } from "lucide-react";

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
            <HandoverForm />
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

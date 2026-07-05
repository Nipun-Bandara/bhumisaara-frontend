"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Leaf,
  MapPin,
  CalendarDays,
  BadgeCheck,
  Rocket,
  ArrowRight,
  MoreVertical,
  Sprout,
  Droplets,
  Flower2,
  TrendingUp,
  Users,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Batch = {
  id: string;
  product: string;
  icon: React.ReactNode;
  manufactured: string;
  stock: string;
  active: boolean;
};

// ─── Data ────────────────────────────────────────────────────────────────────

const initialBatches: Batch[] = [
  {
    id: "ORG-2023-B902",
    product: "Bio-Comp Matale XL",
    icon: <Sprout className="w-4 h-4" />,
    manufactured: "22 Oct 2023",
    stock: "1,200 Kg",
    active: true,
  },
  {
    id: "ORG-2023-B905",
    product: "Seaweed Extract Pro",
    icon: <Droplets className="w-4 h-4" />,
    manufactured: "25 Oct 2023",
    stock: "450 L",
    active: true,
  },
  {
    id: "ORG-2023-B912",
    product: "Nitro-Plus Compost",
    icon: <Flower2 className="w-4 h-4" />,
    manufactured: "28 Oct 2023",
    stock: "2,500 Kg",
    active: false,
  },
];

const barHeights = ["40%", "60%", "55%", "80%", "70%", "95%", "45%"];

// ─── Component ───────────────────────────────────────────────────────────────

export default function OrganicProducerDashboard() {
  const [batches, setBatches] = useState<Batch[]>(initialBatches);

  const toggleActive = (id: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    );
  };

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Organic Producer Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage batches, marketplace listings, and community impact.
          </p>
        </div>

        {/* ── Producer Profile Panel ────────────────────────────────────────── */}
        <Card className="shadow-sm border-border overflow-hidden relative hover:shadow-md transition-shadow duration-300">
          {/* Decorative blobs */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
              {/* Logo */}
              <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg shrink-0">
                <Leaf className="w-10 h-10 text-primary-foreground" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-primary">Bio-Grow Organics Matale</h2>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/20 text-secondary-foreground text-xs font-bold rounded-full border border-secondary/30">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Gold Verification
                  </span>
                </div>
                <p className="text-muted-foreground max-w-2xl text-sm mb-4">
                  Pioneering regenerative agriculture through high-phosphorus organic compost and
                  seaweed-based fertilizers. Verified supplier for the National Grid.
                </p>
                <div className="flex flex-wrap gap-5">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium">Matale Central, LK</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <span className="font-medium">Member since 2021</span>
                  </div>
                </div>
              </div>

              {/* Token Balance */}
              <div className="bg-muted/30 border border-border rounded-xl p-6 min-w-[260px] shrink-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Total Organic Subsidy Token Balance
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-primary">45,000</span>
                  <span className="text-xl font-bold text-muted-foreground">SC</span>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Pending Settlements</span>
                    <span className="font-bold text-foreground">1,240 SC</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Main Grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Left: Marketplace Creator ─────────────────────────────────── */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Form Card */}
            <Card className="shadow-sm border-border hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground">Marketplace Creator</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Product Name</label>
                    <div className="relative group">
                      <Input className="h-10" placeholder="e.g. Bio-Green Ultra 5-5-5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Nutrient Breakdown (N-P-K %)</label>
                    <div className="relative group">
                      <Input className="h-10" placeholder="e.g. 5% Nitrogen, 3% Phosphate..." />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Price in Subsidy Credits (SC)</label>
                    <div className="relative group">
                      <Input className="h-10 pr-10" placeholder="0.00" type="number" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary pointer-events-none">
                        SC
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Product Description</label>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                      placeholder="Describe manufacturing process and certifications..."
                      rows={3}
                    />
                  </div>

                  <button
                    type="button"
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] mt-2"
                  >
                    <Rocket className="w-4 h-4" />
                    Upload Batch to Market
                  </button>
                </form>
              </CardContent>
            </Card>

            {/* Market Reach Card */}
            <Card className="shadow-sm border-border border-primary/20 bg-primary/5">
              <CardContent className="pt-5">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-semibold text-primary">Market Reach</h4>
                  <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12% this month
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground">3.2k Views</span>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* ── Right: Batch Ledger + Charts ──────────────────────────────── */}
          <div className="lg:col-span-8 space-y-6">

            {/* Batch Production Ledger */}
            <Card className="shadow-sm border-border overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardHeader className="border-b border-border pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">Batch Production Ledger</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Real-time inventory tracking and marketplace visibility
                    </p>
                  </div>
                </div>
              </CardHeader>

              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border">
                    <TableHead className="font-semibold text-muted-foreground py-4">Product Name</TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4">Batch ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4">Manufactured</TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4">Total Stock</TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4">Active</TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((batch) => (
                    <TableRow
                      key={batch.id}
                      className={`border-border hover:bg-muted/30 transition-colors ${batch.active ? "bg-primary/5" : ""}`}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-secondary/20 flex items-center justify-center text-secondary-foreground">
                            {batch.icon}
                          </div>
                          <span className="text-sm font-semibold text-foreground">{batch.product}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {batch.id}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-muted-foreground">{batch.manufactured}</TableCell>
                      <TableCell className="py-4 text-sm font-bold text-foreground">{batch.stock}</TableCell>
                      <TableCell className="py-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={batch.active}
                            onChange={() => toggleActive(batch.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                      </TableCell>
                      <TableCell className="py-4">
                        <button className="text-muted-foreground hover:text-primary transition-colors p-1 rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="p-4 border-t border-border flex justify-center bg-muted/20">
                <button className="text-sm font-medium text-primary flex items-center gap-1 hover:underline transition-all">
                  View Full Ledger History
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Card>

            {/* Bottom Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Yield Correlation Bar Chart */}
              <Card className="shadow-sm border-border overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardContent className="pt-5">
                  <h4 className="text-sm font-semibold text-foreground">Yield Correlation</h4>
                  <p className="text-xs text-muted-foreground mb-4">Batch quality vs market demand</p>
                  <div className="h-32 flex items-end justify-between gap-1">
                    {barHeights.map((h, i) => (
                      <div
                        key={i}
                        className="w-full bg-primary/30 rounded-t-sm hover:bg-primary/60 transition-all duration-300"
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Community Impact Card */}
              <Card className="shadow-sm border-border flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow duration-300">
                <CardContent className="pt-8 pb-8 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                    <Users className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Community Impact</h4>
                  <p className="text-xs text-muted-foreground mb-5">
                    You have empowered 150+ local farmers this quarter.
                  </p>
                  <button className="px-4 py-2 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-all">
                    View Case Studies
                  </button>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

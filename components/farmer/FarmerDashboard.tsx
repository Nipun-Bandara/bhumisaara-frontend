import { User, Leaf, ArrowRight, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function FarmerDashboard() {
  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-8xl mx-auto w-full pb-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Farmer Portal</h1>
          <p className="text-lg text-muted-foreground">
            Welcome back, manage your quotas and access the green market.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Identity Card */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center gap-4 mb-6 border-b border-border pb-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Arjuna Perera</h2>
                  <p className="text-sm text-muted-foreground">Verified Farmer</p>
                </div>
              </div>
              <div className="mb-6 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Land Size</span>
                  <span className="text-sm text-foreground font-bold">2.5 Acres</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Primary Crop</span>
                  <span className="text-sm text-foreground font-bold">Paddy Rice</span>
                </div>
              </div>
              <div className="bg-background p-4 rounded-lg flex flex-col items-center justify-center border border-border">
                <p className="text-sm font-medium text-muted-foreground mb-2">Wallet QR Code</p>
                <img 
                  alt="QR Code" 
                  className="w-48 h-48 object-contain rounded-md" 
                  src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"
                />
              </div>
            </div>
            
          </div>
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Quota */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-semibold text-foreground mb-6">Remaining Fertilizer Quota</h3>
              <div className="relative w-full max-w-[300px]">
                <svg className="text-primary w-full h-auto" viewBox="0 0 36 36">
                  <path className="text-muted/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="75, 100" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-primary">75<span className="text-xl font-semibold">kg</span></span>
                  <span className="text-sm text-muted-foreground mt-1">of 100kg Allocated</span>
                </div>
              </div>
            </div>
            
            {/* Green Market Card */}
            <div className="bg-secondary/50 rounded-xl p-6 shadow-sm text-secondary-foreground flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-border">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  Want Eco-Friendly Alternatives?
                </h3>
                <p className="text-sm opacity-90">
                  Swap your traditional subsidy tokens for high-quality organic fertilizer options available in our new green market.
                </p>
              </div>
              <Button variant="default" className="flex items-center gap-2 whitespace-nowrap">
                Open Green Market Exchange
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
          </div>
        </div>
        
        {/* Collections History */}
        <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-6">Past Collections History</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="font-semibold text-muted-foreground py-4">Date</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4">Item Collected</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4">Quantity</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="py-4">Oct 12, 2023</TableCell>
                  <TableCell className="py-4">Urea</TableCell>
                  <TableCell className="py-4">50kg</TableCell>
                  <TableCell className="py-4">
                    <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs font-medium">
                      <BadgeCheck className="w-4 h-4" />
                      Verified on Blockchain
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="py-4">Sep 05, 2023</TableCell>
                  <TableCell className="py-4">Potash</TableCell>
                  <TableCell className="py-4">25kg</TableCell>
                  <TableCell className="py-4">
                    <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs font-medium">
                      <BadgeCheck className="w-4 h-4" />
                      Verified on Blockchain
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="py-4">Aug 20, 2023</TableCell>
                  <TableCell className="py-4">Organic Compost Swap</TableCell>
                  <TableCell className="py-4">100kg</TableCell>
                  <TableCell className="py-4">
                    <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs font-medium">
                      <BadgeCheck className="w-4 h-4" />
                      Verified on Blockchain
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>
        
      </main>
    </div>
  );
}

import { 
  Download, 
  Truck, 
  TrendingUp, 
  CheckCircle, 
  Flame, 
  Building2, 
  ListPlus, 
  Database, 
  ArrowRight,
  Link as LinkIcon,
  Coins
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function GovermentDashboard() {
  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-8xl mx-auto w-full pb-8 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
            <p className="text-lg text-muted-foreground">
              Real-time national grid agrarian metrics.
            </p>
          </div>
          <Button variant="outline" className="hidden sm:flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>

        {/* Top KPI Metrics Ribbon */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-secondary rounded-lg text-secondary-foreground">
                <Truck className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                +5.2%
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Imported (Tons)</p>
            <h3 className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors">45,200</h3>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/20 rounded-lg text-primary">
                <Coins className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                Live
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Active Tokens Minted</p>
            <h3 className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors">1.2M</h3>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-destructive/20 rounded-lg text-destructive">
                <Flame className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Decentralized Burns</p>
            <h3 className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors">850,000</h3>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-accent rounded-lg text-accent-foreground">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                +12
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Active Agrarian Centers</p>
            <h3 className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors">342</h3>
          </div>
        </section>

        {/* Main Actions & Ledger Layout (Bento Grid Style) */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Actions Panel */}
          <div className="xl:col-span-1 bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col h-full relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <ListPlus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Register Import Batch</h3>
            </div>
            
            <form className="space-y-5 flex-1 relative z-10 flex flex-col">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Importer / Manufacturer Name</label>
                <Input placeholder="e.g., Ceylon AgriCorp" className="h-12" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Fertilizer Type</label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select compound..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urea">Urea (Nitrogen)</SelectItem>
                    <SelectItem value="mop">MOP (Muriate of Potash)</SelectItem>
                    <SelectItem value="tsp">TSP (Triple Super Phosphate)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Volume (KG)</label>
                <div className="relative">
                  <Input type="number" placeholder="0.00" className="h-12 pr-12" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="text-sm font-medium text-muted-foreground">KG</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 mt-auto">
                <Button className="w-full h-14 flex items-center justify-center gap-2 text-base group relative overflow-hidden">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                  <Database className="w-5 h-5" />
                  Mint Batch to Blockchain
                </Button>
              </div>
            </form>
          </div>

          {/* Global Live Ledger Table */}
          <div className="xl:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Global Live Ledger</h3>
              </div>
              <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-2">
                View Full History <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border">
                    <TableHead className="font-semibold text-muted-foreground py-4 px-6">Batch ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4 px-6">Token ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-right">Supply Level</TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4 px-6">Current Custodian</TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-center">Tx Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/50">
                  
                  {[
                    { batchId: "#B-902", tokenId: "TK-8821", supply: "5,000 kg", custodian: "Colombo Port Authority", txHash: "0x8f...3a9" },
                    { batchId: "#B-901", tokenId: "TK-8820", supply: "12,500 kg", custodian: "Trincomalee Depot", txHash: "0x1a...b72" },
                    { batchId: "#B-900", tokenId: "TK-8819", supply: "8,200 kg", custodian: "Northern Agro Hub", txHash: "0x4c...9f1" },
                    { batchId: "#B-899", tokenId: "TK-8818", supply: "450 kg", custodian: "In Transit (Logistics Co)", txHash: "0x7e...2d4", custodianClass: "text-muted-foreground italic" },
                    { batchId: "#B-898", tokenId: "TK-8817", supply: "2,000 kg", custodian: "Galle Distribution Center", txHash: "0x2b...5c8" },
                  ].map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/30 transition-colors duration-200 cursor-default group border-border">
                      <TableCell className="py-4 px-6">
                        <span className="font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 text-sm">
                          {row.batchId}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6 font-mono text-muted-foreground text-sm">
                        {row.tokenId}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right font-medium text-foreground">
                        {row.supply}
                      </TableCell>
                      <TableCell className={`py-4 px-6 ${row.custodianClass || "text-foreground"}`}>
                        {row.custodian}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-mono text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <LinkIcon className="w-3 h-3" /> {row.txHash}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                </TableBody>
              </Table>
            </div>
          </div>
          
        </section>
        
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}

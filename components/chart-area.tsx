"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const chartData = [
  { day: "Mon", movement: 120 },
  { day: "Tue", movement: 250 },
  { day: "Wed", movement: 180 },
  { day: "Thu", movement: 340 },
  { day: "Fri", movement: 280 },
  { day: "Sat", movement: 420 },
  { day: "Sun", movement: 310 },
]

export function ChartAreaDefault() {
  return (
    <Card className="shadow-sm border-border hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">Distribution Velocity</CardTitle>
        <CardDescription>
          Weekly Fertilizer Movement (MT)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="movementGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                itemStyle={{ color: "#16a34a" }}
              />
              <Area
                type="monotone"
                dataKey="movement"
                stroke="#16a34a"
                strokeWidth={2}
                fill="url(#movementGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#16a34a" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 14% this week <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing distribution for the last 7 days
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "জানু", revenue: 45000, expense: 32000 },
  { month: "ফেব", revenue: 52000, expense: 35000 },
  { month: "মার্চ", revenue: 48000, expense: 30000 },
  { month: "এপ্রিল", revenue: 61000, expense: 38000 },
  { month: "মে", revenue: 55000, expense: 34000 },
  { month: "জুন", revenue: 67000, expense: 40000 },
  { month: "জুলাই", revenue: 72000, expense: 42000 },
  { month: "আগস্ট", revenue: 68000, expense: 39000 },
  { month: "সেপ্ট", revenue: 75000, expense: 45000 },
  { month: "অক্টো", revenue: 82000, expense: 48000 },
  { month: "নভে", revenue: 78000, expense: 44000 },
  { month: "ডিসে", revenue: 90000, expense: 50000 },
];

export function RevenueChart() {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">আয় ও ব্যয় বিশ্লেষণ</h3>
          <p className="text-sm text-muted-foreground">বার্ষিক ওভারভিউ</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">আয়</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-sm text-muted-foreground">ব্যয়</span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickFormatter={(value) => `৳${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontFamily: "Hind Siliguri",
              }}
              formatter={(value: number) => [`৳${value.toLocaleString()}`, ""]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="আয়"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpense)"
              name="ব্যয়"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

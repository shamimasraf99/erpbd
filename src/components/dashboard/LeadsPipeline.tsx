import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "নতুন লিড", value: 35, color: "hsl(var(--primary))" },
  { name: "যোগাযোগ হয়েছে", value: 25, color: "hsl(var(--info))" },
  { name: "প্রস্তাব পাঠানো", value: 20, color: "hsl(var(--warning))" },
  { name: "আলোচনা চলছে", value: 12, color: "hsl(var(--accent))" },
  { name: "সম্পন্ন", value: 8, color: "hsl(var(--success))" },
];

export function LeadsPipeline() {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">লিড পাইপলাইন</h3>
          <p className="text-sm text-muted-foreground">মোট লিড: ১০০</p>
        </div>
        <button className="text-sm text-primary hover:underline">
          বিস্তারিত
        </button>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontFamily: "Hind Siliguri",
              }}
              formatter={(value: number) => [`${value}টি`, ""]}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => (
                <span style={{ fontFamily: "Hind Siliguri", fontSize: "13px" }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-success">৳১২.৫ লাখ</p>
          <p className="text-xs text-muted-foreground">সম্ভাব্য মূল্য</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">২৮%</p>
          <p className="text-xs text-muted-foreground">কনভার্সন রেট</p>
        </div>
      </div>
    </div>
  );
}

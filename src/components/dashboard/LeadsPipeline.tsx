import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import { useLeadsPipelineData } from "@/hooks/useDashboardStats";

const stageLabels: Record<string, string> = {
  "new": "নতুন লিড",
  "contacted": "যোগাযোগ হয়েছে",
  "proposal": "প্রস্তাব পাঠানো",
  "negotiation": "আলোচনা চলছে",
  "won": "সম্পন্ন",
};

const stageColors: Record<string, string> = {
  "new": "hsl(var(--primary))",
  "contacted": "hsl(var(--info))",
  "proposal": "hsl(var(--warning))",
  "negotiation": "hsl(var(--accent))",
  "won": "hsl(var(--success))",
};

function formatCurrency(value: number) {
  if (value >= 100000) {
    return `৳${(value / 100000).toFixed(1)} লাখ`;
  }
  return `৳${value.toLocaleString('bn-BD')}`;
}

function toBanglaNumber(num: number): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(d => banglaDigits[parseInt(d)] || d).join('');
}

export function LeadsPipeline() {
  const { data: pipelineData, isLoading } = useLeadsPipelineData();

  const chartData = pipelineData ? Object.entries(pipelineData).map(([stage, data]) => ({
    name: stageLabels[stage],
    value: data.count,
    color: stageColors[stage],
  })).filter(item => item.value > 0) : [];

  const totalLeads = chartData.reduce((sum, item) => sum + item.value, 0);
  const totalValue = pipelineData ? Object.values(pipelineData).reduce((sum, data) => sum + data.value, 0) : 0;
  const wonLeads = pipelineData?.won.count || 0;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">লিড পাইপলাইন</h3>
          <p className="text-sm text-muted-foreground">মোট লিড: {toBanglaNumber(totalLeads)}</p>
        </div>
        <button className="text-sm text-primary hover:underline">
          বিস্তারিত
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[280px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[280px]">
          <p className="text-muted-foreground">কোনো লিড নেই</p>
        </div>
      ) : (
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
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
                formatter={(value: number) => [`${toBanglaNumber(value)}টি`, ""]}
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
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-success">{formatCurrency(totalValue)}</p>
          <p className="text-xs text-muted-foreground">সম্ভাব্য মূল্য</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{toBanglaNumber(conversionRate)}%</p>
          <p className="text-xs text-muted-foreground">কনভার্সন রেট</p>
        </div>
      </div>
    </div>
  );
}

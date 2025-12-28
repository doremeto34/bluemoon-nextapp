'use client'
import { Chart, useChart } from "@chakra-ui/charts"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useEffect, useState } from "react";
import { getLast12MonthsRevenueAction } from "@/lib/serverUtils";

interface RevenueData {
  month: string;
  amount: number;
}
function getLast12MonthsSkeleton() {
  const result: { key: string; label: string; amount: number }[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      key: `${d.getFullYear()}-${d.getMonth() + 1}`,
      label: d.toLocaleString("default", { month: "short" }),
      amount: 0,
    });
  }

  return result;
}
export async function getRevenueChartData() {
  const skeleton = getLast12MonthsSkeleton();
  const rows = await getLast12MonthsRevenueAction();

  const map = new Map(
    rows.map(r => [`${r.year}-${r.month}`, Number(r.total)])
  );

  return skeleton.map(m => ({
    month: m.label,
    amount: map.get(m.key) ?? 0,
  }));
}
export default function MonthlyReveiceChart() {
  const [data, setData] = useState<RevenueData[] | null>(null);

  useEffect(() => {
    getRevenueChartData().then(setData);
  }, []);

  // Always call useChart, even if data isn't loaded yet
  const chart = useChart({
    data: data || [], // empty array until data loads
    series: [{ name: "amount", color: "teal.solid" }],
  });

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <BarChart data={chart.data} barGap={4}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis axisLine={false} tickLine={false} dataKey={chart.key("month")} />
        <YAxis
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
          tickFormatter={chart.formatNumber({
            style: "currency",
            currency: "VND",
            notation: "compact",
          })}
        />
        <Tooltip
          cursor={{ fill: chart.color("bg.muted") }}
          animationDuration={100}
          content={<Chart.Tooltip />}
        />
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          wrapperStyle={{ paddingLeft: 30 }}
          content={<Chart.Legend orientation="vertical" />}
        />
        {chart.series.map((item) => (
          <Bar
            key={item.name}
            isAnimationActive={true}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            radius={10}
          />
        ))}
      </BarChart>
    </Chart.Root>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Chart, useChart } from "@chakra-ui/charts"
import { Cell, Pie, PieChart, Tooltip, Legend } from "recharts"
import { getDashboardPieChartAction } from "@/lib/serverUtils"

const COLORS: Record<string, string> = {
  Monthly: "blue.solid",
  Vehicle: "orange.solid",
  Electric: "teal.solid",
  Water: "green.solid",
  Internet: "yellow.solid",
};

export default function ReceivePieChart() {
  const [chartData, setChartData] = useState<
    { name: string; value: number; color: string }[]
  >([]);

  useEffect(() => {
  const fetchData = async () => {
    const result = await getDashboardPieChartAction();

    if (!result) {
      setChartData([]);
      return;
    }

    const formatted = result.map((row: any) => ({
      name: row.name,
      value: Number(row.value),
      color: COLORS[row.name] ?? "gray.solid",
    }));

    setChartData(formatted);
  };

  fetchData();
}, []);

  const chart = useChart({
    data: chartData
  })

  return (
    <Chart.Root boxSize="320px" mx="auto" chart={chart}>
      <PieChart>
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip hideLabel />}
        />
        <Legend content={<Chart.Legend />} />
        <Pie
          isAnimationActive={false}
          data={chart.data}
          dataKey={chart.key("value")}
          labelLine={{ stroke: chart.color("border.emphasized") }}
          label={{
            fill: chart.color("fg.muted"),
            style: { fontWeight: "600" },
          }}
        >
          {chart.data.map((item) => (
            <Cell key={item.name} fill={chart.color(item.color)} />
          ))}
        </Pie>
      </PieChart>
    </Chart.Root>
  )
}

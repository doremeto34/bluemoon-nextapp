'use client'
import { Chart, useChart } from "@chakra-ui/charts"
import { Card, Select, Portal, HStack, createListCollection } from "@chakra-ui/react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useEffect, useState } from "react";
import { getLast12MonthsUtilityRevenueAction } from "@/lib/serverUtils";

const typeCollection = createListCollection({
  items: [
    { value: "Electric", label: "Electricity" },
    { value: "Water", label: "Water" },
    { value: "Internet", label: "Internet" },
  ],
});

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
export async function getRevenueChartData(selectedType: string) {
  const skeleton = getLast12MonthsSkeleton();
  const rows = await getLast12MonthsUtilityRevenueAction(selectedType);

  const map = new Map(
    rows.map(r => [`${r.year}-${r.month}`, Number(r.total)])
  );

  return skeleton.map(m => ({
    month: m.label,
    amount: map.get(m.key) ?? 0,
  }));
}
export default function UtilityReceiveChart() {
  const [data, setData] = useState<RevenueData[] | null>(null);
  const [selectedType, setSelectedType] = useState("Electric");
  useEffect(() => {
    getRevenueChartData(selectedType).then(setData);
  }, [selectedType]);

  // Always call useChart, even if data isn't loaded yet
  const chart = useChart({
    data: data || [], // empty array until data loads
    series: [{ name: "amount", color: "teal.solid" }],
  });

  return (
    <Card.Root rounded="lg" boxShadow="md">
      <Card.Header minH="64px">
        <HStack justify="space-between">
          <Card.Title>Utility Receive</Card.Title>
          <Select.Root
            collection={typeCollection}
            size="sm"
            width="30%"
            multiple={false}
            onValueChange={(details) => {
              setSelectedType(details.value[0]);
            }}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select type" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner position="relative">
                <Select.Content>
                  {typeCollection.items.map((type) => (
                    <Select.Item item={type} key={type.value}>
                      {type.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </HStack>
      </Card.Header>
      <Card.Body>
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
      </Card.Body>
    </Card.Root>
  )
}
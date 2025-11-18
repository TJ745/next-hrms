"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface GenderChartProps {
  data: {
    male: number;
    female: number;
    other: number;
  };
}

export const description = "A donut chart with text";

export function ChartPieDonutText({ data }: GenderChartProps) {
  
  const chartData = [
    { gender: "Male", count: data.male, fill: "var(--chart-1)" },
    { gender: "Female", count: data.female, fill: "var(--chart-2)" },
    { gender: "Other", count: data.other, fill: "var(--chart-3)" },
  ];

  const totalEmployees = data.male + data.female + data.other;

  const chartConfig: ChartConfig = {
    Male: { label: "Male", color: "var(--chart-1)" },
    Female: { label: "Female", color: "var(--chart-2)" },
    Other: { label: "Other", color: "var(--chart-3)" },
  };


  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="gender"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalEmployees}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Employees
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="gender" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

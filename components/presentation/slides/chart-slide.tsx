import React from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { SlideWrapper } from '../slide-wrapper'

interface ChartData {
  date: string
  subscribers: number
}

interface ChartSlideProps {
  data: ChartData[]
  caption: string
  label?: string
}

export function ChartSlide({ data, caption, label = "Подписчики" }: ChartSlideProps) {
  return (
    <SlideWrapper slideKey="chart-slide"> 
      <div className="flex h-full w-full flex-col items-center justify-center p-12">
        <div className="h-full w-full min-h-[300px]">
          
          <ChartContainer
            config={{
              subscribers: {
                label: label,
                color: '#2563eb', 
              },
            }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent hideIndicator />}
                />
                
                <Line
                  dataKey="subscribers"
                  type="monotone"
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={false}

                  strokeDasharray="8 8"
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

        </div>
        <div className="mt-4 text-center text-xl text-muted-foreground">
          {caption}
        </div>
      </div>
    </SlideWrapper>
  )
}

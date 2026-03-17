"use client"

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip
} from "recharts"

const data = [
  { value: 12 },
  { value: 45 },
  { value: 22 },
  { value: 78 },
  { value: 158 }
]

export default function LineGraph() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        
        <Tooltip
          cursor={false}
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #fb923c",
            borderRadius: "6px",
            fontSize: "12px"
          }}
        />

        <Line
          type="monotone"
          dataKey="value"
          stroke="#ea580c"
          strokeWidth={1}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
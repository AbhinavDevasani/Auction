"use client"

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip
} from "recharts"

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-white border border-orange-400 rounded-lg p-2 shadow-md text-xs text-gray-700">
        <p className="font-bold text-orange-600">{dataPoint.date}</p>
        <p className="font-medium text-gray-900">Total Spent: ₹{dataPoint.value}</p>
        {dataPoint.title && (
          <p className="text-[10px] text-gray-500 max-w-[150px] truncate mt-0.5">
            Won: {dataPoint.title}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function LineGraph({ data }) {
  if (!data || data.length <= 1) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-orange-950 px-4 text-center select-none">
        <p className="font-semibold text-sm">No spending history yet</p>
        <p className="text-[11px] text-orange-900 opacity-80 mt-1 max-w-[200px]">
          Win some auctions to see your spending trend plot here!
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 15, right: 15, left: 15, bottom: 10 }}>
        <Tooltip cursor={false} content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#ea580c"
          strokeWidth={2}
          dot={{ r: 4, stroke: "#ea580c", strokeWidth: 1, fill: "#ffffff" }}
          activeDot={{ r: 6, stroke: "#ea580c", strokeWidth: 1, fill: "#ea580c" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
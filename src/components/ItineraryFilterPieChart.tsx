'use client'

import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#EF4444', '#3B82F6', '#FFC107', '#666666'];

interface ItineraryFilterPieChartProps {
    data?: { name: string; value: number }[];
    allocations?: {
        activities: number;
        lodging: number;
        transportation: number;
    };
}

export default function ItineraryFilterPieChart({ data: propData, allocations }: ItineraryFilterPieChartProps) {
    const defaultData = [
        { name: 'Activities', value: allocations?.activities || 40 },
        { name: 'Lodging', value: allocations?.lodging || 35 },
        { name: 'Transportation', value: allocations?.transportation || 25 },
    ];
    
    let data = propData || defaultData;
    
    // If all values are 0, use default data to show the chart structure
    const hasNonZeroValues = data.some(item => item.value > 0);
    if (!hasNonZeroValues) {
        data = defaultData;
    }
    
    return (
        <PieChart width={100} height={100} onMouseEnter={() => { }}>
            <Pie
                data={data}
                cx={50}
                cy={50}
                innerRadius={30}
                outerRadius={45}
                cornerRadius={5}
                paddingAngle={5}
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke='#666666' strokeWidth={1} />
                ))}
            </Pie>
        </PieChart>
    );
}


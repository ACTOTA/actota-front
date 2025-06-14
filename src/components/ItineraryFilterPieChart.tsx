'use client'

import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0252D0', '#C10B2F', '#988316', '#666666'];

interface ItineraryFilterPieChartProps {
    data?: { name: string; value: number }[];
}

export default function ItineraryFilterPieChart({ data: propData }: ItineraryFilterPieChartProps) {
    const defaultData = [
        { name: 'Activities', value: 40 },
        { name: 'Lodging', value: 40 },
        { name: 'Transportation', value: 30 },
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


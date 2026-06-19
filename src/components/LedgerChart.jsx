import React, { useEffect, useMemo, useRef } from 'react';
import Chart from 'chart.js/auto';

const LedgerChart = ({ transactions }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const chartData = useMemo(() => {
        const months = {};
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const label = d.toLocaleString('default', { month: 'short', year: 'numeric' });
            months[label] = { sales: 0, purchases: 0 };
        }

        transactions.forEach(t => {
            const d = new Date(t.date);
            if (isNaN(d.getTime())) return;
            const label = d.toLocaleString('default', { month: 'short', year: 'numeric' });
            if (months[label] !== undefined) {
                months[label].sales += (t.saleAmount || 0);
                months[label].purchases += (t.purchaseValue || 0);
            }
        });

        return {
            labels: Object.keys(months),
            sales: Object.values(months).map(m => m.sales),
            purchases: Object.values(months).map(m => m.purchases)
        };
    }, [transactions]);

    useEffect(() => {
        if (chartRef.current) chartRef.current.destroy();
        if (canvasRef.current && window.Chart) {
            const ctx = canvasRef.current.getContext('2d');
            chartRef.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [
                        { label: 'Goods Purchases', data: chartData.purchases, backgroundColor: 'rgba(59, 130, 246, 0.85)', borderRadius: 6 },
                        { label: 'Sales/Payments', data: chartData.sales, backgroundColor: 'rgba(16, 185, 129, 0.85)', borderRadius: 6 }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }
            });
        }
        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, [chartData]);

    return <div className="h-64 md:h-80 w-full relative"><canvas ref={canvasRef}></canvas></div>;
};

export default LedgerChart;

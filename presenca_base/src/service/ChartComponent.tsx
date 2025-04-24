import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { Participant } from "../types";

interface ChartComponentProps {
  participantes: Participant[];
}

export function ChartComponent({ participantes }: ChartComponentProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const gerarGrafico = () => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const labels = participantes.map((p) => p.name);
    const presencaData = participantes.map((p) => p.presences);
    const faltaData = participantes.map((p) => p.presences);

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Presenças",
            data: presencaData,
            backgroundColor: "rgba(75, 168, 32, 0.6)",
          },
          {
            label: "Faltas",
            data: faltaData,
            backgroundColor: "rgba(255, 0, 0, 0.6)",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true },
          datalabels: {
            color: "white",
            anchor: "center",
            align: "center",
            formatter: (value) => (value > 0 ? value : ""), // Esconde valores 0
          },
        },
        scales: {
          x: { stacked: true },
          y: {
            beginAtZero: true,
            stacked: true,
            ticks: { precision: 0 },
          },
        },
      },
    });
  };

  useEffect(() => {
    gerarGrafico();
    return () => chartInstance.current?.destroy();
  }, [participantes]);

  return <canvas ref={chartRef} />;
}

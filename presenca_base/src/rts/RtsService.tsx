import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

interface TableParticipant {
  name: string;
  role: string;
  presencesFinal: number;
  faultsFinal: number;
}

interface AtualizarTabelaParams {
  participantes: TableParticipant[];
  table: string;
  idBase: string;
}

export function atualizarTabela({
  participantes,
  table,
  idBase,
}: AtualizarTabelaParams) {
  console.log(`Atualizando tabela para a base: ${idBase}`);

  const tabela = document
    .getElementById(table)
    ?.getElementsByTagName("tbody")[0];
  if (!tabela) return;

  tabela.innerHTML = "";

  participantes.forEach((participant) => {
    const row = tabela.insertRow();
    const porcentagemPresenca =
      ((participant.presencesFinal / 9) * 100).toFixed(0) + "%";

    row.insertCell(0).textContent = participant.name;
    row.insertCell(1).textContent = participant.role;
    row.insertCell(2).textContent = String(participant.presencesFinal);
    row.insertCell(3).textContent = String(participant.faultsFinal);
    row.insertCell(4).textContent = porcentagemPresenca;
  });
}

interface Participant {
  name: string;
  presences: number;
  faults: number;
}

let chartInstance: Chart | null = null; // Declara a variável chartInstance

interface GerarGraficoParams {
  participantes: Participant[];
  chart: string;
  idBase: string;
}

interface GerarGraficoParams {
  participantes: Participant[];
  chart: string;
  idBase: string;
}

export function gerarGrafico({ participantes, chart }: GerarGraficoParams) {
  const ctx = document.getElementById(chart) as HTMLCanvasElement | null;
  if (!ctx) return;

  // Destruir o gráfico anterior se existir
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  const labels = participantes.map((p) => p.name);
  const presencas = participantes.map((p) => p.presences);
  const faltas = participantes.map((p) => p.faults);

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Presenças",
          data: presencas,
          backgroundColor: "rgba(75, 168, 32, 0.8)",
        },
        {
          label: "Faltas",
          data: faltas,
          backgroundColor: "rgba(250, 21, 21, 0.8)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: true,
        },
        legend: {
          display: true,
        },
        datalabels: {
          color: "white",
          anchor: "center",
          align: "center",
          formatter: (value) => {
            return value > 0 ? value : "";
          },
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          beginAtZero: true,
          stacked: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  });
}

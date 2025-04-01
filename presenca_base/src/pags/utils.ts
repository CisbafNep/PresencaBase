import Chart from 'chart.js/auto';
import { Participant } from '../types';

const totalAulas = 9;
let chartInstance: Chart | null = null;

export function atualizarTabela(participantes: Participant[], table: string) {
    const tabela = document.getElementById(table)?.getElementsByTagName('tbody')[0];
    if (!tabela) return;

    tabela.innerHTML = '';

    participantes.forEach((participant) => {
        const row = tabela.insertRow();
        const porcentagemPresenca = ((participant.presences / totalAulas) * 100).toFixed(0) + '%';

        row.insertCell(0).textContent = participant.name;
        row.insertCell(1).textContent = participant.role;
        row.insertCell(2).textContent = String(participant.presences);
        row.insertCell(3).textContent = String(participant.faults);
        row.insertCell(4).textContent = porcentagemPresenca;
    });
}

export function gerarGrafico(participantes: Participant[], chart:string) {
    const ctx = document.getElementById(chart) as HTMLCanvasElement | null;
    if (!ctx) return;

    // Destruir gráfico anterior se existir
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    const labels = participantes.map(p => p.name);
    const presencas = participantes.map(p => p.presences);
    const faltas = participantes.map(p => p.faults);

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Presenças",
                    data: presencas,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
                {
                    label: "Faltas",
                    data: faltas,
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// Função para limpar o gráfico quando não for mais necessário
export function limparGrafico() {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
}
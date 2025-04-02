import { useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Hook para pegar os parâmetros da URL
import { atualizarTabela, gerarGrafico } from "./RtsService";
import "../styles/rts.css";
import { RtSHeader } from "./RTSHeader.tsx";
import { useGetAllUsers } from "../hooks/getAllUsers";

const RTsQueimados = () => {
  const idTabela = "tabela-presenca-queimadosrt";
  const idChart = "presenca-chart-queimadosrt";

  const [searchParams] = useSearchParams();
  const idBase = searchParams.get("idBase") || ""; // Captura o idBase da URL

  const { data, isLoading, isError } = useGetAllUsers({ baseName: idBase });

  useEffect(() => {
    if (idBase && data?.data) {
      const participantes = Array.isArray(data.data) ? data.data : [data.data];
      atualizarTabela({ participantes, table: idTabela, idBase }); // Passando idBase
      gerarGrafico({ participantes, chart: idChart, idBase }); // Passando idBase
    }
  }, [data, idBase]); // Adicionando idBase como dependência

  if (!idBase) return <p>Erro: Base não informada na URL.</p>;
  if (isLoading) return <p>Carregando participantes...</p>;
  if (isError) return <p>Erro ao carregar os participantes.</p>;

  return (
    <>
      <RtSHeader title={`${idBase}`} url={`/queimados`} />
      <main>
        <div className="content active" id="contentQueimadosrt">
          <p style={{ textAlign: "center" }}>
            <img alt="" src="/Samu-logo.png" style={{ width: "120px" }} />
          </p>
          <h1 style={{ textAlign: "center" }}>
            Acompanhamento de presenças base SAMU {idBase}
          </h1>
          <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
            Controle de presenças
          </h2>
          <p>
            Obs: Para estar apto a receber o certificado de conclusão, o
            colaborador deve obter o mínimo de
            <b> 70%(setenta porcento) </b> da presença nos treinamentos.
          </p>
          <table id={idTabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Presença</th>
                <th>Faltas</th>
                <th>Presença %</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div id="chart-container-queimadosrt">
            <canvas id={idChart}></canvas>
          </div>
        </div>
      </main>
    </>
  );
};

export default RTsQueimados;

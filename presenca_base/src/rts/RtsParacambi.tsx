import { useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Hook para pegar os parâmetros da URL
import { atualizarTabela, gerarGrafico } from "./RtsService";
import "../styles/rts.css";
import { RtSHeader } from "./RTSHeader.tsx";
import { useGetAllUsers } from "../hooks/getAllUsers";

const RTsParacambi = () => {
  const idTabela = "tabela-presenca-paracambirt";
  const idChart = "presenca-chart-paracambirt";

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
      <RtSHeader />

      <body className="body-simulator" id="contentparacambirt">
        <div className="centered-content">
          <p className="logo-container">
            <img
              alt="SAMU Logo"
              src="/Samu-logo.png"
              className="responsive-logo"
            />
          </p>
          <h1 className="title">
            Acompanhamento de presenças base SAMU {idBase}
          </h1>
          <h2 className="subtitle">Controle de presenças</h2>
          <p className="observation">
            Obs: Para estar apto a receber o certificado de conclusão, o
            colaborador deve obter o mínimo de
            <b> 70%(setenta porcento) </b> da presença nos treinamentos.
          </p>
          <div className="table-wrapper">
            <table id="tabela-presenca-paracambirt">
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
            <div className="chart-container" id="chart-container-paracambirt">
              <canvas id="presenca-chart-paracambirt"></canvas>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default RTsParacambi;

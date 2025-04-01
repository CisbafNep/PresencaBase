import { useEffect, useState } from "react";
import { Participant } from "../types";
import { atualizarTabela, gerarGrafico } from "./utils";
import "../styles/rts.css";
import { RtSHeader } from "./RTSHeader.tsx";

const RTsParacambi = () => {
  const idTabela = "tabela-presenca-paracambirt";
  const idChart = "presenca-chart-paracambirt";

  const [participants] = useState<Participant[]>(
    JSON.parse(localStorage.getItem("participantes_paracambiContent") || "[]")
  );

  useEffect(() => {
    atualizarTabela(participants, idTabela);
    gerarGrafico(participants, idChart);
  }, [participants]);

  return (
    <>
      <RtSHeader title={"PARACAMBI"} url={"/paracambi"} />
      <aside></aside>
      <main>
        <div className="content active" id="contentparacambirt">
          <br />
          <br />
          <br />
          <p style={{ textAlign: "center" }}>
            <img alt="" src="/Samu-logo.png" style={{ width: "120px" }} />
          </p>
          <h1 style={{ textAlign: "center" }}>
            Acompanhamento de presenças base SAMU Paracambi
          </h1>
          <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
            Controle de presenças
          </h2>
          <br />
          <br />
          <p>
            Obs: Para estar apto a receber o certificado de conclusão, o
            colaborador deve obter o mínimo de
            <b>70%(setenta porcento)</b> da presença nos treinamentos.
          </p>
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
            <tbody>{/* Presentes adicionados aqui */}</tbody>
          </table>
          <div id="chart-container-paracambi">
            <canvas id="presenca-chart-paracambirt"></canvas>
          </div>
        </div>
      </main>
    </>
  );
};

export default RTsParacambi;

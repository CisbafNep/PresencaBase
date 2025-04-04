import React, { useState } from "react";
import QRCode from "qrcode.react"; // Biblioteca React para QRCode
import html2canvas from "html2canvas";
import "./style.css"; // Mantendo o CSS separado

const QRCodeGenerator = () => {
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("MEDICO");
  const [qrcodeData, setQrcodeData] = useState("");
  const [apiStatus, setApiStatus] = useState("");

  // Formatar nome removendo espaços extras
  const formatarNome = (nome) => nome.trim().replace(/\s+/g, " ");

  const gerarQRCode = async () => {
    const nomeFormatado = formatarNome(nome);
    setNome(nomeFormatado);

    if (!nomeFormatado || !cargo) {
      alert("Por favor, preencha os campos!");
      return;
    }

    const cargoDisplay = cargo
      .replace("_", " ")
      .toLowerCase()
      .replace(/(^|\s)\S/g, (l) => l.toUpperCase());
    setQrcodeData(`Nome:${nomeFormatado}||Cargo:${cargo}`);

    // Enviar dados para API
    await enviarDadosAPI(nomeFormatado, cargo);
  };

  const enviarDadosAPI = async (nome, cargo) => {
    const data = { name: nome, role: cargo, faults: 0, presences: 0 };

    setApiStatus("Enviando dados para o servidor...");
    try {
      const response = await fetch("http://localhost:8060/user", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao enviar dados");

      setApiStatus("Dados enviados com sucesso!");
    } catch (error) {
      setApiStatus("Erro ao enviar: Por favor, comunique a equipe de suporte.");
      console.error("Erro:", error);
    }
  };

  const baixarQRCode = async () => {
    const qrCodeElement = document.getElementById("qrcode");
    if (!qrCodeElement) return;

    const canvas = await html2canvas(qrCodeElement);
    const imgData = canvas.toDataURL("image/jpeg");

    const link = document.createElement("a");
    link.href = imgData;
    link.download = "qrcode.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <div>
        <img src="/iconx.png" alt="Icon" style={{ width: "120px" }} />
        <img
          src="/Samu-logo.png"
          alt="Samu Logo"
          style={{ width: "120px", float: "right" }}
        />
        <h1>GERAR QR CODE PARA VALIDAÇÃO DE PRESENÇA</h1>
        <h2>BASES SAMU</h2>
      </div>

      <div className="dados">
        <label htmlFor="nome">Colaborador:</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome..."
        />

        <label htmlFor="cargo">Selecione o cargo:</label>
        <select
          id="cargo"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
        >
          <option value="MEDICO">Médico(a)</option>
          <option value="ENFERMEIRO">Enfermeiro(a)</option>
          <option value="CONDUTOR">Condutor</option>
          <option value="TEC_ENFERMAGEM">Téc. Enfermagem</option>
        </select>

        <br />
        <button id="generate" onClick={gerarQRCode}>
          Gerar QRCODE
        </button>

        <br />
        <br />
        {qrcodeData && (
          <>
            <div id="qrcode">
              <QRCode value={qrcodeData} size={150} />
            </div>
            <p>
              Nome do colaborador: {nome} || Cargo: {cargo.replace("_", " ")}
            </p>

            <button
              id="sendWhatsapp"
              onClick={baixarQRCode}
              style={{ border: "none", background: "none", cursor: "pointer" }}
            >
              <i className="fa fa-download" style={{ fontSize: "58px" }}></i>
            </button>
            <p>Baixar</p>
          </>
        )}

        {apiStatus && (
          <p style={{ color: apiStatus.includes("Erro") ? "red" : "green" }}>
            {apiStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;

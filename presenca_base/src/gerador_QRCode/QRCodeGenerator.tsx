import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { Cargo, Participant } from "../types";
import { Enviroments } from "../env/variaveis";
import "./qrcodegen.css";

const apiUrl = Enviroments.REACT_APP_API;

function QRCodeGenerator() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idBase = queryParams.get("idBase") || "";

  const [name, setName] = useState("");
  const [role, setRole] = useState<Cargo | "">("");
  const [baseName, setBaseName] = useState(idBase);
  const [generated, setGenerated] = useState(false);
  const [status, setStatus] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBaseName(idBase);
  }, [idBase]);

  const sendDataToAPI = async (participant: Omit<Participant, "id">) => {
    setStatus("Enviando dados...");
    try {
      if (!apiUrl) throw new Error("API URL is not defined");

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(participant),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Dados enviados com sucesso!");
        console.log("Resposta da API:", result);
      } else {
        throw new Error(result.message || "Erro ao enviar dados");
      }
    } catch (error: any) {
      console.error(error);
      setStatus("Erro ao enviar: Por favor, comunique a equipe de suporte");
    }
  };

  const handleGenerate = async () => {
    if (generated) {
      // Resetar todos os campos e estado
      setName("");
      setRole("");
      setGenerated(false);
      setStatus("");
      return;
    }

    const trimmedName = name.trim();
    if (!trimmedName || !role) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    const participant: Omit<Participant, "id"> = {
      name: trimmedName,
      role,
      baseName: "Espera",
      presences: 0,
      faults: 0,
      presencesFinal: 0,
      faultsFinal: 0,
    };

    await sendDataToAPI(participant);
    setGenerated(true);
  };

  const handleDownload = async () => {
    if (qrRef.current) {
      const canvas = await html2canvas(qrRef.current);
      const imgData = canvas.toDataURL("image/jpeg");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "qrcode.jpg";
      link.click();
    }
  };

  return (
    <div className="container">
      <h1>Gerar QR Code para Validação de Presença</h1>

      {!generated && (
        <>
          <div className="form-group">
            <label htmlFor="colaborador">Colaborador:</label>
            <input
              id="colaborador"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="cargo">Cargo:</label>
            <select
              id="cargo"
              value={role}
              onChange={(e) => setRole(e.target.value as Cargo)}
            >
              <option value="">Selecione</option>
              <option value="Médico(a)">Médico(a)</option>
              <option value="Enfermeiro(a)">Enfermeiro(a)</option>
              <option value="Condutor">Condutor</option>
              <option value="Téc. Enfermagem">Téc. Enfermagem</option>
            </select>
          </div>
        </>
      )}

      <div className="button-group">
        <button className="generate-btn" onClick={handleGenerate}>
          {generated ? "Gerar Outro QR Code" : "Gerar QR Code"}
        </button>
        <button className="generate-btn" onClick={() => window.history.back()}>
          Voltar
        </button>
      </div>

      {generated && (
        <div className="qr-section">
          <div ref={qrRef} className="qr-code">
            <QRCodeSVG
              value={`Nome:${name}||Cargo:${role}||Base:${baseName}`}
              size={150}
            />
          </div>

          <div className="info">
            <p>Nome: {name}</p>
            <p>Cargo: {role}</p>
            <p>Base: {baseName}</p>
          </div>

          <button className="download-btn" onClick={handleDownload}>
            Baixar QR Code
          </button>
        </div>
      )}

      {status && <div className="status">{status}</div>}
    </div>
  );
}

export default QRCodeGenerator;

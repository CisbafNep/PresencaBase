import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./leitor.css";

interface UserData {
  name: string;
  role: string;
}

export function LeitorQRCode() {
  const [status, setStatus] = useState("Aguardando leitura do QR code...");
  const [userData, setUserData] = useState<UserData | null>(null);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const readerRef = useRef<HTMLDivElement | null>(null);

  // Sucesso na leitura
  const onScanSuccess = (decodedText: string) => {
    try {
      const parts = decodedText.split("||");
      const nomePart = parts.find((p) => p.startsWith("Nome:"));
      const cargoPart = parts.find((p) => p.includes("Cargo:"));

      if (!nomePart || !cargoPart)
        throw new Error("Formato do QR Code inválido");

      const nome = nomePart.split(":")[1].trim();
      const cargo = cargoPart.split(":")[1].trim();

      setUserData({ name: nome, role: cargo });
      setStatus(`QR code lido: ${nome} - ${cargo}`);

      if (scannerRef.current) scannerRef.current.clear();
    } catch (error) {
      console.error("Erro ao processar QR Code:", error);
      setStatus("QR Code inválido!");
    }
  };

  // Falha na leitura
  const onScanFailure = (error: any) => {
    console.warn(`Erro ao ler QR code: ${error}`);
    setStatus("Erro na leitura, tente novamente.");
  };

  // Inicializa scanner
  useEffect(() => {
    if (readerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        {
          fps: 15,
          qrbox: { width: 300, height: 300 },
        },
        false
      );

      scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => console.error(err));
      }
    };
  }, []);

  // Envia presença
  const adicionarPresenca = async () => {
    if (!userData) {
      alert("Nenhum QR code válido foi lido ainda!");
      return;
    }

    const statusElement = document.getElementById("apiStatus");
    if (statusElement) {
      statusElement.textContent = "Registrando presença...";
      statusElement.style.color = "blue";
    }

    try {
      const response = await fetch("http://localhost:8060/user/presence", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userData.name, role: userData.role }),
      });

      if (response.ok) {
        if (statusElement) {
          statusElement.textContent = "Presença registrada com sucesso!";
          statusElement.style.color = "green";
        }
        alert(` Presença de ${userData.name} (${userData.role}) registrada!`);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Erro no servidor");
      }
    } catch (error) {
      console.error("Erro:", error);
      if (statusElement) {
        statusElement.textContent =
          "Erro: Por favor, comunicar a equipe de suporte.";
        statusElement.style.color = "red";
      }
      alert(
        " Erro ao registrar presença: Por favor, comunicar a equipe de suporte."
      );
    }
  };

  // Permite ler novo QR code
  const lerOutroQRCode = () => {
    setUserData(null);
    setStatus("Aguardando leitura do QR code...");

    const apiStatus = document.getElementById("apiStatus");
    if (apiStatus) apiStatus.textContent = "";

    if (scannerRef.current) {
      scannerRef.current.render(onScanSuccess, onScanFailure);
    }
  };

  return (
    <div className="scanner-container">
      <h1 className="scanner-title">
        VALIDADOR DE PRESENÇA - TREINAMENTOS SAMU
      </h1>

      <div id="reader" ref={readerRef} className="qr-reader"></div>

      <p id="status" className="status-message">
        {status}
      </p>
      <div id="apiStatus" className="api-status"></div>

      {userData && (
        <div className="action-buttons">
          <button className="btn add-btn" onClick={adicionarPresenca}>
            Adicionar Presença
          </button>
          <button className="btn reset-btn" onClick={lerOutroQRCode}>
            Ler Outro QR Code
          </button>
        </div>
      )}
    </div>
  );
}

export default LeitorQRCode;

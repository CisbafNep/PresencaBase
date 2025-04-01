import { Service } from "../service/userService.tsx";
import { useState } from "react";
import { Header } from "./Header.tsx";

export function QueimadosContent() {
  const idBase = "QUEIMADOS";
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("light", !isDarkMode);
  };
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div id="contentqueimados" className="content active">
      <Header toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />
      <details style={{ textAlign: "right" }}>
        <summary>
          <h3>Legendas: (clique para abrir)</h3>
        </summary>
        <div style={{ textAlign: "right" }}>
          <p>
            <span style={{ color: "green" }}>Presença</span>: Adiciona presença
            do colaborador na tabela.
          </p>
          <p>
            <span style={{ color: "red" }}>Falta</span>: Adiciona falta do
            colaborador na tabela.
          </p>
          <p>
            <span style={{ textDecoration: "underline" }}>Limpar</span>: Limpa
            status do colaborador na tabela.
          </p>
          <p>
            <span style={{ textDecoration: "underline" }}>Remover</span>: Remove
            o colaborador na tabela.
          </p>
          <p>
            <span style={{ color: "orange" }}>Ação</span>: Executa a opção
            escolhida na caixa(limpar ou remover).
          </p>
        </div>
      </details>
      <p style={{ textAlign: "center" }}>
        <img src="/Samu-logo.png" style={{ width: "120px" }} alt="SAMU Logo" />
      </p>
      <h1 style={{ textAlign: "center" }}>
        Acompanhamento de presenças base SAMU Queimados
      </h1>
      <br />
      <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
        Controle de presenças
      </h2>
      <br />
      <br />
      <Service idBase={idBase} rts="/RtsQueimados" />
    </div>
  );
}

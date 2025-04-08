import { Service } from "../service/userService.tsx";
import { useState } from "react";
import { Header } from "../components/Header.tsx";
import "./contentStyle.css";

export function QueimadosContent() {
  const idBase = "QUEIMADOS";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="body-simulator">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <main className="content-container">
        <div className="header-content">
          <img src="/Samu-logo.png" className="samu-logo" alt="SAMU Logo" />
          <h1>Acompanhamento de presenças base SAMU Queimados</h1>
          <h2>Controle de presenças</h2>
        </div>

        <Service idBase={idBase} rts="/RtsQueimados" />
      </main>
    </div>
  );
}

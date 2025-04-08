import { Service } from "../service/userService.tsx";
import { Header } from "../components/Header.tsx";
import { useState } from "react";
import "./contentStyle.css";

export function NilopolisContent() {
  const idBase = "NILOPOLIS";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="body-simulator">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <main className="content-container">
        <div className="header-content">
          <img src="/Samu-logo.png" className="samu-logo" alt="SAMU Logo" />
          <h1>Acompanhamento de presenças base SAMU Nilopolis</h1>
          <h2>Controle de presenças</h2>
        </div>

        <Service idBase={idBase} rts="/RtsNilopolis" />
      </main>
    </div>
  );
}

import { Route, Routes, useLocation } from "react-router-dom";
import { NilopolisContent } from "./contents/NilopolisContent.tsx";
import "./styles/variables.css";
import "./styles/main.css";
import { ParacambiContent } from "./contents/ParacambiContent.tsx";
import { QueimadosContent } from "./contents/QueimadosiContent.tsx";
import RtsNilopolis from "./rts/RtsNilopolis.tsx";
import RTsParacambi from "./rts/RtsParacambi.tsx";
import RtsQueimados from "./rts/RtsQueimados.tsx";
import { Menu } from "./components/Menu.tsx";
import { useEffect, useRef, useState } from "react";
import { Layout } from "./components/Layout.tsx";
import QRCodeGenerator from "./gerador_QRCode/QRCodeGenerator.tsx";
import LeitorQRCode from "./leitor_qrcode/LeitorQRCode.tsx";
import {PeopleManagement} from "./contents/PeopleManagement.tsx";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const reloadFlag = useRef(false);

  // Atualização de tabelas
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (previousPath.current !== location.pathname && !reloadFlag.current) {
      reloadFlag.current = true;
      previousPath.current = location.pathname;

      requestAnimationFrame(() => {
        window.location.reload();
      });
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const showSidebarToggle = windowWidth < 768;

  return (
    <>
      <Routes>
        <Route path="" element={<Menu />} />
        <Route path="/nilopolis" element={<NilopolisContent />} />
        <Route path="/paracambi" element={<ParacambiContent />} />
        <Route path="/queimados" element={<QueimadosContent />} />
        <Route path="/RtsNilopolis" element={<RtsNilopolis />} />
        <Route path="/RtsParacambi" element={<RTsParacambi />} />
        <Route path="/RtsQueimados" element={<RtsQueimados />} />
        <Route path="/gerador_QRCode" element={<QRCodeGenerator />} />
        <Route path="/gestao_presenca" element={<PeopleManagement />} />
        <Route path="/leitor" element={<LeitorQRCode />} />
      </Routes>

      <Layout
        children={showSidebarToggle}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        windowWidth={windowWidth}
      />
    </>
  );
}

export default App;

import { Route, Routes, useLocation } from "react-router-dom";
import { NilopolisContent } from "./components/NilopolisContent";
import "./styles/variables.css";
import "./styles/main.css";
import { ParacambiContent } from "./components/ParacambiContent.tsx";
import { QueimadosContent } from "./components/QueimadosiContent.tsx";
import RtsNilopolis from "./pags/RtsNilopolis.tsx";
import RTsParacambi from "./pags/RtsParacambi.tsx";
import RtsQueimados from "./pags/RtsQueimados.tsx";
import { createTheme, ThemeProvider } from "@mui/material";
import { Menu } from "./components/Menu.tsx";
import { useEffect, useRef, useState } from "react";
import { Layout } from "./components/Layout.tsx";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });
  const showSidebarToggle = windowWidth < 768;

  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      previousPath.current = location.pathname;
      window.location.reload();
    }
  }, [location.pathname]);

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="" element={<Menu />} />
        <Route path="/nilopolis" element={<NilopolisContent />} />
        <Route path="/paracambi" element={<ParacambiContent />} />
        <Route path="/queimados" element={<QueimadosContent />} />
        <Route path="/RtsNilopolis" element={<RtsNilopolis />} />
        <Route path="/RtsParacambi" element={<RTsParacambi />} />
        <Route path="/RtsQueimados" element={<RtsQueimados />} />
      </Routes>

      <Layout
        children={showSidebarToggle}
        darkMode={darkMode}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        windowWidth={windowWidth}
      />
    </ThemeProvider>
  );
}

export default App;

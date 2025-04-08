import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import "../styles/main.css";

interface LayoutProps {
  children: React.ReactNode;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  windowWidth: number;
}

export function Layout({
  children,
  toggleSidebar,
  isSidebarOpen,
  windowWidth,
}: LayoutProps) {
  const location = useLocation();
  const isRtsRoute = [
    "/gerador_QRCode/",
    "/RtsNilopolis",
    "/RtsParacambi",
    "/RtsQueimados",
    "/leitor",
    "/",
  ].includes(location.pathname);
  const showSidebar = windowWidth < 768 && !isRtsRoute;

  return (
    <div className="app-container">
      {showSidebar && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <MenuIcon color="warning" />
        </button>
      )}

      {showSidebar && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      <div style={{ display: "none" }} className="main-content">
        {children}
      </div>
    </div>
  );
}

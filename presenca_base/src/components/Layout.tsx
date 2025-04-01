// components/Layout.tsx
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import "../styles/main.css";

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  windowWidth: number;
}

export function Layout({
  children,
  darkMode,
  toggleSidebar,
  isSidebarOpen,
  windowWidth,
}: LayoutProps) {
  const location = useLocation();
  const isRtsRoute = [
    "/RtsNilopolis",
    "/RtsParacambi",
    "/RtsQueimados",
    "/",
  ].includes(location.pathname);
  const showSidebar = windowWidth < 768 && !isRtsRoute;

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      {showSidebar && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <MenuIcon color="warning" />
        </button>
      )}

      {showSidebar && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      <div className="main-content">{children}</div>
    </div>
  );
}

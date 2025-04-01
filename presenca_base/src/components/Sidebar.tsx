import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  return (
    <nav id="sidebar" className={`sidebar ${isOpen ? "active" : ""}`}>
      <button className="close-sidebar" onClick={toggleSidebar}>
        &times;
      </button>

      <div className="sidebar-links">
        <Link to="/" onClick={toggleSidebar}>
          VOLTAR AO MENU
        </Link>
        <Link to="/nilopolis" onClick={toggleSidebar}>
          NILÓPOLIS
        </Link>
        <Link to="/paracambi" onClick={toggleSidebar}>
          PARACAMBI
        </Link>
        <Link to="/queimados" onClick={toggleSidebar}>
          QUEIMADOS
        </Link>
      </div>
    </nav>
  );
}

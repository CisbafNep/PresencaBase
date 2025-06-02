import icon from "../assets/iconx.png";
import "../styles/main.css";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}
export function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  return (
    <header className={`main-header ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <button
        className="logo-btn "
        style={{ margin: "none", border: "none", background: "none" }}
      >
        <a href="/">
          <img src={icon} className="logox" width="150px" alt="Logo" />
        </a>
      </button>
      <button
        className="menu-toggle"
        style={{
          width: "40px",
          height: "40px",
          fontSize: "25px",
          background: "none",
          border: "none",
        }}
        onClick={toggleSidebar}
      ></button>

      <button style={{ background: "none", border: "none" }}>
        <a href="/nilopolis">NILÓPOLIS</a>
      </button>
      <button style={{ background: "none", border: "none" }}>
        <a href="/paracambi">PARACAMBI</a>
      </button>
      <button style={{ background: "none", border: "none" }}>
        <a href="/queimados">QUEIMADOS</a>
      </button>
        <button style={{ background: "none", border: "none" }}>
            <a href="/gestao_presenca">GERENCIAMENTO</a>
        </button>
    </header>
  );
}

import { Link } from "react-router-dom";
import icon from "../assets/iconx.png";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="main-header">
      <img src={icon} className="logox" width="150px" alt="Logo" />
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
      <Link to="/">VOLTAR AO MENU</Link>
      <Link to="/nilopolis">NILÓPOLIS</Link>
      <Link to="/paracambi">PARACAMBI</Link>
      <Link to="/queimados">QUEIMADOS</Link>
    </header>
  );
}

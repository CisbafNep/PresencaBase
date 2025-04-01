import { Link } from "react-router-dom";

export function NavigationBar() {
  return (
    <nav className="main-nav">
      <Link to="/">VOLTAR AO MENU</Link>
      <Link to="/nilopolis">NILÓPOLIS</Link>
      <Link to="/paracambi">PARACAMBI</Link>
      <Link to="/queimados">QUEIMADOS</Link>
      <Link to="/RtsNilopolis">RTs Nilópolis</Link>
      <Link to="/RtsParacambi">RTs Paracambi</Link>
      <Link to="/RtsQueimados">RTs Queimados</Link>
    </nav>
  );
}

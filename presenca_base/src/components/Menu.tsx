import "../styles/menu.css";
import image from "../assets/iconx.png";

export function Menu() {
  return (
    <body
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ justifyContent: "center" }}></div>
      <div className="bodyMenu">
        <img src={image} width="500px" style={{ alignItems: "center" }} />

        <p style={{ textAlign: "center" }}></p>
        <div>
          <p style={{ textAlign: "center" }}>
            <a href="/nilopolis">
              <button className="btz">Nilópolis</button>
            </a>
            <a href="/paracambi">
              <button className="btz">Paracambi</button>
            </a>
            <a href="/queimados">
              <button className="btz">Queimados</button>
            </a>
          </p>
        </div>
      </div>
    </body>
  );
}

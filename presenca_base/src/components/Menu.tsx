import "../styles/menu.css";

export function Menu() {
  return (
    <body
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <div className="bodyMenu">
        <h1 className="title" style={{ textAlign: "center", color: "" }}>
          Acompanhamento de presenças dos treinamentos nas bases SAMU
        </h1>
        <p style={{ textAlign: "center" }}>
          <img src="/iconx.png" alt="" style={{ width: "250px" }} />
        </p>
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

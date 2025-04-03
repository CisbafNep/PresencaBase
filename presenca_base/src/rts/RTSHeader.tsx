import { WbSunny } from "@mui/icons-material";
import icon from "../assets/iconx.png";

const toggleModelu = () => {
  const html = document.documentElement;
  html.classList.toggle("lightu");
  const modelu = html.classList.contains("lightu") ? "lightu" : "darku";
  localStorage.setItem("modelu", modelu);
};
interface RTsHeaderProps {
  title: string;
  url: string;
}

export function RtSHeader({ title, url }: RTsHeaderProps) {
  return (
    <header className="main-header">
      <img className="logox" src={icon} width="150px" alt="Logo" />
      <a href={url}> BASE SAMU {title}</a>
      <button
        onClick={toggleModelu}
        style={{
          width: "40px",
          height: "40px",
          fontSize: "30px",
          border: "none",
          background: "none",
        }}
      >
        <WbSunny color="warning" style={{ cursor: "pointer" }}></WbSunny>
      </button>
    </header>
  );
}

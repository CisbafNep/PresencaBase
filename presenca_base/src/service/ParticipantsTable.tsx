import { Button, CircularProgress, Alert } from "@mui/material";
import { Participant } from "../types";
import "./service_styles/ParticipantsTable.css";

interface ParticipantsTableProps {
  participantes: Participant[];
  isLoading: boolean;
  isError: boolean;
  onUpdatePresence: (id: number, tipo: "presenca" | "falta") => void;
  onClearOrRemove: (id: number, acao: "limpar" | "remover") => void;
}

export function ParticipantsTable({
  participantes,
  isLoading,
  isError,
  onUpdatePresence,
  onClearOrRemove,
}: ParticipantsTableProps) {
  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <CircularProgress />
        <p>Carregando participantes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" style={{ margin: "20px" }}>
        Erro ao carregar participantes!
      </Alert>
    );
  }

  return (
    <table
      id="participants-table"
      style={{ width: "100%" }}
      className="table_wrapper"
    >
      <thead>
        <tr>
          <th className={"table_header"}>Nome</th>
          <th className={"table_header"}>Cargo</th>
          <th className={"table_header"}>Presença</th>
          <th className={"table_header"}>Faltas</th>
          <th className={"table_header"}>Presença %</th>
          <th className={"table_header"}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {participantes.map((p, index) => (
          <tr key={p.id ?? `temp-key-${index}`} className={"table_row"}>
            <td className={"table_cell"}>{p.name}</td>
            <td className={"table_cell"}>{p.role}</td>
            <td className={"table_cell"}>{p.presences}</td>
            <td className={"table_cell"}>{p.faults}</td>
            <td className={"table_cell"}>
              {p.presences + p.faults > 0
                ? Math.round((p.presences / (p.presences + p.faults)) * 100)
                : 0}
              %
            </td>
            <td className={"table_cell"}>
              <Button
                style={{
                  padding: "3px",
                  backgroundColor: "#31B404",
                  color: "white",
                  marginRight: "5px",
                  cursor: "pointer",
                  border: "2px solid rgb(59, 70, 55)",
                  margin: "3px",
                }}
                onClick={() => onUpdatePresence(p.id, "presenca")}
              >
                Presença
              </Button>
              <Button
                style={{
                  padding: "3px",
                  backgroundColor: "red",
                  color: "white",
                  marginRight: "5px",
                  cursor: "pointer",
                  border: "2px solid rgb(92, 45, 45)",
                  margin: "3px",
                }}
                onClick={() => onUpdatePresence(p.id, "falta")}
              >
                Falta
              </Button>
              <select
                id={`acao-${p.id}`}
                style={{
                  marginRight: "5px",
                  cursor: "pointer",
                  width: "80px",
                  height: "35px",
                  border: "3px solid",
                  borderRadius: "4px",
                  padding: "3px",
                  margin: "3px",
                }}
              >
                <option value="limpar">Limpar</option>
                <option value="remover">Remover</option>
              </select>
              <Button
                style={{
                  backgroundColor: "orange",
                  color: "white",
                  cursor: "pointer",
                  border: "2px solid rgb(116, 77, 28)",
                  padding: "3px",
                  margin: "3px",
                }}
                onClick={() => {
                  const select = document.getElementById(
                    `acao-${p.id}`
                  ) as HTMLSelectElement;
                  onClearOrRemove(p.id, select.value as "limpar" | "remover");
                }}
              >
                Ação
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

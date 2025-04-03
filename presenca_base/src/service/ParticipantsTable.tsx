import { Button, CircularProgress, Alert } from "@mui/material";
import { Participant } from "../types";

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
      style={{ width: "100%", borderCollapse: "collapse" }}
    >
      <thead>
        <tr>
          <th style={tableHeaderStyle}>Nome</th>
          <th style={tableHeaderStyle}>Cargo</th>
          <th style={tableHeaderStyle}>Presença</th>
          <th style={tableHeaderStyle}>Faltas</th>
          <th style={tableHeaderStyle}>Presença %</th>
          <th style={tableHeaderStyle}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {participantes.map((p, index) => (
          <tr key={p.id ?? `temp-key-${index}`} style={tableRowStyle}>
            <td style={tableCellStyle}>{p.name}</td>
            <td style={tableCellStyle}>{p.role}</td>
            <td style={tableCellStyle}>{p.presences}</td>
            <td style={tableCellStyle}>{p.faults}</td>
            <td style={tableCellStyle}>
              {p.presences + p.faults > 0
                ? Math.round((p.presences / (p.presences + p.faults)) * 100)
                : 0}
              %
            </td>
            <td style={tableCellStyle}>
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

// Estilos originais
const tableHeaderStyle = {
  backgroundColor: "#f5f5f5",
  padding: "12px",
  borderBottom: "1px solid #ddd",
  textAlign: "left" as const,
};

const tableRowStyle = {
  borderBottom: "1px solid #ddd",
  "&:hover": {
    backgroundColor: "#f9f9f9",
  },
};

const tableCellStyle = {
  padding: "12px",
  textAlign: "left" as const,
};

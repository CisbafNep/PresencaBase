import { useLayoutEffect, useRef, useEffect } from "react";
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
  // Ref para o container da tabela
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  // Ref para salvar a posição atual do scroll
  const scrollPositionRef = useRef<number>(0);

  // Antes de atualizar (baseado na mudança de tamanho da lista) salve a posição do scroll
  useEffect(() => {
    if (tableWrapperRef.current) {
      scrollPositionRef.current = tableWrapperRef.current.scrollTop;
    }
  }, [participantes.length]);

  // Após a atualização, restaure a posição do scroll
  useLayoutEffect(() => {
    if (tableWrapperRef.current) {
      // Use setTimeout para garantir que o DOM esteja atualizado antes de aplicar o scroll
      setTimeout(() => {
        tableWrapperRef.current!.scrollTop = scrollPositionRef.current;
      }, 0);
    }
  }, [participantes]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <CircularProgress />
        <p>Carregando participantes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" className="error-alert">
        Erro ao carregar participantes!
      </Alert>
    );
  }

  return (
    <div className="table_wrapper" ref={tableWrapperRef}>
      <table className="table">
        <thead>
          <tr>
            <th className="table_header">Nome</th>
            <th className="table_header">Cargo</th>
            <th className="table_header">Presença</th>
            <th className="table_header">Faltas</th>
            <th className="table_header">Presença %</th>
            <th className="table_header">Ações</th>
          </tr>
        </thead>
        <tbody>
          {participantes.map((p, index) => (
            <tr key={p.id ?? `temp-key-${index}`} className="table_row">
              <td className="table_cell">{p.name}</td>
              <td className="table_cell">{p.role}</td>
              <td className="table_cell numericCell">{p.presences}</td>
              <td className="table_cell numericCell">{p.faults}</td>
              <td className="table_cell numericCell">
                {p.presences + p.faults > 0
                  ? Math.round((p.presences / 9) * 100)
                  : 0}
                %
              </td>
              <td className="table_cell actionCell">
                <div className="actionsGroup">
                  <Button
                    className="presenceButton"
                    variant="contained"
                    color="success"
                    onClick={() => onUpdatePresence(p.id, "presenca")}
                  >
                    Presença
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    className="absenceButton"
                    onClick={() => onUpdatePresence(p.id, "falta")}
                  >
                    Falta
                  </Button>
                  <select className="actionSelect" id={`acao-${p.id}`}>
                    <option value="limpar">Limpar</option>
                    <option value="remover">Remover</option>
                  </select>
                  <Button
                    variant="contained"
                    color="warning"
                    className="orangeButton"
                    onClick={() => {
                      const select = document.getElementById(
                        `acao-${p.id}`
                      ) as HTMLSelectElement;
                      onClearOrRemove(
                        p.id,
                        select.value as "limpar" | "remover"
                      );
                    }}
                  >
                    Ação
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

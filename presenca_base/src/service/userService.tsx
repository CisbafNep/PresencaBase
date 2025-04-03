import { useEffect, useRef, useState } from "react";
import { Participant } from "../types";
import { useGetUser } from "../hooks/getUsers";
import { usePutUser } from "../hooks/putUsers";
import { Button, Input, Alert, CircularProgress, Box } from "@mui/material";
import { useGetUserLive } from "../hooks/getUsersLive";
import { useGetAllUsers } from "../hooks/getAllUsers";
import { ChartComponent } from "./ChartComponent";
import { ParticipantsTable } from "./ParticipantsTable";
import { exportParticipantsToXLS } from "./exportUtils";

interface ServiceProps {
  idBase: string;
  rts: string;
}

export function Service({ idBase, rts }: ServiceProps) {
  // Estados
  const [nome, setNome] = useState("");
  const [searchName, setSearchName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [participantes, setParticipantes] = useState<Participant[]>([]);

  // Hooks customizados
  const { data: userData, isLoading } = useGetUser(searchName);
  const { mutateAsync: put } = usePutUser("");
  const {
    data: fetchedParticipants,
    isLoading: isLoadingParticipants,
    isError: isErrorParticipants,
  } = useGetAllUsers({ baseName: idBase || "" });
  const participantsQueries = useGetUserLive(participantes.filter((p) => p));
  const previousData = useRef<Participant[]>([]);

  // Efeito para carregar participantes iniciais
  useEffect(() => {
    if (!fetchedParticipants) return;

    // Transformar os participantes em um array, caso não seja já
    const participantesArray = Array.isArray(fetchedParticipants)
      ? fetchedParticipants
      : fetchedParticipants?.data
      ? Array.isArray(fetchedParticipants.data)
        ? fetchedParticipants.data
        : [fetchedParticipants.data]
      : [];

    // Criar um Map para garantir IDs únicos
    const uniqueParticipants = [
      ...new Map(participantesArray.map((p) => [p.id, p])).values(),
    ];

    setParticipantes(ordenarParticipantes(uniqueParticipants));
  }, [fetchedParticipants]);

  // Efeito para adicionar novo participante
  useEffect(() => {
    const handleAddParticipant = async () => {
      if (!isAdding || !userData?.data) return;

      const userFromApi = userData.data;

      // Garantir que o ID é único antes de adicionar
      if (!participantes.some((p) => p.id === userFromApi.id)) {
        const novoParticipante = { ...userFromApi, baseName: idBase };

        try {
          await put(novoParticipante);

          setParticipantes((prev) => {
            const uniqueParticipants = [
              ...new Map(
                [...prev, novoParticipante].map((p) => [p.id, p])
              ).values(),
            ];
            return ordenarParticipantes(uniqueParticipants);
          });
        } catch (error) {
          console.error("Erro ao adicionar participante:", error);
          alert("Erro ao salvar participante!");
        }
      } else {
        alert("Usuário já está na lista!");
      }

      setIsAdding(false);
      setSearchName("");
      setNome("");
    };

    handleAddParticipant();
  }, [userData, isAdding, idBase, participantes, put]);

  // Efeito para atualização em tempo real
  useEffect(() => {
    const newData = participantsQueries
      .filter((q) => q.isSuccess)
      .map((q) => q.data!)
      .filter(Boolean);

    if (JSON.stringify(newData) !== JSON.stringify(previousData.current)) {
      setParticipantes((prev) =>
        prev.map((p) => newData.find((nd) => nd.id === p.id) || p)
      );
      previousData.current = newData;
    }
  }, [participantsQueries]);

  // Funções de manipulação
  const ordenarParticipantes = (lista: Participant[]) =>
    [...lista].sort((a, b) => a.name.localeCompare(b.name));

  const atualizarPresenca = async (id: number, tipo: "presenca" | "falta") => {
    const updated = participantes.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          presences: tipo === "presenca" ? p.presences + 1 : p.presences,
          faults: tipo === "falta" ? p.faults + 1 : p.faults,
        };
      }
      return p;
    });

    try {
      const participantToUpdate = updated.find((p) => p.id === id);
      if (participantToUpdate) await put(participantToUpdate);
      setParticipantes(updated);
    } catch (error) {
      console.error("Erro na atualização:", error);
      alert("Erro ao atualizar dados!");
    }
  };

  const limpar = (id: number) => {
    setParticipantes(
      participantes.map((p) => {
        if (p.id === id) {
          const updated = { ...p, presences: 0, faults: 0 };
          put(updated);
          return updated;
        }
        return p;
      })
    );
  };
  const limparOuRemover = async (id: number, acao: "limpar" | "remover") => {
    if (acao === "limpar") {
      limpar(id);
    } else {
      const participant = participantes.find((p) => p.id === id);
      if (participant) {
        await put({ ...participant, baseName: "Espera" });
        setParticipantes((prev) => prev.filter((p) => p.id !== id));
      }
    }
  };

  const finalizarPresencas = async () => {
    try {
      await Promise.all(
        participantes.map((p) =>
          put({ ...p, presences: 0, faults: 0, baseName: "Espera" })
        )
      );
      setParticipantes([]);
    } catch (error) {
      console.error("Erro ao finalizar presenças:", error);
      alert("Erro no processo de finalização!");
    }
  };

  const getUsers = async () => {
    if (!nome.trim()) return;
    try {
      setIsAdding(true);
      setSearchName(nome);
      await atualizarBaseNameExistente();
    } catch (error) {
      console.error("Erro na atualização:", error);
      alert("Erro na atualização da base!");
    }
  };

  const atualizarBaseNameExistente = async () => {
    const updated = participantes.map((p) => ({ ...p, baseName: idBase }));
    try {
      await Promise.all(updated.map((p) => put(p)));
      setParticipantes(ordenarParticipantes(updated));
    } catch (error) {
      console.error("Erro na atualização:", error);
      throw error;
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Controles superiores - Estilo original */}
      <div
        id="controls"
        className="controls"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
          ...(window.matchMedia("(max-width: 768px)").matches
            ? { flexDirection: "column" }
            : {}),
        }}
      >
        <Input
          color="error"
          id={idBase}
          placeholder="Nome do colaborador..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              getUsers();
            }
          }}
          sx={{
            flex: 1,
            maxWidth: "280px",
            backgroundColor: "white",
            borderRadius: "4px",
            padding: "0 10px",
            "& input": {
              padding: "12px",
            },
          }}
        />
        <Button
          variant="contained"
          color="error"
          onClick={getUsers}
          disabled={isLoading}
          sx={{
            height: "40px",
            "@media (max-width: 768px)": {
              width: "100%",
              height: "48px",
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Adicionar"}
        </Button>
      </div>
      <br />

      {/* Tabela com estilos originais */}
      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          marginBottom: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <ParticipantsTable
          participantes={participantes}
          isLoading={isLoadingParticipants}
          isError={isErrorParticipants}
          onUpdatePresence={atualizarPresenca}
          onClearOrRemove={limparOuRemover}
        />
      </div>
      <br></br>

      {/* Controles inferiores - Estilo original */}
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          margin: "20px 0",
          flexWrap: "wrap",
          "& button": {
            flex: "1 1 180px",
          },
          "@media (max-width: 768px)": {
            gap: "8px",
            "& button": {
              width: "100%",
              height: "48px",
            },
          },
        }}
      >
        <Button
          color="success"
          variant="contained"
          style={{
            width: "150px",
            color: "white",
            border: "none",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={() => setShowChart((prev) => !prev)}
        >
          Gerar Gráfico
        </Button>
        <Button
          color="error"
          variant="contained"
          style={{
            width: "150px",
            color: "#fff",
            border: "none",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={finalizarPresencas}
        >
          Finalizar
        </Button>
      </Box>

      {/* Gráfico */}
      {showChart && (
        <div id={idBase}>
          <ChartComponent participantes={participantes} />
        </div>
      )}

      {/* Loading e erros - Estilo original */}
      {isLoadingParticipants && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <CircularProgress />
          <p>Carregando participantes...</p>
        </div>
      )}

      {isErrorParticipants && (
        <Alert severity="error" style={{ margin: "20px" }}>
          Erro ao carregar participantes!
        </Alert>
      )}

      <br />

      {/* Rodapé - Estilo original */}
      <div style={{ display: "flex", gap: "15px" }}>
        <Button
          variant="contained"
          style={{
            width: "200px",
            padding: "10px",
            border: "none",
            background: "black",
          }}
        >
          <a
            href={`${rts}?idBase=${idBase}`}
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Checar relatórios RTs
          </a>
        </Button>
        <Button
          color="secondary"
          variant="contained"
          style={{
            width: "180px",
            padding: "10px",
            border: "none",
            color: "white",
          }}
          onClick={() => exportParticipantsToXLS(participantes, idBase)}
        >
          Exportar para XLS
        </Button>
      </div>
    </div>
  );
}

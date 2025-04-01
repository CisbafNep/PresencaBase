import React, { useEffect, useRef, useState } from "react";
import { Participant } from "../types";
import { useGetUser } from "../hooks/getUsers";
import { usePutUser } from "../hooks/putUsers";
import { Chart } from "chart.js/auto";
import { Alert, Button, CircularProgress, Input } from "@mui/material";
import { useGetUserLive } from "../hooks/getUsersLive";
import * as XLSX from "xlsx";
import { useGetAllUsers } from "../hooks/getAllUsers";

interface ServiceProps {
  idBase: string;
  rts: string;
}

export function Service({ idBase, rts }: ServiceProps) {
  const [nome, setNome] = useState("");
  const [searchName, setSearchName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [participantes, setParticipantes] = useState<Participant[]>(() => {
    try {
      const saved = localStorage.getItem(`participantes_${idBase}`);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Erro ao carregar participantes:", error);
      return []; // Fallback garantido
    }
  });

  const { data: userData, error, isLoading } = useGetUser(searchName);
  const { mutateAsync: put } = usePutUser("");
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const participantsQueries = useGetUserLive(
    Array.isArray(participantes) ? participantes : []
  );
  const previousData = useRef<Participant[]>([]);

  const {
    data: fetchedParticipants,
    isLoading: isLoadingParticipants,
    isError: isErrorParticipants,
  } = useGetAllUsers({ baseName: idBase, nome: searchName });

  useEffect(() => {
    if (fetchedParticipants) {
      setParticipantes(
        Array.isArray(fetchedParticipants.data)
          ? fetchedParticipants.data
          : [fetchedParticipants.data]
      );
      localStorage.setItem(
        `participantes_${idBase}`,
        JSON.stringify(fetchedParticipants)
      );
    }
  }, [fetchedParticipants, idBase]);

  // Efeito para carregar do localStorage enquanto os dados não chegam
  useEffect(() => {
    const saved = localStorage.getItem(`participantes_${idBase}`);
    if (saved && !fetchedParticipants) {
      setParticipantes(JSON.parse(saved));
    }
  }, [idBase, fetchedParticipants]);

  const exportToXLS = () => {
    const data = participantes.map((p) => ({
      Nome: p.name,
      Cargo: p.role,
      Presença: p.presences,
      Faltas: p.faults,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participantes");
    XLSX.writeFile(
      wb,
      `Participantes_${idBase.replace("Content", "")}_${
        new Date().toISOString().split("T")[0]
      }.xls`
    );
  };
  // Salva os participantes no localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(
        `participantes_${idBase}`,
        JSON.stringify(participantes)
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [participantes, idBase]);

  // Carrega os participantes do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`participantes_${idBase}`);
    if (saved) {
      setParticipantes(JSON.parse(saved));
    }
  }, [idBase]);

  // Adiciona usuário quando os dados da API chegam
  useEffect(() => {
    if (isAdding && userData?.data) {
      const userFromApi = userData.data;
      console.log("Dados recebidos da API:", userFromApi);

      const userExists = participantes.some((p) => p.id === userFromApi.id);
      if (!userExists) {
        const novoParticipante: Participant = {
          id: userFromApi.id,
          name: userFromApi.name,
          role: userFromApi.role,
          presences: userFromApi.presences,
          faults: userFromApi.faults,
          baseName: userFromApi.baseName,
        };
        console.log(novoParticipante);
        setParticipantes((prev) => [...prev, novoParticipante]);
        setNome("");
      } else {
        alert("Usuário já está na lista!");
      }
      setIsAdding(false);
      setSearchName("");
    }
  }, [userData, isAdding, participantes]);

  // Trata erros na busca
  useEffect(() => {
    if (isAdding && error) {
      console.error("Erro na busca:", error);
      alert("Erro ao buscar usuário! Verifique o console para detalhes.");
      setIsAdding(false);
      setSearchName("");
    }
  }, [error, isAdding]);

  // Atualiza os participantes conforme as queries de dados ao vivo
  useEffect(() => {
    const newData = participantsQueries
      .filter((q) => q.isSuccess)
      .map((q) => q.data!)
      .filter(Boolean);

    // Verificação adicional de tipo
    if (
      Array.isArray(newData) &&
      JSON.stringify(newData) !== JSON.stringify(previousData.current)
    ) {
      setParticipantes((prev) => {
        // Garante que prev é array antes do map
        if (!Array.isArray(prev)) return prev;

        return prev.map((p) => newData.find((nd) => nd.id === p.id) || p);
      });

      previousData.current = newData;
    }
  }, [participantsQueries]);
  // Atualiza presença ou falta e realiza o PUT no backend
  const atualizarPresenca = (id: number, tipo: "presenca" | "falta") => {
    setParticipantes(
      participantes.map((p) => {
        if (p.id === id) {
          const updated = {
            ...p,
            presences: tipo === "presenca" ? p.presences + 1 : p.presences,
            faults: tipo === "falta" ? p.faults + 1 : p.faults,
          };
          put(updated);
          return updated;
        }
        return p;
      })
    );
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

  const finalizarPresencas = () => {
    setParticipantes((prev) => {
      const updated = prev.map((p) => {
        const newP = { ...p, presences: 0, faults: 0 };
        put(newP);
        return newP;
      });
      return updated.filter(() => false); // Remove todos os participantes
    });
  };

  const getUsers = async () => {
    if (nome.trim()) {
      try {
        setIsAdding(true);
        setSearchName(nome);

        // Atualiza baseName apenas para novos participantes
        const updatedParticipants = participantes.map((p) => ({
          ...p,
          baseName: idBase,
        }));
        setParticipantes(updatedParticipants);
        await Promise.all(
          updatedParticipants.map(async (p) => {
            await put(p); // Usar mutateAsync se for react-query
          })
        );
      } catch (error) {
        console.error("Erro ao atualizar base:", error);

        // Reverte estado em caso de erro
        setParticipantes(participantes);
        alert("Erro na atualização da base!");
      } finally {
        setIsAdding(false);
      }
    }
  };

  const gerarGrafico = () => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const labels = participantes.map((p) => p.name);
    const presencaData = participantes.map((p) => p.presences);
    const faltaData = participantes.map((p) => p.faults);

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Presenças",
            data: presencaData,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
          {
            label: "Faltas",
            data: faltaData,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
        ],
      },
      options: {
        scales: {
          x: {
            stacked: true,
          },
          y: {
            beginAtZero: true,
            max: 9,
            stacked: true,
            ticks: {
              precision: 0,
              callback: function (value) {
                return value; // + '%';
              },
            },
          },
        },
      },
    });
  };

  // Gera o gráfico apenas quando o estado showChart muda para true
  useEffect(() => {
    if (showChart) {
      gerarGrafico();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [showChart, participantes]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      getUsers();
    }
  };

  return (
    <div>
      <div id="controls" className="controls" style={{ marginBottom: "10px" }}>
        <Input
          color="error"
          id={idBase}
          placeholder="Nome do colaborador..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{ marginRight: "10px", color: "gray" }}
        />
        <Button
          variant="contained"
          color="error"
          onClick={getUsers}
          disabled={isLoading}
        >
          {isLoading ? "Buscando..." : "Adicionar participante"}
        </Button>
      </div>
      <br />

      <table id={idBase}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cargo</th>
            <th>Presença</th>
            <th>Faltas</th>
            <th>Presença %</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(participantes) && participantes.length > 0 ? (
            participantes.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.role}</td>
                <td>{p.presences}</td>
                <td>{p.faults}</td>
                <td>
                  {p.presences + p.faults > 0
                    ? Math.round((p.presences / (p.presences + p.faults)) * 100)
                    : 0}
                  %
                </td>
                <td>
                  <Button
                    style={{
                      padding: "3px",
                      backgroundColor: "#31B404",
                      color: "white",
                      marginRight: "5px",
                      cursor: "pointer",
                      border: "1px solid #31B404",
                    }}
                    onClick={() => atualizarPresenca(p.id, "presenca")}
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
                      border: "1px solid red",
                    }}
                    onClick={() => atualizarPresenca(p.id, "falta")}
                  >
                    Falta
                  </Button>
                  <select
                    id={`acao-${p.id}`}
                    style={{
                      marginRight: "5px",
                      cursor: "pointer",
                      width: "80px",
                      height: "40px",
                      border: "3px solid",
                      borderRadius: "4px",
                      padding: "3px",
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
                      border: "1px solid orange",
                      padding: "3px",
                    }}
                    onClick={() => {
                      const select = document.getElementById(
                        `acao-${p.id}`
                      ) as HTMLSelectElement;
                      limparOuRemover(
                        p.id,
                        select.value as "limpar" | "remover"
                      );
                    }}
                  >
                    Ação
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                Nenhum participante encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <br />

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
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
      </div>

      {showChart && (
        <div id={idBase}>
          <canvas id={idBase} ref={chartRef}></canvas>
        </div>
      )}

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
          <a href={rts} style={{ textDecoration: "none", color: "#fff" }}>
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
          onClick={exportToXLS}
        >
          Exportar para XLS
        </Button>
      </div>
    </div>
  );
}

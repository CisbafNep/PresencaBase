import { useQueries, UseQueryOptions } from "@tanstack/react-query";
import { Participant } from "../types";
import { Enviroments } from "../env/variaveis";

export function useGetUserLive(participants: Participant[]) {
  const validParticipants = Array.isArray(participants) ? participants : [];
  const URL_API = Enviroments.REACT_APP_API;

  const fetchUser = async (name: string): Promise<Participant> => {
    try {
      const response = await fetch(`${URL_API}/${encodeURIComponent(name)}`);

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!data.id || !data.name) throw new Error("Resposta da API inválida");

      return data;
    } catch (error) {
      console.error(`Erro ao buscar usuário ${name}:`, error);
      throw error;
    }
  };

  const queries = validParticipants.map(
    (p): UseQueryOptions<Participant, Error> => ({
      queryKey: ["user", p.name],
      queryFn: () => fetchUser(p.name),
      refetchInterval: 5000,
      staleTime: 5000,
      retry: (failureCount, error) => {
        if (error.message.includes("404")) return false;
        return failureCount < 2;
      },

      enabled: !!p.name?.trim(),
    })
  );

  return useQueries({ queries });
}

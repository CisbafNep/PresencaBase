import axios, { AxiosPromise } from "axios";
import { useQuery } from "@tanstack/react-query";
import { Participant } from "../types";
import { Enviroments } from "../env/variaveis";

const API_URL = Enviroments.REACT_APP_API;

const fetchUser = async (nome: string): AxiosPromise<Participant> => {
  return axios.get(`${API_URL}/${nome}`);
};

export function useGetUser(nome: string) {
  return useQuery({
    queryKey: ["user", nome],
    queryFn: () => fetchUser(nome),
    enabled: !!nome,
    retry: 2,
  });
}

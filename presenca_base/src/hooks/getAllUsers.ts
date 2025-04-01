import axios, { AxiosPromise } from "axios";
import { Enviroments } from "../env/variaveis";
import { Participant } from "../types";
import { useQuery } from "@tanstack/react-query";

const URL_API = Enviroments.REACT_APP_API;

const fetchUser = async (baseName: string): AxiosPromise<Participant> => {
  return axios.get(`${URL_API}` + "/base/" + baseName);
};

export function useGetAllUsers({
  baseName,
  nome,
}: {
  baseName: string;
  nome: string;
}) {
  return useQuery({
    queryKey: ["user", nome],
    queryFn: () => fetchUser(baseName),
    retry: 2,
    enabled: !!baseName,
    refetchOnWindowFocus: false,
    staleTime: 300000,
  });
}

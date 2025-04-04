import { Participant } from "../types.ts";
import axios, { AxiosPromise } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Enviroments } from "../env/variaveis.ts";

const URL_API = Enviroments.REACT_APP_API;

const putData = async (data: Participant): AxiosPromise<any> => {
  return axios.put(`${URL_API}`, data);
};
export function usePutUser(nome: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putData,
    retry: 2,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", nome] });
    },
  });
}

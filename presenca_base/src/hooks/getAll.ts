import axios, { AxiosResponse } from "axios";
import { Enviroments } from "../env/variaveis";
import { Participant } from "../types";
import { useQuery } from "@tanstack/react-query";

const URL_API = Enviroments.REACT_APP_API;

const fetchAllUsers = async (): Promise<Participant[]> => {
    const response: AxiosResponse<Participant[]> = await axios.get(`${URL_API}`);
    return response.data;
};

export function useFetchAllParticipants() {
    return useQuery<Participant[], Error>({
        queryKey: ["allParticipants"],
        queryFn: fetchAllUsers,
        retry: 2,
        refetchOnWindowFocus: false,
        staleTime: 300000,
    });
}


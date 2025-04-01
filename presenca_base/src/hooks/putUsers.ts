import {Participant} from "../types.ts";
import axios, {AxiosPromise} from "axios";
import {useMutation, useQueryClient} from "@tanstack/react-query";

const putData = async (data: Participant) : AxiosPromise<any> =>{
    return axios.put('http://localhost:8060/user', data)
}
export function usePutUser(nome: string){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: putData,
        retry: 2,
        onSuccess: () =>{
            queryClient.invalidateQueries({queryKey: ['user', nome]})
        }
    })
}
import * as XLSX from "xlsx";
import { Participant } from "../types";

export const exportParticipantsToXLS = (
  participantes: Participant[],
  idBase: string
) => {
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

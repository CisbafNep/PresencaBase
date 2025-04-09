export interface Participant {
  id: number;
  name: string;
  role: string;
  presences: number;
  faults: number;
  faultsFinal: number;
  presencesFinal: number;
  baseName: string;
}

export type Cargo =
  | "Médico(a)"
  | "Enfermeiro(a)"
  | "Condutor"
  | "Téc. Enfermagem";

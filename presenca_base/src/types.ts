export interface Participant {
  id: number;
  name: string;
  role: string;
  presences: number;
  faults: number;
  presences: number;
  presences: number;
  baseName: string;
}

export type Cargo =
  | "Médico(a)"
  | "Enfermeiro(a)"
  | "Condutor"
  | "Téc. Enfermagem";

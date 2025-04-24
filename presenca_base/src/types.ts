export interface Participant {
  id: number;
  name: string;
  role: string;
  faults: number;
  presences: number;
  baseName: string;
}

export type Cargo =
  | "Médico(a)"
  | "Enfermeiro(a)"
  | "Condutor"
  | "Téc. Enfermagem";

export interface Telefono {
    id: number;
    numero: string;
    tipo: string;
    usuario: number; // L'ID dell'utente a cui appartiene il telefono
}
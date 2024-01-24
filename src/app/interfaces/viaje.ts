export interface Viaje {
    filter(arg0: (v: any) => boolean): Viaje;
    region: string,
    comuna: string,
    salida: number,
    precio: number,
    capacidad: number,
    image: string,
    id: string
}

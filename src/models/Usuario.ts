import { Estado } from "./Estado.js";
import { Rol } from "./Rol.js";

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    edad: number;
    correo: string;
    contrasena: string;
    rol: Rol;
    estado: Estado;

}
import { UsuarioRepository } from "../data/UsuarioRepository.js";
import { Usuario } from "../models/Usuario.js";

export class UsuarioService {
    private repository = new UsuarioRepository();

    async listar(): Promise<Usuario[]> {
        return await this.repository.obtenerUsuarios();
    }

    async agregar(usuario: Usuario): Promise<void> {
        try {
            const usuarios = await this.repository.obtenerUsuarios();
            const existe = usuarios.some(u => u.id === usuario.id);
            if (existe) {
                console.log("Ya existe un usuario con ese ID.");
                return;
            }
            usuarios.push(usuario);
            await this.repository.guardarUsuarios(usuarios);
        } catch (error) {
            console.log("Error al guardar usuario.");
        }
    }

    async buscar(id: number): Promise<Usuario | undefined> {
        const usuarios = await this.repository.obtenerUsuarios();
        return usuarios.find(u => u.id === id);
    }

    async actualizar(usuario: Usuario): Promise<void> {
        try {
            const usuarios = await this.repository.obtenerUsuarios();
            const indice = usuarios.findIndex(u => u.id === usuario.id);

            if (indice === -1) {
                console.log("El usuario no existe.");
                return;
            }

            usuarios[indice] = usuario;
            // ¡IMPORTANTE!: Guardar los cambios en el archivo
            await this.repository.guardarUsuarios(usuarios);
            console.log("Usuario Actualizado con éxito.");
        } catch (error) {
            console.log("Error al actualizar usuario.");
        }
    }

    async eliminar(id: number): Promise<void> {
        try {
            const usuarios = await this.repository.obtenerUsuarios();
            const nuevos = usuarios.filter(u => u.id !== id);

            if (nuevos.length === usuarios.length) {
                console.log("Usuario no encontrado.");
                return;
            }
            
          
            await this.repository.guardarUsuarios(nuevos);
            console.log("Usuario eliminado con éxito.");
        } catch (error) {
            console.log("Error al eliminar.");
        }
    }

    async login(correo: string, contrasena: string): Promise<Usuario | undefined> {
        const usuarios = await this.repository.obtenerUsuarios();
        return usuarios.find(u => u.correo === correo && u.contrasena === contrasena);
    }
}
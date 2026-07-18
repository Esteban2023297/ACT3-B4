import { UsuarioService } from "../services/UsuarioService.js";
import { rl } from "../utils/Readline.js";
import { Usuario } from "../models/Usuario.js";

const service = new UsuarioService();

export async function iniciarSistema() {
    let opcionAcceso = 0;

    do {
        
        console.log("   login");
       
        console.log("1. Iniciar Sesión");
        console.log("2. Registrarse (Crear Usuario)");
        console.log("3. Salir del Programa");
       

        opcionAcceso = Number(await rl.question("Seleccione una opción: "));

        switch (opcionAcceso) {
            case 1:
                console.log("\n INICIO DE SESIÓN ");
                const correo = await rl.question("Correo: ");
                const contrasena = await rl.question("Contraseña: ");

                const usuarioLogueado = await service.login(correo, contrasena);

                if (usuarioLogueado) {
                    console.log(`\n¡Bienvenido, ${usuarioLogueado.nombre}! (Rol: ${usuarioLogueado.rol})`);
                    await menuCrud();
                } else {
                    console.log("\n Credenciales incorrectas o usuario no encontrado.");
                }
                break;

            case 2:
                console.log("\n REGISTRO DE NUEVO USUARIO");
                await capturarYAgregarUsuario();
                break;

            case 3:
                console.log("\nCerrando aplicación de forma segura. ¡Hasta luego!");
                break;

            default:
                console.log("\n Opción no válida en el menú de acceso.");
                break;
        }

    } while (opcionAcceso !== 3);

    rl.close();
}

async function menuCrud() {
    let opcionCrud = 0;
    do {
        console.log("\n crud");
        console.log("1. Agregar Usuario");
        console.log("2. Listar Usuarios");
        console.log("3. Buscar Usuario");
        console.log("4. Actualizar Usuario");
        console.log("5. Eliminar Usuario");
        console.log("6. Cerrar Sesión (Volver)");

        opcionCrud = Number(await rl.question("Opcion: "));
        switch (opcionCrud) {
            case 1:
                console.log("\n Registrar usuario");
                await capturarYAgregarUsuario();
                break;

            case 2:
                const lista = await service.listar();
                console.log("\n--- LISTA DE USUARIOS ---");
                if (lista.length === 0) {
                    console.log("No hay usuarios registrados en la base de datos.");
                } else {
                    console.table(lista);
                }
                break;

            case 3:
                const idBuscar = Number(await rl.question("Ingrese el ID a buscar: "));
                const usuarioEncontrado = await service.buscar(idBuscar);
                if (usuarioEncontrado) {
                    console.log("\nUsuario Encontrado:", usuarioEncontrado);
                } else {
                    console.log(" Usuario no encontrado.");
                }
                break;

            case 4:
                const idAct = Number(await rl.question("ID del usuario a actualizar: "));
                const userExistente = await service.buscar(idAct);
                
                if (userExistente) {
                    console.log(`Modificando a: ${userExistente.nombre}. (Deje vacío para mantener actual)`);
                    
                    const nuevoNombre = await rl.question(`Nuevo Nombre (${userExistente.nombre}): `) || userExistente.nombre;
                    const nuevoApellido = await rl.question(`Nuevo Apellido (${userExistente.apellido}): `) || userExistente.apellido;
                    const nuevaEdadInput = await rl.question(`Nueva Edad (${userExistente.edad}): `);
                    const nuevaEdad = nuevaEdadInput ? Number(nuevaEdadInput) : userExistente.edad;

                    let nuevoCorreo = userExistente.correo;
                    const regexCorreoAct = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    
                    while (true) {
                        const correoInput = await rl.question(`Nuevo Correo (${userExistente.correo}): `);
                        if (!correoInput) {
                            break;
                        }
                        if (regexCorreoAct.test(correoInput)) {
                            nuevoCorreo = correoInput;
                            break;
                        }
                        console.log(" Formato de correo inválido. Intenta de nuevo.");
                    }

                    const nuevaContra = await rl.question(`Nueva Contraseña: `) || userExistente.contrasena;
                    const nuevoRol = await rl.question(`Nuevo Rol (${userExistente.rol}): `) || userExistente.rol;
                    const nuevoEstado = await rl.question(`Nuevo Estado (${userExistente.estado}): `) || userExistente.estado;

                    await service.actualizar({
                        id: idAct,
                        nombre: nuevoNombre,
                        apellido: nuevoApellido,
                        edad: nuevaEdad,
                        correo: nuevoCorreo,
                        contrasena: nuevaContra,
                        rol: nuevoRol.toUpperCase() as any,
                        estado: nuevoEstado.toUpperCase() as any
                    });
                } else {
                    console.log(" Ese usuario no existe.");
                }
                break;

            case 5:
                const idEliminar = Number(await rl.question("ID del usuario a eliminar: "));
                const confirmar = await rl.question(`¿Seguro que deseas eliminar al ID ${idEliminar}? (S/N): `);
                if (confirmar.toUpperCase() === 'S') {
                    await service.eliminar(idEliminar);
                } else {
                    console.log("Eliminación cancelada.");
                }
                break;

            case 6:
                console.log("Cerrando sesión... Volviendo al menú de entrada.");
                break;

            default:
                console.log(" Opción no válida.");
                break;
        }

    } while (opcionCrud !== 6);
}

async function capturarYAgregarUsuario() {
    const id = Number(await rl.question("ID numérico: "));
    const nombre = await rl.question("Nombre: ");
    const apellido = await rl.question("Apellido: ");
    const edad = Number(await rl.question("Edad: "));
    
    let correo = "";
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    while (true) {
        correo = await rl.question("Correo electrónico (ej: usuario@gmail.com): ");
        if (regexCorreo.test(correo)) {
            break;
        }
        console.log(" Formato de correo inválido. Asegúrate de incluir el '@' y una terminación válida (ej: .com).");
    }

    const contrasena = await rl.question("Contraseña: "); 
    const rolTexto = await rl.question("Rol (ADMIN/USUARIO): ");
    const estadoTexto = await rl.question("Estado (ACTIVO/INACTIVO/SUSPENDIDO): ");

    await service.agregar({
        id, nombre, apellido, edad, correo, contrasena,
        rol: rolTexto.toUpperCase() as any,
        estado: estadoTexto.toUpperCase() as any 
    });
}
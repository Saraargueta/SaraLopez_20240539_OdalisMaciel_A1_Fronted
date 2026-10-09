import {
    getClientes,
    crearCliente,
    eliminarCliente,
    getCliente,
    actualizarCliente
} from "../services/clientesService";

const tabaRegistros = document.getElementById("tablaRegistros");
const tableroContainer = document.getElementById("tableroContainer");
const cargando = document.getElementById("cargando");

const txtId = document.getElementById("txtId");
const txtNombre = document.getElementById("txtNombre");
const txtApellido = document.getElementById("txtApellido");
const txtTelefono = document.getElementById("txtTelefono");
const txtEmail = document.getElementById("txtEmail");
const txtDireccion = document.getElementById("txtDireccion");

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const btnRecargar = document.getElementById("btnRecargar");
const formRegistro = document.getElementById("formRegistro");

const mensajeDiv = document.getElementById("mensaje");

async function cargarRegistros() {
    try {
        mostrarCargando(true);
        const registros = await getClientes();

        tabaRegistros.innerHTML = "";

        if (!registros || registros.length === 0) {
            tabaRegistros.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-muted">
                        No hay clientes registrados
                    </td>
                </tr>
            `;
            mostrarCargando(false);
            return;
        }

        registros.forEach((registro) => {
            tabaRegistros.innerHTML += `
                <tr>
                    <td><strong>${registro.id}</strong></td>
                    <td>${registro.nombre}</td>
                    <td>${registro.apellido}</td>
                    <td>${registro.telefono}</td>
                    <td>${registro.email}</td>
                    <td>${registro.direccion || "-"}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarRegistro(${registro.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="confirmarEliminar(${registro.id})"> Eliminar</button>
                    </td>
                </tr>
            `;
        });

        mostrarCargando(false);
    }
    catch (error) {
        mostrarMensaje("Error al cargar los registros: " + error.message, "danger");
        mostrarCargando(false);
        console.error(error);
    }
}


function mostrarCargando(mostrar) {
    if (mostrar) {
        cargando.classList.remove("d-none");
        tableroContainer.classList.add("d-none");
    } else {
        cargando.classList.add("d-none");
        tableroContainer.classList.remove("d-none");
    }
}


function mostrarMensaje(texto, tipo = "info") {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `alert alert-${tipo}`;
    mensajeDiv.classList.remove("d-none");

    setTimeout(() => {
        mensajeDiv.classList.add("d-none");
    }, 4000);
}

function limpiarFormulario() {
    formRegistro.reset();
    txtId.value = "";
    btnGuardar.textContent = "Guardar Cliente";
    btnCancelar.classList.add("d-none");
}


async function editarRegistro(id) {
    try {
        const registro = await getCliente(id);

        txtId.value = registro.id;
        txtNombre.value = registro.nombre;
        txtApellido.value = registro.apellido;
        txtTelefono.value = registro.telefono;
        txtEmail.value = registro.email;
        txtDireccion.value = registro.direccion || "";

        btnGuardar.textContent = "Actualizar Cliente";
        btnCancelar.classList.remove("d-none");

        formRegistro.scrollIntoView({ behavior: "smooth" });
    }
    catch (error) {
        mostrarMensaje("Error al cargar los datos del cliente: " + error.message, "danger");
        console.error(error);
    }
}


async function confirmarEliminar(id) {
    if (!confirm("¿deseas eliminar este cliente?")) {
        return;
    }

    try {
        await eliminarCliente(id);
        mostrarMensaje("Cliente eliminado correctamente", "success");
        limpiarFormulario();
        await cargarRegistros();
    }
    catch (error) {
        mostrarMensaje("Error al eliminar el cliente: " + error.message, "danger");
        console.error(error);
    }
}

formRegistro.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = txtId.value.trim();
    const nombre = txtNombre.value.trim();
    const apellido = txtApellido.value.trim();
    const telefono = txtTelefono.value.trim();
    const email = txtEmail.value.trim();
    const direccion = txtDireccion.value.trim();

    if (!nombre || !apellido || !telefono || !email) {
        mostrarMensaje("Nombre, Apellido, Teléfono y Email son campos obligatorios", "warning");
        return;
    }

    const cliente = {
        nombre,
        apellido,
        telefono,
        email,
        direccion
    };

    try {
        if (id) {
            await actualizarCliente(id, cliente);
            mostrarMensaje("Cliente actualizado correctamente", "success");
        } else {
            await crearCliente(cliente);
            mostrarMensaje("Cliente creado correctamente", "success");
        }

        limpiarFormulario();
        await cargarRegistros();
    }
    catch (error) {
        mostrarMensaje("Error: " + error.message, "danger");
        console.error(error);
    }
});


btnCancelar.addEventListener("click", limpiarFormulario);

btnRecargar.addEventListener("click", async () => {
    await cargarRegistros();
});


window.editarRegistro = editarRegistro;
window.confirmarEliminar = confirmarEliminar;

document.addEventListener("DOMContentLoaded", () => {
    cargarRegistros();
});
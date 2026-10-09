import { getClientes } from "../services/clientesService.js";
import { getReserva } from "../services/reservaService.js";
import {
    getEventos,
    crearEvento,
    actualizarEstadoEvento
} from "../services/reservaService.js";

const tabaRegistros = document.getElementById("tablaRegistros");
const tableroContainer = document.getElementById("tableroContainer");
const cargando = document.getElementById("cargando");

const selectCliente = document.getElementById("selectCliente");
const selectSalon = document.getElementById("selectReserva");
const txtNombreEvento = document.getElementById("txtNombreReserva");
const txtFechaEvento = document.getElementById("txtFechaReserva");
const txtCantidadPersonas = document.getElementById("txtCantidadPasajeros");
const txtCantidadHoras = document.getElementById("txtCantidadDiaz");

const btnGuardar = document.getElementById("btnGuardar");
const btnRecargar = document.getElementById("btnRecargar");
const formRegistro = document.getElementById("formRegistro");
const mensajeDiv = document.getElementById("mensaje");

//  de la Modal de Estado
const modalEstadoElement = document.getElementById("modalEstado");
const modalIdEvento = document.getElementById("modalIdReserva");
const selectNuevoEstado = document.getElementById("selectNuevoEstado");
const btnGuardarEstado = document.getElementById("btnGuardarEstado");
let bsModal = null;

async function cargarSelects() {
    try {
        const [clientes, reserva] = await Promise.all([getClientes(), getReserva()]);

        selectCliente.innerHTML = '<option value="">-- Seleccione Cliente --</option>';
        clientes.forEach(cliente => {
            selectCliente.innerHTML += `
                <option value="${cliente.id}">${cliente.nombre} ${cliente.apellido}</option>
            `;
        });

        selectSalon.innerHTML = '<option value="">-- Seleccione Salón --</option>';
        salones.forEach(salon => {
            selectSalon.innerHTML += `
                <option value="${reserva.id}">${reserva.nombre || reserva.nombre} (Capacidad: ${reserva.capacidad})</option>
            `;
        });
    } catch (error) {
        mostrarMensaje("Error al cargar las opciones de clientes o reservas: " + error.message, "danger");
        console.error(error);
    }
}

async function cargarRegistros() {
    try {
        mostrarCargando(true);
        const registros = await getVehiculo();

        tabaRegistros.innerHTML = "";

        if (!registros || registros.length === 0) {
            tabaRegistros.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4 text-muted">
                        No hay eventos registrados
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
                    <td>${registro.cliente ? registro.cliente.nombre + ' ' + registro.cliente.apellido : '-'}</td>
                    <td>${registro.salon ? (registro.salon.nombreSalon || registro.salon.nombre) : '-'}</td>
                    <td>${registro.nombreReserva || registro.nombre || '-'}</td>
                    <td>${registro.fechaEvento || registro.fecha}</td>
                    <td>${registro.cantidadPersonas}</td>
                    <td>$${registro.totalPago ? registro.totalPago.toFixed(2) : '0.00'}</td>
                    <td><span class="badge bg-info text-dark">${registro.estado}</span></td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" onclick="abrirModalEstado(${registro.id}, '${registro.estado}')">
                            ⚙️ Cambiar Estado
                        </button>
                    </td>
                </tr>
            `;
        });

        mostrarCargando(false);
    }
    catch (error) {
        mostrarMensaje("Error al cargar el historial de eventos: " + error.message, "danger");
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
}

function abrirModalEstado(id, estadoActual) {
    modalIdEvento.value = id;
    selectNuevoEstado.value = estadoActual;
    bsModal.show();
}

btnGuardarEstado.addEventListener("click", async () => {
    const id = modalIdEvento.value;
    const nuevoEstado = selectNuevoEstado.value;

    try {
        await actualizarEstadoEvento(id, nuevoEstado);
        bsModal.hide();
        mostrarMensaje(`Estado del evento #${id} actualizado a ${nuevoEstado}`, "success");
        await cargarRegistros();
    } catch (error) {
        mostrarMensaje("Error al cambiar estado: " + error.message, "danger");
        console.error(error);
    }
});


formRegistro.addEventListener("submit", async function (e) {
    e.preventDefault();

    const clienteId = parseInt(selectCliente.value);
    const salonId = parseInt(selectReserva.value);
    const nombreEvento = txtNombreEvento.value.trim();
    const fechaEvento = txtFechaEvento.value;
    const cantidadPersonas = parseInt(txtCantidadPasajeros.value);
    const cantidadHoras = parseInt(txtCantidadDiaz.value);

    if (!clienteId || !salonId || !nombreEvento || !fechaEvento || !cantidadPersonas || !cantidadHoras) {
        mostrarMensaje("Por favor, completa todos los campos del evento", "warning");
        return;
    }

    const evento = {
        clienteId,
        salonId,
        nombreEvento,
        fechaEvento,
        cantidadPersonas,
        cantidadHoras
    };

    try {
        await crearEvento(evento);
        mostrarMensaje("Evento registrado correctamente", "success");
        limpiarFormulario();
        await cargarRegistros();
    }
    catch (error) {
        mostrarMensaje("Error: " + error.message, "danger");
        console.error(error);
    }
});


btnRecargar.addEventListener("click", async () => {
    await cargarRegistros();
});


window.abrirModalEstado = abrirModalEstado;

document.addEventListener("DOMContentLoaded", async () => {
    if (modalEstadoElement) {
        bsModal = new bootstrap.Modal(modalEstadoElement);
    }
    await cargarSelects();
    await cargarRegistros();
});
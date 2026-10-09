const API_URL = "http://localhost:8080/api/clientes";

export async function getReserva() {
    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            console.error("Error al obtener Reservas");
            throw new Error("Error al obtener el historial de Reservas");
        }

        const eventos = await respuesta.json();
        return Reserva;
    } catch (error) {
        console.error("Error al obtener Vehiculo:", error);
        throw error;
    }
}


export async function crearReserva(reserva) {
    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reserva)
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json().catch(() => null);
            throw new Error(errorData?.message || "Error al registrar el vehiculo");
        }

        const nuevoEvento = await respuesta.json();
        return nuevoVehiculo;
    } catch (error) {
        console.error("Error al crear Vehiculo:", error);
        throw error;
    }
}

export async function actualizarEstadoEvento(id, nuevoEstado) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}/estado`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ estado: nuevoEstado })
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json().catch(() => null);
            throw new Error(errorData?.message || "Error al actualizar el estado del evento");
        }

        const eventoActualizado = await respuesta.json();
        return eventoActualizado;
    } catch (error) {
        console.error("Error al actualizar estado del evento:", error);
        throw error;
    }
}
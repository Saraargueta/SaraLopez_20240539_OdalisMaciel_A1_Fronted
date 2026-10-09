const API_URL = "http://localhost:8080/api/clientes";

export async function getClientes() {
    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            console.error("Error al obtener clientes");
            throw new Error("Error al obtener los clientes");
        }

        const clientes = await respuesta.json();
        return clientes;

    } catch (error) {
        console.error("Error al obtener cliente:", error);
        throw error;
    }
}


export async function getCliente(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);

        if (!respuesta.ok) {
            console.error("Error al obtener el cliente");
            throw new Error("Error al obtener el cliente");
        }

        const cliente = await respuesta.json();
        return cliente;
    }
    catch (error) {
        console.error("Error al obtener cliente:", error);
        throw error;
    }
}

export async function crearCliente(cliente) {
    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente) gar de 'registro'
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json().catch(() => null);
            throw new Error(errorData?.message || "Error al crear el cliente");
        }

        const nuevoCliente = await respuesta.json();
        return nuevoCliente;
    }
    catch (error) {
        console.error("Error al crear Cliente:", error);
        throw error;
    }
}

export async function actualizarCliente(id, cliente) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json().catch(() => null);
            throw new Error(errorData?.message || "Error al actualizar el cliente");
        }

        const clienteActualizado = await respuesta.json();
        return clienteActualizado;
    }
    catch (error) {
        console.error("Error al actualizar cliente:", error);
        throw error;
    }
}

export async function eliminarCliente(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            throw new Error("Error al eliminar el cliente");
        }

        return true;
    }
    catch (error) {
        console.error("Error al eliminar cliente:", error);
        throw error;
    }
}
















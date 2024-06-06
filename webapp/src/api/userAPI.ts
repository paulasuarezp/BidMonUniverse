const apiEndPointBase = 'http://localhost:5001/users'; // Base URL for the User API endpoints

// Inicio de sesión
export async function login(username: string, password: string): Promise<any> {
    const url = `${apiEndPointBase}/login`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en el inicio de sesión');
        }

        const token = data.token;

        if (!token) {
            throw new Error('Token no encontrado en la respuesta');
        }
        console.log('Token recibido:', token);
        // Guardar el token en el almacenamiento local
        localStorage.setItem('userToken', token);

        let user = data.user;

        return { user };
    } catch (error: any) {
        console.error('Ha ocurrido un error:', error.message);
        return { error: error.message };
    }
}

// Registro de usuario
export async function signup(username: string, password: string, birthday: string): Promise<any> {
    const url = `${apiEndPointBase}/signup`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, birthday }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en el registro de usuario');
        }

        return data;
    } catch (error: any) {
        console.error('Ha ocurrido un error:', error.message);
        return { error: error.message };
    }
}

// Verificar el token de sesión
export function verifyToken(): Promise<any> {
    const token = localStorage.getItem('userToken');
    if (!token) {
        return Promise.reject('Token no encontrado');
    }

    const url = `${apiEndPointBase}/verifyToken`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            localStorage.removeItem('userToken');
            throw new Error('Token inválido');
        }

        console.log('Token válido en userApi.ts:', response);
        return response.json();
    })
    .catch(error => {
        console.error('Ha ocurrido un error:', error.message);
        return { error: error.message };
    });
}

// Cerrar sesión
export function logout(): void {
    localStorage.removeItem('userToken');
}

// Obtener los datos de un usuario
export function getUser(username:string): any {
    const token = localStorage.getItem('userToken');
    if (!token) {
        return null;
    }

    const url = `${apiEndPointBase}/` + username;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener el usuario');
        }

        return response.json();
    })
    .catch(error => {
        console.error('Ha ocurrido un error:', error.message);
        return { error: error.message };
    });
}

const apiEndPointBase = 'http://localhost:5000/users'; // Base URL for the User API endpoints

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
        localStorage.setItem('userToken', JSON.stringify(token));

        return { token, role: data.user.role };
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
        return response;
    })  
    .catch(error => {
        console.error('Ha ocurrido un error:', error.message);
        return { error: error.message };
    });
}

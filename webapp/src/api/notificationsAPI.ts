const apiEndPointBase = 'http://localhost:5001/notifications'; // Base URL for the Card API endpoints

/**
 * Verifica si el usuario tiene notificaciones no leídas.
 * 
 * Esta función hace una solicitud al backend para determinar si el usuario especificado 
 * tiene alguna notificación sin leer. Devuelve un objeto que contiene un booleano indicando 
 * si hay notificaciones no leídas.
 * 
 * @param {string} username - El nombre de usuario para verificar las notificaciones.
 * @returns {Promise<boolean>} - Un objeto que contiene true si el usuario tiene notificaciones 
 * no leídas, de lo contrario false.
 * 
 * @throws {Error} - Si no se puede verificar si hay notificaciones no leídas, ya sea por 
 * falta de un token válido o por un problema de red/servidor.
 */
export const checkUnreadNotifications = async (username: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/unread/${username}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se ha podido verificar si hay notificaciones no leídas, inténtelo de nuevo más tarde');
            }

            return response.json();
        }).catch(error => {
            throw new Error('No se ha podido verificar si hay notificaciones no leídas, inténtelo de nuevo más tarde');
        });
};


/**
 * Obtiene las notificaciones del usuario.
 * 
 * @param {string} username - El nombre de usuario para recuperar las notificaciones.
 * @returns {Promise<Object>} - Un objeto con las notificaciones 
 * 
 * @throws {Error} - Si no se pueden recuperar las notificaciones, ya sea por 
 * falta de un token válido o por un problema de red/servidor.
 */
export const getUserNotifications = async (username: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/${username}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se han podido obtener las notificaciones, inténtelo de nuevo más tarde');
            }

            return response.json();
        }).catch(error => {
            throw new Error('No se han podido obtener las notificaciones, inténtelo de nuevo más tarde');
        });
};
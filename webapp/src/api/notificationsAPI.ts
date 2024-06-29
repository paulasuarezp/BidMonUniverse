const apiEndPointBase = `${process.env.REACT_APP_API_URI}/notifications` || 'http://localhost:5001/api/notifications'; // Base URL for the Card API endpoints

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


/**
 * Marcar una notificación como leída.
 * 
 * @param {string} notificationId - El ID de la notificación a marcar como leída.
 * @returns {Promise<boolean>} - Un booleano que indica si la notificación se ha marcado como leída.
 * 
 * @throws {Error} - Si no se puede marcar la notificación como leída, ya sea por 
 * falta de un token válido o por un problema de red/servidor.
 */
export const markAsRead = async (notificationId: string): Promise<boolean> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/notification/${notificationId}/read`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('No se ha podido marcar la notificación como leída, inténtelo de nuevo más tarde');
    }

    return response.json();
};

/**
 * Marcar todas las notificaciones de un usuario como leídas.
 * 
 * @param {string} username - El nombre de usuario para marcar todas las notificaciones como leídas.
 * @returns {Promise<boolean>} - Un booleano que indica si la notificación se ha marcado como leída.
 * 
 * @throws {Error} - Si no se puede marcar la notificación como leída, ya sea por 
 * falta de un token válido o por un problema de red/servidor.
 */
export const markAllAsRead = async (username: string): Promise<boolean> => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión');
    }

    const url = `${apiEndPointBase}/read/${username}`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('No se han podido marcar las notificaciones como leídas, inténtelo de nuevo más tarde');
    }

    return response.json();
};

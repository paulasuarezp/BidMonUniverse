const apiEndPointBase = 'http://localhost:5001/transactions'; // Base URL for the Transaction API endpoints

export const getTransactionsForCard = async (username: string, cardId: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        return { error: 'No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión' };
    }

    const url = `${apiEndPointBase}/user/${username}/${cardId}`

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                return { error: 'No se han podido obtener las transacciones de la carta, inténtelo de nuevo más tarde' };
            }
            console.log('Response', response);

            return response.json();
        })
        .catch(error => {
            console.error('Ha ocurrido un error al obtener  las transacciones de la carta:', error.message);
            return { error: 'No se han podido obtener las transacciones de la carta, inténtelo de nuevo más tarde' };
        });
}


const apiEndPointBase = 'http://localhost:5001/auctions'; // Base URL for the Auction API endpoints

export const addAuction = async (username: string, userCardId: string, basePrice: number, duration: number) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        return { error: 'No se ha encontrado un token de usuario válido, por favor, vuelva a iniciar sesión' };
    }

    const url = `${apiEndPointBase}/put-auction-card'`

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username, userCardId, basePrice, duration }),
    }).then(response => {
        if (!response.ok) {
            return { error: 'No se ha podido crear la subasta, inténtelo de nuevo más tarde' };
        }
        console.log('Response', response);

        return response.json();
    })
        .catch(error => {
            console.error('Ha ocurrido un error al crear la subasta:', error.message);
            return { error: 'No se ha podido crear la subasta, inténtelo de nuevo más tarde' };
        });

}

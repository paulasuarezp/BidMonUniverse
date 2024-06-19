const apiEndPointBase = 'http://localhost:5001/auctions'; // Base URL for the Auction API endpoints

export const addAuction = async (username: string, userCardId: string, saleBase: number, duration: number) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        throw new Error('No token found');
    }

    const url = `${apiEndPointBase}/put-auction-card'`

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username, userCardId, saleBase, duration }),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al crear la subasta');
        }
        console.log('Response', response);

        return response.json();
    })
        .catch(error => {
            throw new Error(error);
        });

}

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Auction } from '../../../shared/sharedTypes';
import Button from '../../components/buttons/Button';
import ResponsiveActiveAuctionsGrid from '../../components/container/gridContainer/ResponsiveActiveAuctionsGrid';
import BasePageWithNav from '../BasePageWithNav';


export default function AuctionsAdmin() {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const sessionUser = useSelector((state: RootState) => state.user);

    // Función para manejar el cierre de subastas
    const handleCloseAuctions = () => {
        // Lógica para cerrar las subastas
        // Por ejemplo, una llamada a la API para cerrar las subastas terminadas
    };


    return (
        <BasePageWithNav
            title="Subastas activas"
            showBackButton={false}
            description="En esta sección podrás ver y gestionar todas las subastas activas."
            description2="Cierra las subastas que ya han terminado, buscando automáticamente al ganador y notificándole mediante el botón 'Cerrar subastas terminadas'."
        >
            <Button label="Cerrar subastas terminadas" onClick={handleCloseAuctions} />
            <div style={{ marginBottom: '2em' }}>
                {loading ? (
                    <p>Cargando subastas...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <ResponsiveActiveAuctionsGrid limit={false} username={sessionUser.username} showUserAuctions={false} />
                )}
            </div>
        </BasePageWithNav>
    );
}

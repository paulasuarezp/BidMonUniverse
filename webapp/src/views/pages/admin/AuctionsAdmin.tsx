import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Button from '../../components/buttons/Button';
import ResponsiveActiveAuctionsGrid from '../../components/container/gridContainer/ResponsiveActiveAuctionsGrid';
import CloseAuctionsForm from '../../components/forms/auction/CloseAuctionsForm';
import BasePageWithNav from '../BasePageWithNav';

// #region COMPONENTE AUCTIONSADMIN
export default function AuctionsAdmin() {
    const sessionUser = useSelector((state: RootState) => state.user);

    const [openCloseAuctionsModal, setOpenCloseAuctionsModal] = useState(false);

    // Función para manejar el cierre de subastas
    const handleCloseAuctions = () => {
        setOpenCloseAuctionsModal(true);
    };


    return (
        <BasePageWithNav
            title="Subastas activas"
            showBackButton={false}
            description="En esta sección podrás ver y gestionar todas las subastas activas."
            description2="Cierra las subastas que ya han terminado, buscando automáticamente al ganador y notificándole mediante el botón 'Cerrar subastas terminadas'."
        >
            <Button label="Cerrar subastas terminadas" onClick={handleCloseAuctions} aria-label='Cerrar subastas terminadas' />

            <CloseAuctionsForm open={openCloseAuctionsModal} handleClose={() => setOpenCloseAuctionsModal(false)} />
            <div style={{ marginBottom: '2em' }}>
                <ResponsiveActiveAuctionsGrid limit={false} username={sessionUser.username} showUserAuctions={false} />
            </div>
        </BasePageWithNav>
    );
}
// #endregion
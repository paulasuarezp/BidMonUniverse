import { CircularProgress, Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { linkDecksToCardPacks } from '../../../api/api';
import { getCardPacks } from '../../../api/cardpacksAPI';
import { CardPack as CardPackType } from '../../../shared/sharedTypes';
import CardPack from '../../components/cardpack/CardPack';
import ErrorMessageBox from '../../components/messagesBox/ErrorMessageBox';
import BasePageWithNav from '../BasePageWithNav';



// #region COMPONENTE SHOP
export default function Shop() {
    const [packs, setPacks] = useState<CardPackType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    /**
     * A partir del nombre de un sobre de cartas, devuelve la ruta de la imagen
     * @param packName - nombre del sobre
     * @returns  ruta de la imagen
     */
    function getCardPackImage(packName: string): string {
        let name = packName.toLowerCase().replace(' ', '-');
        console.log('name:', name);
        return `/cardpacks/${name}.webp`;
    }


    /**
     * Obtiene los sobres de cartas de la tienda y los almacena en el estado
     */
    const fetchPacks = async () => {
        setLoading(true);
        try {
            const data = await getCardPacks();
            const processedData = await linkDecksToCardPacks(data);
            setPacks(processedData);

            for (let pack of processedData) {
                pack.image = getCardPackImage(pack.name);
            }

            setLoading(false);
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPacks();
    }, []);

    // LOADING
    if (loading) {
        return (
            <Container style={{ textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    // ERROR
    if (error) {
        return <ErrorMessageBox message="Actualmente la tienda no está disponible." />;
    }


    return (
        <BasePageWithNav title="Tienda" showBackButton={false} description="¡Compra sobres de cartas y consigue la mejor colección!">
            <Container>
                <Grid container spacing={2}>
                    {packs.map(pack => (
                        <Grid item key={pack.name} xs={12} sm={6} md={4}>
                            <CardPack
                                cardpack={pack}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </BasePageWithNav>
    );
}
// #endregion
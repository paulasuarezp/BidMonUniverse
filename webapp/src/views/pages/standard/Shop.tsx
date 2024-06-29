import { Alert, CircularProgress, Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { linkDecksToCardPacks } from '../../../api/api';
import { getCardPacks } from '../../../api/cardpacksAPI';
import { CardPack as CardPackType } from '../../../shared/sharedTypes';
import CardPack from '../../components/cardpack/CardPack';
import ErrorMessageBox from '../../components/messages/ErrorMessageBox';
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




    return (
        <BasePageWithNav title="Tienda" showBackButton={false} description="¡Compra sobres de cartas y consigue la mejor colección!">
            <Container>
                {loading && <Container style={{ textAlign: 'center' }}>
                    <CircularProgress />
                </Container>
                }
                {error && <ErrorMessageBox message='Se ha producido un error al obtener los datos de la tienda.' />}

                {!loading && !error && packs.length === 0 && <Alert severity="info">No hay sobres de cartas disponibles en la tienda.</Alert>}

                {/* Si no hay errores y hay sobres de cartas, se muestran en la tienda */}
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
import { Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { linkDecksToCardPacks } from '../../api/api';
import { getCardPacks } from '../../api/cardpacksAPI';
import { CardPack as CardPackType } from '../../shared/sharedTypes';
import CardPack from '../components/cardpack/CardPack';
import BasePageWithNav from './BasePageWithNav';

function getCardPackImage(packName: string): string {
    let name = packName.toLowerCase().replace(' ', '-');
    console.log('name:', name);
    return `/cardpacks/${name}.webp`;
}


export default function Shop() {
    const [packs, setPacks] = useState<CardPackType[]>([]);

    const fetchPacks = async () => {
        try {
            const data = await getCardPacks();
            const processedData = await linkDecksToCardPacks(data);
            setPacks(processedData);

            for (let pack of processedData) {
                pack.image = getCardPackImage(pack.name);
            }
        } catch (error) {
            console.log('Error fetching packs:', error);
        }
    };

    useEffect(() => {
        fetchPacks();
    }, []);


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

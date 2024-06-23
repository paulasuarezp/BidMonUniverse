import { Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { getCardPacks } from '../../api/cardpacksAPI';
import { CardPack as CardPackType } from '../../shared/sharedTypes';
import CardPack from '../components/cardpack/CardPack';
import BasePageWithNav from './BasePageWithNav';

function getCardPackImage(packName: string): string {
    let name = packName.toLowerCase().replace(' ', '-');
    console.log('name:', name);
    return `/cardpacks/${name}.webp`;

}

function getCardPackDescription(pack: CardPackType): string {
    let description = `Este sobre contiene ${pack.numberOfCards} cartas. Puedes conseguir cartas de los siguientes mazos: `;
    description += pack.deckId1 ? `${pack.quantity1} cartas de ${pack.deckId1}` : '';
    description += pack.deckId2 ? `, ${pack.quantity2} cartas de ${pack.deckId2}` : '';
    description += pack.deckId3 ? `, ${pack.quantity3} cartas de ${pack.deckId3}` : '';


    return description;
}

export default function Shop() {

    const [packs, setPacks] = useState<CardPackType[]>([]);

    const fetchPacks = async () => {
        try {
            const data = await getCardPacks();
            setPacks(data);
            for (let pack of data) {
                pack.image = getCardPackImage(pack.name);
                pack.description = getCardPackDescription(pack);
            }
        } catch (error) {
            console.log('Error fetching packs:', error);
        }
    }

    useEffect(() => {
        fetchPacks();
    }, []);

    const handleOpenPack = (packName: string) => {
        console.log(`Opening pack: ${packName}`);
        // Lógica para abrir el sobre y mostrar las cartas
    };

    return (
        <BasePageWithNav title="Tienda" showBackButton={false} description="¡Compra sobres de cartas y consigue la mejor colección!">
            <Container>
                <Grid container spacing={2}>
                    {packs.map(pack => (
                        <Grid item key={pack.name} xs={12} sm={6} md={4}>
                            <CardPack
                                name={pack.name}
                                image={pack.image}
                                description={pack.description}
                                onOpen={() => handleOpenPack(pack.name)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </BasePageWithNav>
    );
};


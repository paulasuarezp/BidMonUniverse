import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    useTheme
} from '@mui/material';
import Button from '../buttons/Button';
import CoinsButton from '../buttons/coins/CoinsButton';

interface PackProps {
    name: string;
    subtitle: string;
    image: string;
    price: number;
    id: string;
    description: string;
    onOpen: () => void;
}

export default function CardPack({ name, subtitle, image, description, price, id, onOpen }: PackProps) {
    const theme = useTheme();

    return (
        <Card style={{ width: '100%', height: 450, borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardMedia
                component="img"
                style={{ height: 200, objectFit: 'cover' }}
                image={image}
                alt={name}
            />
            <CardContent style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Typography gutterBottom variant="h5" component="div">
                            {name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    </div>
                    <CoinsButton balance={price} sx={{ color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF' }} />
                </div>
                <Typography variant="body2" color="text.secondary" style={{ marginTop: 10 }}>
                    {description}
                </Typography>
            </CardContent>
            <CardActions style={{ justifyContent: 'center', paddingBottom: 16 }}>
                <Button buttonType='primary' label='Comprar sobre' fullWidth onClick={onOpen} />
            </CardActions>
        </Card>
    );
}

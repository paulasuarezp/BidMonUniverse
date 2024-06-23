import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography
} from '@mui/material';

interface PackProps {
    name: string;
    image: string;
    description: string;
    onOpen: () => void;
}

export default function CardPack({ name, image, description, onOpen }: PackProps) {
    console.log('CardPack:', name, image, description);
    return (
        <Card style={{ maxWidth: 345, margin: '20px auto', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
            <CardMedia
                component="img"
                height="140"
                image={image}
                alt={name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="large" color="primary" variant="contained" onClick={onOpen}>
                    Open Pack
                </Button>
            </CardActions>
        </Card>
    );
};


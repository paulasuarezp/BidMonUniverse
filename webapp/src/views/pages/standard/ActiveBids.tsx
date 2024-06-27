import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
import Button from "../../components/buttons/Button";
import Container from "../../components/container/Container";
import ResponsiveActiveBidsGrid from '../../components/container/gridContainer/ResponsiveActiveBidsGrid';
import NavigationMenu from "../../components/menus/principalNav/Navigation";
import PokeballsBox from "../../components/ornament/PokeballsBox";

//#region COMPONENTE ACTIVEBIDS
export default function ActiveBids() {
    const navigate = useNavigate();

    const sessionUser = useSelector((state: RootState) => state.user);

    let username: string = sessionUser.username;

    /**
     * Redirige a la página de subastas
     */
    const handleBack = () => {
        navigate('/auctions');
    };

    return (
        <Container>
            <NavigationMenu />
            <PokeballsBox titulo="Pujas activas" sx={{ marginBottom: '0.2em', marginTop: '3em' }} />

            <Typography variant="body1" align="center" component="div" style={{ marginBottom: '1em' }}>
                Aquí encontrarás todas las pujas en las que estás participando.<br />
                🍀 <strong> ¡Suerte! </strong> 🍀
            </Typography>

            <Button startIcon={<ArrowBackIcon />}
                variant="contained"
                sx={{ alignSelf: 'flex-start', margin: '10px' }}
                buttonType="ghost"
                onClick={handleBack}
                label='Volver a subastas'
            />

            <div style={{ marginBottom: '2em' }}>
                <ResponsiveActiveBidsGrid limit={false} username={username} />
            </div>

        </Container>
    );
};
//#endregion

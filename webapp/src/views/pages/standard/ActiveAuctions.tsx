import SearchIcon from '@mui/icons-material/Search';
import { Box, FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
import Button from "../../components/buttons/Button";
import Container from "../../components/container/Container";
import ResponsiveActiveAuctionsGrid from "../../components/container/gridContainer/ResponsiveActiveAuctionsGrid";
import NavigationMenu from "../../components/menus/principalNav/Navigation";
import PokeballsBox from "../../components/ornament/PokeballsBox";

//#region COMPONENTE ACTIVEAUCTIONS
export default function ActiveAuctions() {
    const navigate = useNavigate();

    const sessionUser = useSelector((state: RootState) => state.user);

    let username: string = sessionUser.username;

    // Estado para manejar el interruptor de subastas activas de la app vs. subastas activas del usuario
    const [showUserAuctions, setShowUserAuctions] = useState(false);

    /**
     * Redirige a la página de pujas
     */
    const handleNavigate = () => {
        navigate('/bids');
    };

    return (
        <Container>
            <NavigationMenu />
            <PokeballsBox titulo="Subastas activas" sx={{ marginBottom: '0.2em', marginTop: '3em' }} />

            <Typography variant="body1" align="center" component="div" style={{ marginBottom: '1em' }}>
                Aquí encontrarás las subastas activas actualmente.<br />
                ¡Participa en ellas y hazte con las cartas más exclusivas!
            </Typography>


            <Box display="flex" justifyContent="space-between" alignItems="center">
                <FormGroup>
                    <FormControlLabel
                        aria-label='Mostrar mis subastas'
                        control={<Switch checked={showUserAuctions} onChange={() => setShowUserAuctions(!showUserAuctions)} />}
                        label={showUserAuctions ? "Mis subastas" : "Todas las subastas"}
                    />
                </FormGroup>
                <Button startIcon={<SearchIcon />} onClick={handleNavigate} buttonType="primary" label="Mis pujas" />
            </Box>

            <div style={{ marginBottom: '2em' }}>
                <ResponsiveActiveAuctionsGrid limit={false} username={username} showUserAuctions={showUserAuctions} />
            </div>

        </Container>
    );
};
//#endregion

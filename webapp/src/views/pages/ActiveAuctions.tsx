import { FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Container from "../components/container/Container";
import ResponsiveActiveAuctionsGrid from "../components/container/gridContainer/ResponsiveActiveAuctionsGrid";
import NavigationMenu from "../components/menus/principalNav/Navigation";
import PokeballsBox from "../components/ornament/PokeballsBox";

//#region COMPONENTE LOGIN
export default function MyCollection() {
    const sessionUser = useSelector((state: RootState) => state.user);

    let username: string = sessionUser.username;

    // Estado para manejar el interruptor de subastas activas de la app vs. subastas activas del usuario
    const [showUserAuctions, setShowUserAuctions] = useState(false);



    return (
        <Container>
            <NavigationMenu />
            <PokeballsBox titulo="Subastas activas" sx={{ marginBottom: '0.2em', marginTop: '3em' }} />

            <Typography variant="body1" align="center" component="div" style={{ marginBottom: '1em' }}>
                Aquí encontrarás las subastas activas actualmente.<br />
                <strong>¡Participa en ellas!</strong>
            </Typography>

            <FormGroup>
                <FormControlLabel
                    control={<Switch checked={showUserAuctions} onChange={() => setShowUserAuctions(!showUserAuctions)} />}
                    label={showUserAuctions ? "Mis subastas" : "Todas las subastas"}
                />
            </FormGroup>


            <div style={{ marginBottom: '2em' }}>
                <ResponsiveActiveAuctionsGrid limit={false} username={username} showUserAuctions={showUserAuctions} />
            </div>


        </Container>
    );
};
//#endregion

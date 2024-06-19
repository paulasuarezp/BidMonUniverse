import Container from "../components/container/Container";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import NavigationMenu from "../components/menus/principalNav/Navigation";
import { Typography } from "@mui/material";
import ResponsiveActiveAuctionsGrid from "../components/container/gridContainer/ResponsiveActiveAuctionsGrid";
import PokeballsBox from "../components/ornament/PokeballsBox";

//#region COMPONENTE LOGIN
export default function MyCollection() {
    const sessionUser = useSelector((state: RootState) => state.user);

    let username: string = sessionUser.username;


    return (
        <Container>
            <NavigationMenu />
            <PokeballsBox titulo="Subastas activas" sx={{ marginBottom: '0.2em', marginTop: '3em' }} />

            <Typography variant="body1" align="center" component="div" style={{ marginBottom: '1em' }}>
                Aquí encontrarás las subastas activas actualmente.<br />
                <strong>¡Participa en ellas!</strong>
            </Typography>


            <div style={{ marginBottom: '2em' }}>
                <ResponsiveActiveAuctionsGrid limit={false} username={username} />
            </div>


        </Container>
    );
};
//#endregion

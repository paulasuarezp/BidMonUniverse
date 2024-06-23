import Container from "../components/container/Container";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import NavigationMenu from "../components/menus/principalNav/Navigation";
import { Typography, useTheme, Box } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import ResponsivePokemonGrid from "../components/container/gridContainer/ResponsivePokemonGrid";
import PokeballsBox from "../components/ornament/PokeballsBox";

//#region COMPONENTE LOGIN
export default function MyCollection() {
    const sessionUser = useSelector((state: RootState) => state.user);

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    let username: string = sessionUser.username;


    return (
        <Container>
            <NavigationMenu />

            <PokeballsBox titulo="Mi colección" sx={{ marginBottom: '1em', marginTop: '3em' }} />

            <div style={{ marginBottom: '2em' }}>
                <ResponsivePokemonGrid limit={false} username={username} />
            </div>


        </Container>
    );
};
//#endregion

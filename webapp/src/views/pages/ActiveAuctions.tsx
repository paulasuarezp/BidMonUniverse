import Container from "../components/container/Container";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import NavigationMenu from "../components/menus/principalNav/Navigation";
import { Typography } from "@mui/material";
import ResponsiveActiveAuctionsGrid from "../components/container/gridContainer/ResponsiveActiveAuctionsGrid";

//#region COMPONENTE LOGIN
export default function MyCollection() {
    const sessionUser = useSelector((state: RootState) => state.user);

    let username: string = sessionUser.username;


    return (
        <Container>
            <NavigationMenu />
            <Typography variant="h4" align="center" component="div">
                Subastas activas
            </Typography>
            <Typography variant="body1" align="center" component="div">
                Aquí encontrarás las subastas activas actualmente.
                {'\n'}¡Participa en ellas!
            </Typography>

            <div style={{ marginBottom: '2em' }}>
                <ResponsiveActiveAuctionsGrid limit={false} username={username} />
            </div>


        </Container>
    );
};
//#endregion

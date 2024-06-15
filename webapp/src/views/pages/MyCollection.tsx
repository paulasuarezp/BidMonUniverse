import Container from "../components/container/Container";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import NavigationMenu from "../components/menus/principalNav/Navigation";
import { Grid, Typography, useTheme, IconButton, Stack } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import PokemonCard from "../components/card/PokemonCard";
import DataTable from "../components/table/Table";
import ResponsivePokemonGrid from "../components/container/gridContainer/ResponsivePokemonGrid";
import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';

//#region COMPONENTE LOGIN
export default function MyCollection() {
    const sessionUser = useSelector((state: RootState) => state.user);

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    let username: string = sessionUser.username;


    return (
        <Container>
            <NavigationMenu />
            <Typography variant="h4" align="center" component="div">
                Mi colección
            </Typography>



            <div style={{ marginBottom: '2em' }}>


                <ResponsivePokemonGrid limit={false} username={username} />
            </div>


        </Container>
    );
};
//#endregion

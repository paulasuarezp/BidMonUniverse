import Container from "../components/container/Container";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import NavigationMenu from "../components/menus/principalNav/Navigation";
import { Grid, Typography, useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import PokemonCard from "../components/card/PokemonCard";
import DataTable from "../components/table/Table";
import ResponsivePokemonGrid from "../components/container/gridContainer/ResponsivePokemonGrid";

//#region COMPONENTE LOGIN
export default function Login() {
  const sessionUser = useSelector((state: RootState) => state.user);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  return (
    <Container>
      <NavigationMenu />
      <Typography variant="h4" align="center" component="div">
        ¡Bienvenido de nuevo{' '}
        <span style={{ color: 'red', fontFamily: 'Pokemon' }}>
          {sessionUser.username}
        </span>
        !
      </Typography>



      <div style={{ marginBottom: '2em' }}>
        <Typography variant="h4" align="left">
          Mi colección
          <ResponsivePokemonGrid />
        </Typography>
      </div>

      <div>
        <Typography variant="h4" align="left">
          Mis pujas
          <DataTable />
        </Typography>
      </div>

    </Container>
  );
};
//#endregion

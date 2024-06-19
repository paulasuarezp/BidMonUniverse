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
export default function Login() {
  const sessionUser = useSelector((state: RootState) => state.user);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  let username: string = sessionUser.username;


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
        <Stack spacing={0.5} direction="row" >

          <Typography variant="h4" align="left">
            Mi colección
          </Typography>
          <IconButton aria-label="delete" color="secondary">
            <ArrowCircleRightTwoToneIcon fontSize="large" />
          </IconButton>
        </Stack>

        <ResponsivePokemonGrid username={username} />
      </div>

      <div>
        <Stack spacing={0.5} direction="row" >

          <Typography variant="h4" align="left">
            Mis pujas
          </Typography>
          <IconButton aria-label="delete" color="secondary">
            <ArrowCircleRightTwoToneIcon fontSize="large" />
          </IconButton>
        </Stack>
        <DataTable />
      </div>

    </Container>
  );
};
//#endregion

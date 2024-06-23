import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';
import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { RootState } from "../../redux/store";
import Button from '../components/buttons/Button';
import Container from "../components/container/Container";
import ResponsivePokemonGrid from "../components/container/gridContainer/ResponsivePokemonGrid";
import NavigationMenu from "../components/menus/principalNav/Navigation";
import AuctionSummaryTable from '../components/table/AuctionSummaryTable';
import BidSummaryTable from "../components/table/BidSummaryTable";

//#region COMPONENTE LOGIN
export default function Login() {
  const sessionUser = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

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
          <Button
            buttonType="section"
            onClick={() => navigate('/album')}
            label='Mi colección'
            endIcon={<ArrowCircleRightTwoToneIcon />}
          />
        </Stack>

        <ResponsivePokemonGrid username={username} />
      </div>

      <div style={{ marginBottom: '2em' }}>
        <Stack spacing={0.5} direction="row" >
          <Button
            buttonType="section"
            onClick={() => navigate('/auctions')}
            label='Mis subastas'
            endIcon={<ArrowCircleRightTwoToneIcon />}
          />

        </Stack>
        <AuctionSummaryTable />
      </div>

      <div style={{ marginBottom: '2em' }}>
        <Stack spacing={0.5} direction="row" >
          <Button
            buttonType="section"
            onClick={() => navigate('/bids')}
            label='Mis pujas'
            endIcon={<ArrowCircleRightTwoToneIcon />}
          />

        </Stack>
        <BidSummaryTable />
      </div>

    </Container>
  );
};
//#endregion

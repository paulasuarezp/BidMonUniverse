import { Typography } from "@mui/material";
import Container from "../components/container/Container";
import AdminNavigationMenu from "../components/menus/principalNav/AdminNav";

export default function AdminPage() {
    return (
        <Container>
            <AdminNavigationMenu />
            <Typography variant="h4" align="center" component="div">
                ¡Bienvenido a la administración!
            </Typography>
            <Typography variant="h6" align="center" component="div">
                Desde aquí podrás gestionar las subastas y las transacciones de los usuarios.
            </Typography>
        </Container>
    );
}
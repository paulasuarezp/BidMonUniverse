import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Container from "../../components/container/Container";
import ResponsivePokemonGrid from "../../components/container/gridContainer/ResponsivePokemonGrid";
import NavigationMenu from "../../components/menus/principalNav/Navigation";
import PokeballsBox from "../../components/ornament/PokeballsBox";

//#region COMPONENTE MYCOLLECTION
export default function MyCollection() {
    const sessionUser = useSelector((state: RootState) => state.user);

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

import Container from "../components/container/Container";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

//#region COMPONENTE LOGIN
export default function Login() {
  const sessionUser = useSelector((state: RootState) => state.user);

  return (
    <Container> 
      <p>Has iniciado sesión como {sessionUser.username}</p>
    </Container>
  );
};
//#endregion

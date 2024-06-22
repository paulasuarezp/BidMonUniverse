import { CircularProgress, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTransactionsForUser } from "../../api/transactionsAPI";
import { RootState } from "../../redux/store";
import { Transaction } from "../../shared/sharedTypes";
import ErrorMessageBox from "../components/MessagesBox/ErrorMessageBox";
import Container from "../components/container/Container";
import UserTransationsTable from "../components/table/UserTransactionsTable";
import BasePageWithNav from "./BasePageWithNav";

//#region COMPONENTE LOGIN
export default function UserTransactions() {
    const sessionUser = useSelector((state: RootState) => state.user);

    const theme = useTheme();

    const [data, setData] = useState<Transaction[]>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    let username: string = sessionUser.username;

    useEffect(() => {
        const fetchData = async () => {
            getTransactionsForUser(username).then(data => {
                setData(data);
            }).catch(err => {
                setError('Error al obtener los datos de las transacciones');
                console.error(err);
            });
        };
        fetchData();
    }, [username]);

    if (loading) {
        return <Container style={{ textAlign: 'center' }}><CircularProgress /></Container>;
    }

    if (error) {
        return <ErrorMessageBox message={error} />;
    }

    return (
        <BasePageWithNav
            title="Historial de transacciones"
            description="En esta sección podrás consultar el historial de transacciones de tu cuenta."
        >
            <Container>
                <UserTransationsTable data={data} />
            </Container>
        </BasePageWithNav>

    );
};
//#endregion

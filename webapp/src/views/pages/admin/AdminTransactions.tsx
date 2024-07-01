import { Alert, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllTransactions } from "../../../api/transactionsAPI";
import { RootState } from "../../../redux/store";
import { Transaction } from "../../../shared/sharedTypes";
import { getTransactionMessage } from "../../../utils/utils";
import Container from "../../components/container/Container";
import AllUserTransationsTable from "../../components/table/AllUserTransactionsTable";
import BasePageWithNav from "./../BasePageWithNav";

//#region COMPONENTE ADMINTRANSACTIONS
export default function AdminTransactions() {
    const sessionUser = useSelector((state: RootState) => state.user);

    const [data, setData] = useState<Transaction[]>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    let username: string = sessionUser.username;

    /**
     * Función para obtener las transacciones de todos los usuarios
     */
    const fetchData = async () => {
        setLoading(true);
        getAllTransactions().then(data => {
            for (let i = 0; i < data.length; i++) {
                data[i].mensajeConcepto = getTransactionMessage(data[i].concept[0]);
            }
            setData(data);
            setLoading(false);
        }).catch(err => {
            setError('Actualmente no se pueden cargar las transacciones. Por favor, inténtalo de nuevo más tarde.');
            setLoading(false);
        });
    };

    useEffect(() => {

        fetchData();
    }, [username]);

    // LOADING
    if (loading) {
        return <Container style={{ textAlign: 'center' }}><CircularProgress /></Container>;
    }

    // ERROR
    if (error) {
        return <Container style={{ textAlign: 'center' }}>
            <Alert severity="error" role="alert">{error}</Alert>
        </Container>;
    }

    return (
        <BasePageWithNav
            title="Historial de transacciones"
            description="En esta sección podrás consultar el historial de transacciones de todos los usuarios."
        >
            <AllUserTransationsTable data={data} />
        </BasePageWithNav>

    );
};
//#endregion

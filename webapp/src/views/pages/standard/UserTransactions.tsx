import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTransactionsForUser } from "../../../api/transactionsAPI";
import { RootState } from "../../../redux/store";
import { Transaction } from "../../../shared/sharedTypes";
import { getTransactionMessage } from "../../../utils/utils";
import Container from "../../components/container/Container";
import ErrorMessageBox from "../../components/messagesBox/ErrorMessageBox";
import UserTransationsTable from "../../components/table/UserTransactionsTable";
import BasePageWithNav from "../BasePageWithNav";

//#region COMPONENTE USERTRANSACTIONS
export default function UserTransactions() {
    const sessionUser = useSelector((state: RootState) => state.user);


    const [data, setData] = useState<Transaction[]>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    let username: string = sessionUser.username;


    /**
     * Obtiene las transacciones del usuario y las almacena en el estado
     */
    const fetchData = async () => {
        setLoading(true);
        getTransactionsForUser(username).then(data => {
            for (let i = 0; i < data.length; i++) {
                data[i].mensajeConcepto = getTransactionMessage(data[i].concept[0]);
            }
            setData(data);
            setLoading(false);
        }).catch(err => {
            setError('Actualmente no se pueden obtener las transacciones.');
            setError(err.message);
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
        return <ErrorMessageBox message={error} />;
    }

    return (
        <BasePageWithNav
            title="Historial de transacciones"
            description="En esta sección podrás consultar el historial de transacciones de tu cuenta."
        >
            <UserTransationsTable data={data} />

        </BasePageWithNav>

    );
};
//#endregion

import GavelIcon from '@mui/icons-material/Gavel';
import StarIcon from '@mui/icons-material/Star';
import {
    Alert,
    CardActions,
    CircularProgress
} from "@mui/material";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getCardFromUserCollection, getShopTransactionsCard } from '../../../api/api';
import { resetUpdate } from '../../../redux/slices/updateSlice';
import { RootState } from '../../../redux/store';
import { CardStatus, Card as CardType, Transaction } from "../../../shared/sharedTypes";
import Button from '../../components/buttons/Button';
import GeneralCardDetail from '../../components/cardDetail/GeneralCardDetail';
import Container from '../../components/container/Container';
import AddAuctionForm from '../../components/forms/auction/AddAuctionForm';
import ErrorMessageBox from '../../components/messages/ErrorMessageBox';

// #region COMPONENT CardDetail
// Detalle de una carta de la colección del usuario
const CardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [card, setCard] = useState<CardType | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [inAuction, setInAuction] = useState<boolean>(false);


    const sessionUser = useSelector((state: RootState) => state.user);
    const username = sessionUser.username.toLowerCase();
    const { update, updateId } = useSelector((state: RootState) => state.update);

    /**
     * Función para comprobar si la carta está en subasta
     * @param id 
     * @returns 
     */
    const checkAvailableCard = async (id: string) => {
        try {
            const data = await getCardFromUserCollection(id);
            if (data.status === CardStatus.OnAuction) {
                return false; // Retorna false para indicar que no se debe proceder
            }
            return true; // Retorna true si la carta no está en subasta y se puede proceder
        } catch (error) {
            return false; // Retorna false en caso de error al obtener los datos de la carta
        }
    };

    /**
     * Función para abrir el modal de subasta
     * @returns 
     */
    const handleOpen = async () => {
        const canProceed = await checkAvailableCard(id);
        if (!canProceed) {
            setInAuction(true);
            return;
        }
        setOpenModal(true);
    }



    /**
     * Función para cerrar el modal de subasta
     * @returns 
     */
    const handleClose = () => setOpenModal(false);

    /**
     * Función para procesar la carta
     * @param id 
     * @returns 
     */
    const processCard = (id: string) => {
        const timer = setTimeout(() => {
            setError('Actualmente no se puede cargar la carta.');
        }, 5000); // 5 segundos
        setLoading(true);
        getCardFromUserCollection(id)
            .then((data) => {
                clearTimeout(timer);
                setCard(data.item);

                setInAuction(false);

                if (data.status === CardStatus.OnAuction && data.username == username) {
                    setInAuction(true);
                }
                if (data.status === CardStatus.OnAuction && data.username != username) {
                    setInAuction(true);
                }
                return getShopTransactionsCard(data._id);
            })
            .then(
                (data) => {
                    setTransactions(data);
                    setLoading(false);
                }
            )
            .catch((error) => {
                setLoading(false);
                clearTimeout(timer);
                setError('Actualmente no se puede cargar la carta.');
            });


        return () => {
            setLoading(false);
            clearTimeout(timer);
        }
    }

    useEffect(() => {
        if (update && updateId === id) {
            const timer = setTimeout(() => {

                processCard(id);
                dispatch(resetUpdate());
            }, 2000);
            return () => {
                clearTimeout(timer);
            }
        }
    }, [id, username, update]);

    useEffect(() => {
        processCard(id);
    }, []);


    //ERROR
    if (error) {
        return (
            <ErrorMessageBox message={error} />
        );
    }

    // LOADING
    if (loading) {
        return <Container style={{ textAlign: 'center' }}><CircularProgress /></Container>;
    }

    return (
        <GeneralCardDetail title="Mi colección" backLabel="Volver a mi colección" handleBack={() => navigate("/album")}
            card={card}
            id={id}
            transactions={transactions}
            pokemonBoxChildren={
                <Button startIcon={<StarIcon />}
                    variant="contained"
                    sx={{ marginTop: 2, marginBottom: 2 }}
                    buttonType="ghost"
                    onClick={() => {
                        Swal.fire({
                            title: 'Funcionalidad disponible próximamente 😉',
                            icon: 'info',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#81c784',
                        });
                    }}
                    label='Destacar carta'
                />}

            cardInformationChildren={inAuction ? (<CardActions>

                <Alert severity="success" sx={{ width: '100%', fontSize: '1.1em' }} role='alert' aria-label='La carta está en subasta'>
                    ¡La carta está en subasta!
                </Alert>
            </CardActions>)
                : (<CardActions>
                    <Button
                        startIcon={<GavelIcon />}
                        variant="contained"
                        sx={{ marginTop: 2, marginBottom: 2 }}
                        fullWidth
                        buttonType="primary"
                        onClick={handleOpen}
                        label='Realizar subasta'
                    />
                </CardActions>)

            }
            form={<AddAuctionForm open={openModal} handleClose={handleClose} userCardId={id} />}
        />
    );
};

export default CardDetail;

import GavelIcon from '@mui/icons-material/Gavel';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import {
    Box,
    CardActions,
    CircularProgress
} from "@mui/material";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCardFromUserCollection, getShopTransactionsCard } from '../../../api/api';
import { resetUpdate } from '../../../redux/slices/updateSlice';
import { RootState } from '../../../redux/store';
import { CardStatus, Card as CardType, Transaction } from "../../../shared/sharedTypes";
import Button from '../buttons/Button';
import ErrorMessageBox from '../error/ErrorMessageBox';
import AddAuctionForm from '../forms/AddAuctionForm';
import GeneralCardDetail from './GeneralCardDetail';


const CardDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [card, setCard] = useState<CardType | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inAuction, setInAuction] = useState<boolean>(false);




    const sessionUser = useSelector((state: RootState) => state.user);
    const username = sessionUser.username.toLowerCase();
    const { update, updateId } = useSelector((state: RootState) => state.update);

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

    const handleOpen = async () => {
        const canProceed = await checkAvailableCard(id);
        if (!canProceed) {
            setInAuction(true);
            return;
        }
        setOpenModal(true);


    }
    const handleClose = () => setOpenModal(false);

    const processCard = (id: string) => {
        const timer = setTimeout(() => {
            setError('Error: The request is taking too long to load.');
        }, 5000); // 5 segundos

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
            .then(setTransactions)
            .catch((error) => {
                clearTimeout(timer);
                setError(error.message || 'Error: An unexpected error occurred.');
            });


        return () => clearTimeout(timer);
    }

    useEffect(() => {
        if (update && updateId === id) {
            processCard(id);
            dispatch(resetUpdate());
        }
    }, [id, username, update, updateId]);

    useEffect(() => {
        processCard(id);
    }, []);

    if (error) {
        return (
            <ErrorMessageBox />
        );
    }

    if (!card) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <GeneralCardDetail
            card={card}
            id={id}
            transactions={transactions}
            pokemonBoxChildren={
                <Button startIcon={<StarIcon />}
                    variant="contained"
                    sx={{ marginTop: 2, marginBottom: 2 }}
                    buttonType="ghost"
                    onClick={handleOpen}
                    label='Destacar carta'
                />}

            cardInformationChildren={inAuction ? (<CardActions>

                <Button
                    startIcon={<RemoveCircleOutlineIcon />}
                    variant="contained"
                    sx={{ marginTop: 2, marginBottom: 2 }}
                    fullWidth
                    buttonType="ghost"
                    label='Retirar subasta'
                />
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

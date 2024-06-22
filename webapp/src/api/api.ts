import { Auction, CardStatus, Transaction, TransactionConcept, UserCard } from "../shared/sharedTypes";
import { calculateRemainingTime } from "../utils/utils";
import { getAuction } from "./auctionsAPI";
import { getCard } from "./cardAPI";
import { getTransactionsForUserCard } from "./transactionsAPI";
import { getUserCard, getUserCards } from "./userCardsAPI";



/**
 * Método para obtener la colección de cartas de un usuario.
 * 
 * @param {string} username nombre de usuario
 * @returns {Promise<UserCard[]>} lista de cartas del usuario
 * 
 * @throws {Error} si se produce un error al obtener las cartas del usuario
 */
export const getUserCardCollection = async (username: string): Promise<UserCard[]> => {
    try {
        // Obtener los datos iniciales de las cartas del usuario.
        let userCards = await getUserCards(username);

        // Filtrar las cartas que no están a la venta.
        userCards = userCards.filter(userCard => userCard.status === CardStatus.NotForSale);


        // Crear una lista de promesas para cada carta del usuario.
        const cardPromises = userCards.map(userCard =>
            getCard(userCard.legibleCardId).then(card => ({
                _id: userCard._id,
                card: card._id,
                legibleCardId: userCard.legibleCardId,
                user: userCard.user,
                username: userCard.username,
                status: userCard.status,
                transactionHistory: userCard.transactionHistory,
                item: card,
            }))
        );

        // Esperar a que todas las promesas se resuelvan y devolver la lista de cartas del usuario con sus datos completos.
        return await Promise.all(cardPromises);
    } catch (error) {
        throw new Error('Se ha producido un error al obtener la colección de cartas del usuario. Por favor, inténtelo de nuevo más tarde.');
    }
};


/**
 * Método para obtener una carta de la colección de un usuario.
 * 
 * @param {string} userCardId ID de la carta del usuario
 * @returns {Promise<UserCard>} carta del usuario
 * 
 * @throws {Error} si se produce un error al obtener la carta del usuario
 */
export const getCardFromUserCollection = async (userCardId: string): Promise<UserCard> => {
    try {
        const userCard = await getUserCard(userCardId);
        return await getCard(userCard.legibleCardId).then(card => ({
            _id: userCard._id,
            card: card._id,
            legibleCardId: userCard.legibleCardId,
            user: userCard.user,
            username: userCard.username,
            status: userCard.status,
            transactionHistory: userCard.transactionHistory,
            item: card,
        }));
    } catch (error) {
        throw new Error('Se ha producido un error al obtener la carta del usuario. Por favor, inténtelo de nuevo más tarde.');
    }
}

/**
 * Método para obtener una carta de una subasta.
 * 
 * @param {string} userCardId ID de la carta del usuario
 * @returns {Promise<UserCard>} carta del usuario
 * 
 * @throws {Error} si se produce un error al obtener la carta del usuario
 */
export const getCardFromAuction = async (auctionId: string): Promise<UserCard> => {
    try {
        const auction: Auction = await getAuction(auctionId);

        let duration = calculateRemainingTime(auction.estimatedEndDate);

        const userCard = await getUserCard(auction.card);
        return await getCard(userCard.legibleCardId).then(card => ({
            _id: userCard._id,
            card: card._id,
            legibleCardId: userCard.legibleCardId,
            user: userCard.user,
            username: userCard.username,
            status: userCard.status,
            transactionHistory: userCard.transactionHistory,
            item: card,
            duration,
            initialPrice: auction.initialPrice,
        }));
    } catch (error) {
        throw new Error('Se ha producido un error al obtener la carta del usuario. Por favor, inténtelo de nuevo más tarde.');
    }
}


/**
 * Obtiene las transacciones de compra de una carta. 
 * Se filtran las transacciones por adquisición de la carta mediante sobre, subasta o regalo.
 * 
 * @param {string} userCardId ID de la carta del usuario 
 * @returns {Promise<Transaction>} transacciones de compra de la carta
 * 
 * @throws {Error} si se produce un error
 */
export const getShopTransactionsCard = async (userCardId: string): Promise<Transaction[]> => {
    try {
        const transactions = await getTransactionsForUserCard(userCardId);

        const filteredTransactions = transactions.filter(transaction =>
            [TransactionConcept.PurchaseByCardPack, TransactionConcept.PurchaseByBid, TransactionConcept.Gift].includes(transaction.concept[0])
        );
        return filteredTransactions;
    } catch (error) {
        throw new Error('Se ha producido un error al obtener las transacciones de la carta. Por favor, inténtelo de nuevo más tarde.');
    }
}

/**
 * Obtiene las cartas que están en subasta.
 * 
 * @param {Auction[]} auctions subastas
 * @returns {Promise<UserCard[]>} cartas de las subastas
 * 
 */
export const getAuctionCards = async (auctions: Auction[]): Promise<UserCard[]> => {
    try {
        const userCardPromises = auctions.map(auction =>
            getUserCard(auction.card).then(userCard =>
                getCard(userCard.legibleCardId).then(card => ({
                    _id: userCard._id,
                    card: card._id,
                    legibleCardId: userCard.legibleCardId,
                    user: userCard.user,
                    username: userCard.username,
                    status: userCard.status,
                    transactionHistory: userCard.transactionHistory,
                    item: card,
                    duration: calculateRemainingTime(auction.estimatedEndDate),
                }))
            )
        );

        return await Promise.all(userCardPromises);
    } catch (error) {
        throw new Error('Se ha producido un error al obtener las cartas de las subastas. Por favor, inténtelo de nuevo más tarde.');
    }
}

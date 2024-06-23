import { Auction, Bid, BidStatus, CardPack, CardStatus, Transaction, TransactionConcept, UserCard } from "../shared/sharedTypes";
import { calculateRemainingTime } from "../utils/utils";
import { getAuction } from "./auctionsAPI";
import { getBidById, getUserActiveBids } from "./bidsAPI";
import { getCard } from "./cardAPI";
import { getDeckById } from "./decksAPI";
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
            auction: auction
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
                    initialPrice: auction.initialPrice,
                    auction: auction,
                    duration: calculateRemainingTime(auction.estimatedEndDate),
                }))
            )
        );

        return await Promise.all(userCardPromises);
    } catch (error) {
        throw new Error('Se ha producido un error al obtener las cartas de las subastas. Por favor, inténtelo de nuevo más tarde.');
    }
}


/**
 * Comprueba si en la subasta que se pasa por parámetro, hay una puja activa del usuario.
 * 
 * @param {string} username nombre de usuario
 * @param {Auction} auction subasta
 * 
 * @returns {Promise<Bid>} puja activa del usuario
 * 
 */
export const checkActiveBid = async (username: string, auction: Auction): Promise<Bid> => {
    try {
        const activeBids: Bid[] = await getUserActiveBids(username);
        let bid: Bid = activeBids.find(bid => bid.auction === auction._id);

        if (bid) {
            bid.auctionItem = auction;
        }

        return bid;

    } catch (error) {
        throw new Error('Se ha producido un error al comprobar si hay una puja activa. Por favor, inténtelo de nuevo más tarde.');
    }
}


/**
 * Obtiene las cartas por las que ha pujado un usuario.
 * 
 * @param {Bid[]} bids - pujas
 * @returns {Promise<UserCard[]>} cartas de las pujas
 * 
 */
export const getBidsCards = async (bids: Bid[]): Promise<UserCard[]> => {
    try {
        const userCardPromises = bids.map(bid =>
            getAuction(bid.auction).then(auction =>
                getUserCard(bid.usercard).then(userCard =>
                    getCard(userCard.legibleCardId).then(card => ({
                        _id: userCard._id,
                        card: card._id,
                        legibleCardId: userCard.legibleCardId,
                        user: userCard.user,
                        username: userCard.username,
                        status: userCard.status,
                        transactionHistory: userCard.transactionHistory,
                        item: card,
                        initialPrice: bid.price,
                        bid: bid,
                        duration: calculateRemainingTime(auction.estimatedEndDate),
                    }))
                )
            )
        );

        return await Promise.all(userCardPromises);
    } catch (error) {
        throw new Error('Se ha producido un error al obtener las cartas de las subastas. Por favor, inténtelo de nuevo más tarde.');
    }
}

/**
 * Método para obtener una carta de una puja.
 * 
 * @param {string} bidId  - ID de la puja
 * @returns {Promise<UserCard>} carta del usuario
 * 
 * @throws {Error} si se produce un error al obtener la carta del usuario
 */
export const getCardFromBid = async (bidId: string): Promise<UserCard> => {
    try {
        const bid: Bid = await getBidById(bidId);

        let duration = calculateRemainingTime(bid.estimatedDate);

        const userCard = await getUserCard(bid.usercard);
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
            initialPrice: bid.price,
            bid: bid
        }));
    } catch (error) {
        throw new Error('Se ha producido un error al obtener la carta del usuario. Por favor, inténtelo de nuevo más tarde.');
    }
}


/**
 * Filtrar subastas para solo mostrar aquellas en las que no tenga una puja en estado 'Pending' para el usuario.
 * 
 * @param {Auction[]} auctions - subastas
 * @param {string} username - nombre de usuario
 * 
 * @returns {Promise<Auction[]>} subastas filtradas
 * 
 * @throws {Error} si se produce un error al filtrar las subastas
 */
export const filterAuctionsByUserActiveBid = async (auctions: Auction[], username: string): Promise<Auction[]> => {
    const filteredAuctions = [];

    for (const auction of auctions) {
        if (auction.bids && auction.bids.length > 0) {
            // Obtener todas las pujas de una subasta de forma asíncrona y revisar condiciones
            const bids = await Promise.all(auction.bids.map(bidId => getBidById(bidId)));

            // Comprobar si alguna puja del usuario está en estado 'Pending'
            const hasPendingBid = bids.some(bid => bid.username === username.toLowerCase() && bid.status === BidStatus.Pending);

            // Si no hay pujas 'Pending' del usuario, incluir la subasta
            if (!hasPendingBid) {
                filteredAuctions.push(auction);
            }
        } else {
            // Incluir subasta si no hay pujas asociadas
            filteredAuctions.push(auction);
        }
    }

    return filteredAuctions;
};


/**
 * Vincular mazos de cartas a los distintos sobres de cartas.
 * 
 * @param {CardPack[]} packs - sobres de cartas
 * 
 * @returns {Promise<CardPack[]>} sobres de cartas con mazos vinculados
 * 
 * @throws {Error} si se produce un error al vincular los mazos de cartas
 */
export const linkDecksToCardPacks = async (packs: CardPack[]): Promise<CardPack[]> => {
    try {
        // Vincular mazos a los sobres de cartas
        for (let pack of packs) {
            if (pack.deckId1) {
                const deck = await getDeckById(pack.deckId1);
                pack.deck1 = deck;
            }
            if (pack.deckId2) {
                const deck = await getDeckById(pack.deckId2);
                pack.deck2 = deck;
            }
            if (pack.deckId3) {
                const deck = await getDeckById(pack.deckId3);
                pack.deck3 = deck;
            }

        }

        return packs;
    } catch (error) {
        throw new Error('Se ha producido un error al vincular los mazos de cartas a los sobres. Por favor, inténtelo de nuevo más tarde.');
    }
}
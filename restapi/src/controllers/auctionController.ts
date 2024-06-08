import Auction from '../models/auction';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import UserCard from '../models/userCard';
import { CardStatus, TransactionConcept, BidStatus } from '../models/utils/enums';
import Transaction from '../models/transaction';
import User from '../models/user';
import Bid from '../models/bid';
import { AuctionStatus } from '../models/utils/enums';
import { IAuction, IBid } from './types/types';


/**
 * Función para obtener todas las subastas.
 * @param req
 * @param res
 * @returns subastas
 * @throws 500 - Si se produce un error al obtener las subastas
 */
const getAuctions = async (req: Request, res: Response) => {
    try {
        const auctions = await Auction.find();
        res.status(200).json(auctions);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'No se pudieron obtener las subastas.' });
    }
}

/**
 * Función para obtener una subasta dado su id.
 * @param req
 * @param res
 * @returns subasta
 * @throws 404 - Si no se encuentra la subasta
 * @throws 500 - Si se produce un error al obtener la subasta
 */
const getAuction = async (req: Request, res: Response) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: 'Subasta no encontrada.' });
        }
        res.status(200).json(auction);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'No se pudo obtener la subasta.' });
    }
}


/**
 * Función para obtener todas las subastas activas.
 * @param req
 * @param res
 * @returns subastas activas
 * @throws 500 - Si se produce un error al obtener las subastas activas
 */
const getActiveAuctions = async (req: Request, res: Response) => {
    try {
        const auctions = await Auction.find({ status: 'open' });
        res.status(200).json(auctions);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'No se pudieron obtener las subastas activas.' });
    }
}

/**
 * Función para obtener todas las subastas activas de un usuario.
 * @param req request con el username del usuario
 * @param res
 * @returns subastas activas del usuario
 * @throws 500 - Si se produce un error al obtener la subasta activa del usuario
 */
const getActiveAuctionByUser = async (req: Request, res: Response) => {
    try {
        const auctions = await Auction.find({ status: AuctionStatus.Open, sellerUsername: req.params.username });
        res.status(200).json(auctions);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'No se pudieron obtener las subastas activas del usuario.' });
    }
}




/**
 * Función para poner una carta en subasta.
 * 1. Verificar que el usuario exista.
 * 2. Verificar que la carta exista.
 * 3. Verificar que la carta no esté en subasta.
 * 4. Actualizar la UserCard para indicar que está en subasta.
 * 5. Registrar la transacción de carta en subasta.
 * 6. Añadir la referencia de la transacción a la carta.
 * 7. Crear la subasta, con la fecha de finalización calculada en base a la duración. Si no se especifica, se establece en 48 horas. 
 * Como máximo, la duración de la subasta es de 3 días (72 horas) y como mínimo, de 2 horas.
 * 8. Registrar la subasta.
 * 9. Realizar la transacción.
 * 10. Retornar un mensaje de éxito con la subasta y la carta en subasta.
 * 
 * @param req request con el username, userCardId, saleBase y duration
 * @param res 
 * @returns {UserCard, Transaction} 200 - Carta puesta en subasta
 * @throws 500 - Si se produce un error al poner la carta en subasta
 */
const putUserCardUpForAuction = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Extraer datos necesarios del request
        const { username, userCardId, saleBase, duration } = req.body;

        if (!saleBase || saleBase <= 0 || !Number.isInteger(saleBase) || saleBase > 1000000) {
            throw new Error("El precio base de la subasta debe ser mayor a 0.");
        }

        // Verificar que el usuario exista
        const user = await User.findOne({ username: username });
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        // Verificar que la carta exista
        const card = await UserCard.findOne({ id: userCardId });
        if (!card) {
            throw new Error("Carta no encontrada.");
        }

        // Verificar que el usuario sea el dueño de la carta o un administrador
        if (card.user !== user.id && user.role !== 'admin'){
            throw new Error("El usuario no es el dueño de la carta que intenta poner en subasta.");
        }

        // Verificar que la carta no esté en subasta
        if (card.status !== CardStatus.NotForSale) {
            throw new Error("La carta ya está en subasta.");
        }

        // Actualizar la UserCard para transferirla al nuevo usuario
        const updatedCard = await UserCard.findOneAndUpdate(
            { _id: userCardId },
            { status:  CardStatus.OnAuction },  // Actualizar el estado
            { new: true, session: session }  // Retorna el documento actualizado
        );

        if (!updatedCard) {
            throw new Error("No se pudo poner la carta en subasta. La carta no se encontró o ya fue vendida.");
        }

        

        // Registrar la transacción de venta
        const saleTransaction = new Transaction({
            user: user.id,
            username: username,
            userCard: userCardId,
            cardId: card.card,
            legibleCardId: req.body.legibleCardId,
            concept: TransactionConcept.ForSale,
            price: saleBase,
            date: new Date(),
            auctionId: new mongoose.Types.ObjectId()
        });
        await saleTransaction.save({ session });


        // Añadir la referencia de la transacción a la carta
        updatedCard.transactionHistory.push(saleTransaction._id);
        await updatedCard.save({ session });

        let calculatedDuration = 48 * 60 * 60 * 1000; // 48 horas por defecto (en milisegundos)
        if(duration && duration >= 2 && duration <= 72) {
            calculatedDuration = duration * 60 * 60 * 1000;
        }

        // Crear la subasta
        const auction = new Auction({
            card: userCardId,
            legibleCardId: updatedCard.legibleCardId,
            seller: user.id,
            sellerUsername: username,
            initialPrice: saleBase,
            publicationDate: new Date(),
            duration: calculatedDuration,
            estimatedEndDate: new Date(Date.now() + calculatedDuration),
            endDate: new Date(Date.now() + calculatedDuration),
            status: AuctionStatus.Open,
            winner: null,
            winnerUsername: null,
            bids: []
        });

        await auction.save({ session });

        // Realizar la transacción si todo fue exitoso
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'La carta se ha puesto en subasta.' });
    } catch (error: any) {
        // Si algo falla, abortar la transacción y manejar el error
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: error.message || 'No se pudo poner la carta en subasta.' });
    }
}

/**
 * La carta se retira de la subasta porque no se ha vendido en el plazo establecido o porque el vendedor/administrador decide retirarla.
 * 1. Verificar que el usuario exista.
 * 2. Verificar que la carta exista.
 * 3. Verificar que la carta esté en subasta.
 * 4. Verificar que la subasta exista.
 * 5. Verificar que la subasta esté abierta.
 * 6. Actualizar la UserCard para indicar que no está en subasta.
 * 7. Actualizar la subasta.
 * 8. Registrar la transacción de carta retirada de la subasta.
 * 9. Añadir la referencia de la transacción a la carta.
 * 10. Realizar la transacción.
 * 11. Retornar un mensaje de éxito con la carta retirada de la subasta y la transacción.
 * 
 * @param req request con el username, userCardId, cardId y auctionId
 * @param res {UserCard, Transaction} 200 - Carta retirada de la subasta
 */
const withdrawnUserCardFromAuction = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Extraer datos necesarios del request
        const { username, userCardId, auctionId } = req.body;

        // Verificar que el usuario exista
        const user = await User.findOne({ username: username });
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        // Actualizar la UserCard para transferirla al nuevo usuario
        const updatedCard = await UserCard.findOneAndUpdate(
            { id: userCardId},
            { status:  CardStatus.NotForSale },  // Actualizar el estado
            { new: true, session: session }  // Retorna el documento actualizado
        );

        if (!updatedCard) {
            throw new Error("No se pudo retirar la carta de la subasta. La carta no se encontró o ya fue vendida.");
        }

        // Verificar que la carta exista
        const card = await UserCard.findOne({ id: userCardId });
        if (!card) {
            throw new Error("Carta no encontrada.");
        }

        // Verificar que el usuario sea el dueño de la carta o un administrador
        if (card.user !== user.id && user.role !== 'admin'){
            throw new Error("El usuario no es el dueño de la carta que intenta retirar de la subasta.");
        }

        // Verificar que la carta esté en subasta
        if (card.status !== CardStatus.OnAuction) {
            throw new Error("La carta no está en subasta.");
        }

        // Verificar que la subasta exista
        const auction = await Auction.findOne({ _id: auctionId });
        if (!auction) {
            throw new Error("Subasta no encontrada.");
        }

        // Verificar que la subasta esté abierta
        if (auction.status as AuctionStatus !== AuctionStatus.Open) {
            throw new Error("La subasta no está abierta.");
        }

        // Actualizar la subasta
        auction.endDate = new Date();
        auction.finalPrice = 0;
        auction.currentPrice = 0;
        auction.status = AuctionStatus.Cancelled;
        await auction.save({ session });

        // Registrar la transacción de venta
        const saleTransaction = new Transaction({
            user: user.id,
            username: username, 
            userCard: userCardId,
            cardId: updatedCard.card,
            legibleCardId: updatedCard.legibleCardId,
            concept: TransactionConcept.Withdrawn,
            price: 0,
            date: new Date(),
            auctionId: auctionId,
        });
        await saleTransaction.save({ session });


        // Añadir la referencia de la transacción a la carta
        updatedCard.transactionHistory.push(saleTransaction._id);
        await updatedCard.save({ session });

        // Realizar la transacción si todo fue exitoso
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: 'La carta se ha retirado de la subasta.' });

    } catch (error: any) {
        // Si algo falla, abortar la transacción y manejar el error
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: error.message || 'No se pudo retirar la carta de la subasta.' });
    }
}

/**
 * Función para verificar todas las subastas activas y cerrar las que ya han finalizado.
 * @returns
 * @throws 500 - Si se produce un error 
 */
const checkAllActiveAuctions = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const auctions = await Auction.find({ status: AuctionStatus.Open });
        const now = new Date();

        const updateAuctions = [];
        for (let i = 0; i < auctions.length; i++) {
            if (auctions[i].endDate <= now) {
                await chekWinnerBid(auctions[i], session);
                updateAuctions.push(auctions[i]);
            }
        }

        // Realizar la transacción si todo fue exitoso
         await session.commitTransaction();
         session.endSession();
         res.status(200).json({ message: 'Se han cerrado las subastas que han finalizado.', auctions: updateAuctions });

    } catch (error: any) {
        console.error(error);
        throw new Error('No se pudieron verificar las subastas activas.');
    }
}


/**
 * Función para verificar la subasta y asignar el ganador de la subasta.
 * @param auction subasta
 * @param session
 * @returns
 */
const chekWinnerBid = async (auction: IAuction, session: any) => {
    try {
        const bidsIds = auction.bids;

        if (bidsIds.length === 0) {
            return;
        }

        let winnerBid: IBid | null = await Bid.findById(bidsIds[0]);

        // Obtener todas las pujas para la subasta específica y que tengan estado 'Active'
        const allBids: IBid[] = await Bid.find({ auction: auction._id, status: BidStatus.Pending }).exec();

        // Ordenar las pujas por precio de manera descendente
        const sortedBids = allBids.sort((bidA, bidB) => bidB.price - bidA.price);

        let allChecked = false;

        for (let i = 0; i < sortedBids.length && !allChecked; i++) {
            if (sortedBids[i].price >= auction.currentPrice) {
                const user = await User.findById(sortedBids[i].user).exec();
                if (user && user.balance >= sortedBids[i].price) {
                    winnerBid = sortedBids[i];
                    allChecked = true;
                    break;
                }
            }
        }

        if (winnerBid) {
            // Actualizar la subasta
            auction.status = AuctionStatus.Closed;
            auction.endDate = new Date();
            auction.winner = winnerBid.user;
            auction.winnerUsername = winnerBid.username;
            auction.currentPrice = winnerBid.price;
            auction.finalPrice = winnerBid.price;
            await auction.save({ session });

            // Actualizar la puja
            winnerBid.status = BidStatus.Winner;
            winnerBid.endDate = new Date();
            await winnerBid.save({ session });

            // Transferir la carta al ganador
            return await transferCard(auction, winnerBid, session);

        }
    }
    catch (error: any) {
        console.error(error);
        throw new Error('No se pudo verificar el ganador de la subasta.');
    }
}



/**
 * Esta función transfiere una carta de un usuario a otro, registrando las transacciones de venta y compra.
 *  
 * @param req
 * @param res
 * @returns
 *  
 * @throws Error
 * - Si la carta no se encuentra o ya fue vendida.
 * - Si no se puede completar la transacción.
 **/
const transferCard = async (auction:IAuction, bid: IBid, session:any) => {
    try {

        const sellerId = auction.seller;
        const sellerUsername = auction.sellerUsername;
        const buyerId = bid.user;
        const buyerUsername = bid.username;
        const userCardId = auction.card;
        const legibleCardId = auction.legibleCardId;
        const salePrice = bid.price;
        const auctionId = auction._id;
        const bidId = bid._id;

        // Verificar el usuario que vende la carta
        const seller = await User.findById(sellerId).session(session);
        if (!seller) {
            throw new Error("Vendedor no encontrado.");
        }

        // Verificar el usuario que compra la carta
        const buyer = await User.findById(buyerId).session(session);
        if (!buyer) {
            throw new Error("Comprador no encontrado.");
        }

        if(buyer.balance < salePrice) {
            throw new Error("El comprador no tiene suficiente saldo para comprar la carta.");
        }

        // Transferir el dinero entre los usuarios
        buyer.balance -= salePrice;
        seller.balance += salePrice;

        await buyer.save({ session });
        await seller.save({ session });



        // Actualizar la UserCard para transferirla al nuevo usuario
        const updatedCard = await UserCard.findOneAndUpdate(
            { id: userCardId },
            { user: buyerId, status: CardStatus.NotForSale},  // Actualizar el usuario y el estado
            { new: true, session: session }  // Retorna el documento actualizado
        );

        if (!updatedCard) {
            throw new Error("No se pudo completar la transferecia de la carta. La carta no se encontró o ya fue vendida.");
        }

        // Registrar la transacción de venta
        const saleTransaction = new Transaction({
            user: sellerId,
            username: sellerUsername,
            userCard: userCardId,
            cardId: updatedCard.card,
            legibleCardId: legibleCardId,
            concept: TransactionConcept.Sold,
            price: salePrice,
            date: new Date(),
            auctionId: auctionId,
            bidId: bidId
        });
        await saleTransaction.save({ session });

        // Registrar la transacción de compra
        const purchaseTransaction = new Transaction({
            user: buyerId,
            username: buyerUsername,
            userCard: userCardId,
            cardId: updatedCard.card,
            legibleCardId: legibleCardId,
            concept: TransactionConcept.Bid,
            price: salePrice,
            date: new Date(),
            auctionId: auctionId,
            bidId: bidId
        });
        await purchaseTransaction.save({ session });

        // Añadir la referencia de la transacción a la carta
        updatedCard.transactionHistory.push(saleTransaction._id, purchaseTransaction._id);
        await updatedCard.save({ session });

        return { message: 'La carta se ha transferido al comprador.', updatedCard: updatedCard, saleTransaction: saleTransaction, purchaseTransaction: purchaseTransaction, bid: bid };

    } catch (error: any) {
        // Si algo falla, abortar la transacción y manejar el error
        console.error(error);
        throw new Error('No se pudo completar la transferecia de la carta.');
    }
};


export {
    getAuctions,
    getAuction,
    getActiveAuctions,
    getActiveAuctionByUser,
    putUserCardUpForAuction,
    withdrawnUserCardFromAuction,
    checkAllActiveAuctions
}


import Bid from '../models/bid';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import UserCard from '../models/userCard';
import { AuctionStatus, BidStatus, CardStatus, TransactionConcept } from '../models/utils/enums';
import Transaction from '../models/transaction';
import Auction, { IAuction } from '../models/auction';
import User from '../models/user';



/**
 * Realiza una puja por una carta en una subasta.
 * 
 * Proceso:
 * 1. Obtener la subasta específica usando el identificador proporcionado.
 * 2. Verificar que la subasta esté activa.
 * 3. Asegurar que el usuario que realiza la puja no sea el dueño de la carta.
 * 4. Confirmar que el usuario tenga suficiente saldo para realizar la puja. Esto no descuenta el saldo, 
 *    pero previene pujas no válidas que podrían saturar el sistema.
 * 5. Verificar que el usuario no haya realizado previamente una puja en la misma subasta.
 * 6. Crear la puja y almacenarla en la base de datos.
 * 7. Asociar la puja a la subasta correspondiente.
 * 8. Registrar una transacción representando la puja.
 * 9. Devolver un mensaje de éxito con los detalles de la puja realizada.
 * 
 * En caso de error durante cualquiera de los pasos, la transacción se aborta y se retorna un mensaje de error.
 * 
 * @param {Request} req - La solicitud HTTP, debe incluir el nombre de usuario, el identificador de la subasta y el monto de la puja.
 * @param {Response} res - La respuesta HTTP, devuelve un mensaje de éxito con los detalles de la puja o un mensaje de error en caso de fallo.
 * 
 * @returns {Promise<Bid>} - Una promesa que resuelve con los detalles de la puja realizada si el proceso es exitoso.
 * 
 * @throws {Error} 500 - Si se produce un error durante el proceso de realizar la puja.
 */
const createBid = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { username, auctionId, amount } = req.body;

        const auction: IAuction | null = await Auction.findOne({ auctionId: auctionId }).session(session);
        if (!auction) {
            throw new Error("La subasta no existe.");
        }

        // Verificar que la subasta esté activa
        if (auction.status as AuctionStatus !== AuctionStatus.Open) {
            throw new Error("La subasta no está activa.");
        }

        // Verificar que el usuario no sea el dueño de la carta
        if (auction.sellerUsername === username) {
            throw new Error("No puedes pujar por tu propia carta.");
        }

        // Verificar que no haya una puja previa del mismo usuario
        const previousBid = await Bid.findOne({ auctionId: auctionId, username: username }).session(session);
        if (previousBid) {
            throw new Error("Ya has realizado una puja en esta subasta.");
        }

        // Verificar que el usuario tenga suficiente saldo para realizar la puja
        const user = await User.findOne({ username: username }).session(session);
        
        if (!user) {
            throw new Error("El usuario que intenta pujar no existe.");
        }

        if (user && user.balance && user.balance < amount) {
            throw new Error("Saldo insuficiente para realizar la puja.");
        } else if (!user.balance) {
            throw new Error("El usuario no tiene saldo.");
        } else {

            const bid = new Bid({
                auction: auctionId,
                user: user._id,
                username: username,
                usercard: auction.card,
                legibleCardId: auction.legibleCardId,
                initDate: new Date(),
                estimatedDate: auction.estimatedEndDate,
                endDate: auction.estimatedEndDate,
                price: amount,
                status: BidStatus.Pending
            });

            await bid.save({ session: session });

            auction.bids.push(bid._id);
            await auction.save({ session: session });

            const transaction = new Transaction({
                user: user._id,
                username: username,
                legibleCardId: auction.legibleCardId,
                userCard: auction.card,
                concept: TransactionConcept.Bid,
                date: new Date(),
                price: amount,
                auctionId: auctionId,
                bidId: bid._id
            });

            await transaction.save({ session: session });

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({
                message: "Puja realizada con éxito.",
                bid: bid
            });
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
}

/**
 * Obtiene todas las pujas realizadas por un usuario específico.
 * 
 * Proceso:
 * 1. Se recuperan todas las pujas realizadas por el usuario.
 * 2. Se devuelven las pujas.
 * 
 * @param {Request} req - La solicitud HTTP, debe contener el nombre del usuario en el cuerpo o en los parámetros de la consulta.
 * @param {Response} res - La respuesta HTTP, retorna las pujas realizadas por el usuario o un mensaje de error en caso de fallo.
 * 
 * @returns {Promise<Bid[]>} Una promesa que resuelve con un arreglo de pujas si la operación es exitosa.
 * 
 * @throws {Error} 404 - Si el usuario no existe.
 * @throws {Error} 500 - Si se produce un error al obtener las pujas.
 */
const getBidHistoryByUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado.'
            });
        }
        const bids = await Bid.find({ username: username });
        res.status(200).json(bids);
    } catch (error) {
        return res.status(500).json({
            message: 'Se ha producido un error al buscar las pujas realizadas por el usuario. Por favor, inténtelo de nuevo.'
        });
    }
}

/**
 * Obtiene todas las pujas realizadas en una subasta específica.
 * 
 * Proceso:
 * 1. Se recupera la subasta específica usando el identificador proporcionado.
 * 2. Se recuperan todas las pujas realizadas en la subasta.
 * 3. Se devuelven las pujas.
 * 
 * @param {Request} req - La solicitud HTTP, debe contener el identificador de la subasta en los parámetros de la consulta.
 * @param {Response} res - La respuesta HTTP, retorna las pujas realizadas en la subasta o un mensaje de error en caso de fallo.
 * 
 * @returns {Promise<Bid[]>} Una promesa que resuelve con un arreglo de pujas si la operación es exitosa.
 * 
 * @throws {Error} 404 - Si la subasta no existe.
 * @throws {Error} 500 - Si se produce un error al obtener las pujas.
 */
const getBidHistoryByAuction = async (req: Request, res: Response) => {
    try {
        const { auctionId } = req.params;

        const auction = await Auction.findOne({ auction : auctionId });
        if (!auction) {
            return res.status(404).json({
                message: 'Subasta no encontrada.'
            });
        }

        const bids = await Bid.find({ auctionId: auctionId });

        res.status(200).json(bids);

    } catch (error) {
        return res.status(500).json({
            message: 'Se ha producido un error al buscar las pujas realizadas en la subasta. Por favor, inténtelo de nuevo.'
        });
    }
}

/**
 * Obtiene todas las pujas activas realizadas por un usuario específico.
 * 
 * Proceso:
 * 1. Se verifica que el usuario exista.
 * 2. Se recuperan todas las subastas activas.
 * 3. Se recuperan todas las pujas realizadas por el usuario en las subastas activas.
 * 4. Se devuelven las pujas.
 * 
 * @param {Request} req - La solicitud HTTP, debe contener el nombre del usuario en el cuerpo o en los parámetros de la consulta.
 * @param {Response} res - La respuesta HTTP, retorna las pujas activas realizadas por el usuario o un mensaje de error en caso de fallo.
 * 
 * @returns {Promise<Bid[]>} Una promesa que resuelve con un arreglo de pujas si la operación es exitosa.
 * 
 * @throws {Error} 404 - Si el usuario no existe.
 * @throws {Error} 500 - Si se produce un error al obtener las pujas.
 */
const getActiveBidsByUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado.'
            });
        }
        
        const auctions = await Auction.find({ status: AuctionStatus.Open });
        const bids = await Bid.find({ username: username, auction: { $in: auctions.map(auction => auction._id) } });

        res.status(200).json(bids);
    } catch (error) {
        return res.status(500).json({
            message: 'Se ha producido un error al buscar las pujas activas realizadas por el usuario. Por favor, inténtelo de nuevo.'
        });
    }
}

/**
 * Retira una puja realizada por un usuario en una subasta específica. 
 * La puja debe estar en estado "Pendiente" para poder ser retirada.
 * 
 * Proceso:
 * 1. Se verifica que la puja exista.
 * 2. Se verifica que la puja esté en estado "Pendiente".
 * 3. Se actualiza el estado de la puja a "Retirada" y se establece la fecha de finalización.
 * 4. Se registra la transacción de la retirada de la puja.
 * 5. Se devuelve un mensaje de éxito.
 * 
 * @param {Request} req - La solicitud HTTP, debe contener el identificador de la puja en los parámetros de la consulta.
 * @param {Response} res - La respuesta HTTP, retorna un mensaje de éxito o un mensaje de error en caso de fallo.
 * 
 * @returns {Promise<Bid>} Una promesa que resuelve con la puja retirada si la operación es exitosa.
 * 
 * @throws {Error} 404 - Si la puja no existe o si la puja no está en estado "Pendiente".
 * @throws {Error} 500 - Si se produce un error al retirar la puja.
 */

const withdrawBid = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { bidId, username } = req.params;

        const bid = await Bid.findOne({ _id: bidId }).session(session);
        if (!bid) {
            throw new Error("La puja no existe.");
        }

        if (bid.username !== username) {
            throw new Error("No puedes retirar una puja que no te pertenece.");
        }

        if (bid.status as BidStatus !== BidStatus.Pending) {
            throw new Error("La puja no está en estado 'Pendiente'.");
        }

        bid.status = BidStatus.Withdrawn;
        bid.endDate = new Date();
        await bid.save({ session: session });

        const transaction = new Transaction({
            user: bid.user,
            username: bid.username,
            legibleCardId: bid.legibleCardId,
            userCard: bid.usercard,
            concept: TransactionConcept.BidWithdrawn,
            date: new Date(),
            price: bid.price,
            auctionId: bid.auction,
            bidId: bidId
        });

        await transaction.save({ session: session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: "Puja retirada con éxito.",
            bid: bid
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
}

export { createBid, getBidHistoryByUser, getBidHistoryByAuction, getActiveBidsByUser, withdrawBid };
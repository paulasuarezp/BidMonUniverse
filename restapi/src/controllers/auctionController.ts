import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Auction, { IAuction } from '../models/auction';
import Bid, { IBid } from '../models/bid';
import Notification from '../models/notification';
import Transaction from '../models/transaction';
import User from '../models/user';
import UserCard from '../models/userCard';
import { AuctionStatus, BidStatus, CardStatus, NotificationImportance, NotificationType, TransactionConcept } from '../models/utils/enums';
import { sendNotification } from './notificationController';

/**
 * Recupera todas las subastas activas disponibles en la base de datos.
 * Esta función busca y devuelve todas las subastas registradas, independientemente de su estado.
 * Es ideal para obtener una vista general de todas las subastas en el sistema.
 * 
 * @param {Request} req - El objeto de solicitud HTTP, no se utiliza en la función pero es necesario por la estructura de los controladores.
 * @param {Response} res - El objeto de respuesta HTTP utilizado para enviar las subastas recuperadas o un mensaje de error.
 * 
 * @returns {void} - No retorna un valor directamente, pero envía una respuesta HTTP con las subastas en formato JSON.
 * Si ocurre un error durante la recuperación, se devuelve un estado 500 con un mensaje de error.
 * 
 * @throws {Error} 500 - Si se produce un error al intentar recuperar las subastas desde la base de datos.
 */
const getAuctions = async (req: Request, res: Response) => {
    try {
        const auctions = await Auction.find({ status: AuctionStatus.Open }).sort({ estimatedEndDate: 1 });
        res.status(200).json(auctions);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'No se pudieron obtener las subastas.' });
    }
}

/**
 * Recupera una subasta específica por su ID.
 * Esta función busca una subasta en la base de datos utilizando el ID proporcionado en los parámetros de la solicitud.
 * Devuelve la subasta si se encuentra, o un error si la subasta no existe o no puede ser recuperada por algún problema técnico.
 * 
 * @param {Request} req - El objeto de solicitud HTTP, que debe incluir el ID de la subasta en `req.params.id`.
 * @param {Response} res - El objeto de respuesta HTTP utilizado para enviar la subasta recuperada o un mensaje de error.
 * 
 * @returns {void} - No retorna un valor directamente, pero envía una respuesta HTTP. Si la subasta se encuentra,
 * devuelve un estado 200 y la subasta en formato JSON. Si la subasta no se encuentra, devuelve un estado 404 con un mensaje de error.
 * Si ocurre un error al recuperar la subasta, se devuelve un estado 500 con un mensaje de error.
 * 
 * @throws {Error} 404 - Si no se encuentra la subasta con el ID proporcionado.
 * @throws {Error} 500 - Si se produce un error durante el proceso de recuperación de la subasta.
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
 * Recupera todas las subastas activas en el sistema, excluyendo las subastas del usuario actual.
 * Esta función busca en la base de datos todas las subastas que se encuentran con el estado 'open' y las devuelve.
 * Es útil para mostrar a los usuarios una lista de subastas en las que pueden participar actualmente.
 * 
 * @param {Request} req - El objeto de solicitud HTTP, no se usa directamente pero es necesario para la estructura de la función.
 * @param {Response} res - El objeto de respuesta HTTP utilizado para enviar las subastas recuperadas al cliente.
 * 
 * @returns {Promise<void>} - No retorna un valor directamente, pero envía una respuesta HTTP con las subastas activas en formato JSON.
 * 
 * @throws {Error} 500 - Se lanza un error si hay un problema al intentar recuperar las subastas activas de la base de datos.
 */
const getActiveAuctions = async (req: Request, res: Response) => {
    try {
        let username = req.params.username.toLowerCase();
        let today = new Date();
        const auctions = await Auction.find({ status: AuctionStatus.Open, estimatedEndDate: { $gte: today }, sellerUsername: { $ne: username } }).sort({ estimatedEndDate: 1 });
        res.status(200).json(auctions);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'No se pudieron obtener las subastas activas.' });
    }
}

/**
 * Recupera todas las subastas activas asociadas a un usuario específico.
 * La función busca en la base de datos todas las subastas que están abiertas ('Open') y que corresponden
 * al nombre de usuario proporcionado en los parámetros del request. Si se encuentran, las devuelve en formato JSON.
 * 
 * @param {Request} req - El objeto de solicitud HTTP, debe incluir el username del usuario en req.params.
 * @param {Response} res - El objeto de respuesta HTTP donde se envían las subastas activas o un mensaje de error.
 * 
 * @returns {Promise<void>} No retorna un valor directamente, pero envía una respuesta HTTP con las subastas activas del usuario
 * o un mensaje de error en caso de fallo.
 * 
 * @throws {Error} 500 - Si se produce un error durante la recuperación de las subastas activas del usuario.
 */

const getActiveAuctionsByUser = async (req: Request, res: Response) => {
    try {
        let username = req.params.username.toLowerCase();
        let today = new Date();
        const auctions = await Auction.find({ status: AuctionStatus.Open, estimatedEndDate: { $gte: today }, sellerUsername: username });
        res.status(200).json(auctions);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'No se pudieron obtener las subastas activas del usuario.' });
    }
}

/**
 * Pone una carta en subasta, realizando una serie de validaciones y creando registros asociados.
 * 
 * Proceso:
 * 1. Verifica la existencia del usuario y que sea el propietario de la carta.
 * 2. Confirma que la carta existe y no está ya en subasta.
 * 3. Actualiza el estado de la carta a 'En subasta'.
 * 4. Registra la transacción de la carta en subasta.
 * 5. Añade la referencia de la transacción a la carta.
 * 6. Crea la subasta con una duración definida (predeterminada a 48 horas si no se especifica).
 * 7. Registra la subasta en la base de datos.
 * 8. Realiza la transacción y devuelve un mensaje de éxito.
 * 
 * @param {Request} req - Request con el username, userCardId, saleBase y duration.
 * @param {Response} res - Response donde se envía el resultado de la operación.
 * @returns {Promise<void>} Devuelve mediante la respuesta HTTP la confirmación de la subasta y el objeto de la carta actualizado.
 * @throws {Error} 500 - Si se produce un error al poner la carta en subasta, describiendo el motivo específico del fallo.
 */
const putUserCardUpForAuction = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Extraer datos necesarios del request
        let { username, userCardId, saleBase, duration } = req.body;

        username = username.toLowerCase();

        if (!saleBase || saleBase <= 0 || !Number.isInteger(saleBase) || saleBase > 1000000) {
            throw new Error("El precio base de la subasta debe ser mayor a 0.");
        }

        // Verificar que el usuario exista
        const user = await User.findOne({ username_lower: username });
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        // Verificar que la carta exista
        const card = await UserCard.findById(userCardId);
        if (!card) {
            throw new Error("Carta no encontrada.");
        }

        // Verificar que el usuario sea el dueño de la carta o un administrador
        if (card.user == user._id) {
            throw new Error("El usuario no es el dueño de la carta que intenta poner en subasta.");
        }

        // Verificar que la carta no esté en subasta
        if (card.status !== CardStatus.NotForSale) {
            throw new Error("La carta ya está en subasta.");
        }

        // Actualizar la UserCard para ponerla en subasta
        const updatedCard = await UserCard.findOneAndUpdate(
            { _id: userCardId },
            { status: CardStatus.OnAuction },  // Actualizar el estado
            { new: true, session: session }  // Retorna el documento actualizado
        );

        if (!updatedCard) {
            throw new Error("No se pudo poner la carta en subasta. La carta no se encontró o ya fue vendida.");
        }



        // Registrar la transacción de venta
        const saleTransaction = new Transaction({
            user: user._id,
            username: username,
            userCard: userCardId,
            cardId: card.card,
            legibleCardId: card.legibleCardId,
            concept: TransactionConcept.ForSaleOnAuction,
            price: saleBase,
            date: new Date(),
            auctionId: new mongoose.Types.ObjectId()
        });
        await saleTransaction.save({ session });


        // Añadir la referencia de la transacción a la carta
        updatedCard.transactionHistory.push(saleTransaction._id);
        await updatedCard.save({ session });

        let calculatedDuration = 48 * 60 * 60 * 1000; // 48 horas por defecto (en milisegundos)
        if (duration && duration >= 2 && duration <= 96) {
            calculatedDuration = duration * 60 * 60 * 1000;
        }

        // Crear la subasta
        const auction = new Auction({
            card: userCardId,
            legibleCardId: updatedCard.legibleCardId,
            seller: user._id,
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
 * Retira una carta de la subasta, ya sea porque el plazo ha expirado sin ventas o por decisión del vendedor o administrador.
 * El proceso incluye verificar la existencia y estado tanto del usuario como de la carta y la subasta correspondiente,
 * actualizar el estado de la carta a 'No en subasta', cancelar la subasta, y registrar una transacción que refleja la retirada de la carta.
 * Finalmente, actualiza la referencia de la transacción en la carta y confirma todos los cambios mediante una transacción de base de datos.
 * 
 * Pasos detallados:
 * 1. Verificar que el usuario exista.
 * 2. Verificar que la carta exista y esté en subasta.
 * 3. Confirmar que la subasta asociada esté abierta.
 * 4. Actualizar el estado de la carta a 'No en subasta'.
 * 5. Actualizar y cerrar la subasta.
 * 6. Registrar la transacción de retirada de la subasta.
 * 7. Añadir la referencia de la transacción a la carta.
 * 8. Cancelar todas las pujas asociadas a la subasta.
 * 9. Confirmar la transacción en la base de datos.
 * 10. Devolver un mensaje de éxito.
 * 
 * @param {Request} req - Request con el username, userCardId y auctionId necesarios para identificar el usuario, la carta y la subasta.
 * @param {Response} res - Response donde se envía el resultado de la operación, incluyendo un mensaje de éxito o un error.
 * @returns {Promise<void>} - La función devuelve mediante la respuesta HTTP el resultado de la operación.
 * @throws {Error} 500 - Se lanza un error si no se puede completar la operación, detallando el motivo específico del fallo.
 */
const withdrawnUserCardFromAuction = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Extraer datos necesarios del request
        let { username, auctionId } = req.body;
        username = username.toLowerCase();

        // Verificar que el usuario exista
        const user = await User.findOne({ username_lower: username });
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        // Verificar que la subasta exista
        const auction = await Auction.findOne({ _id: auctionId });
        if (!auction) {
            throw new Error("Subasta no encontrada.");
        }

        let userCardId = auction.card;

        // Verificar que la carta exista
        const card = await UserCard.findOne({ _id: userCardId });
        if (!card) {
            throw new Error("Carta no encontrada.");
        }

        let isAdmin = user.role === 'admin';
        // Verificar que el usuario sea el dueño de la carta o un administrador
        if (!isAdmin) {
            if (card.user.toString() != user._id.toString()) {
                console.log(card.user, user._id);
                throw new Error("El usuario no es el dueño de la carta que intenta retirar de la subasta.");
            }
        }


        // Verificar que la carta esté en subasta
        if (card.status !== CardStatus.OnAuction) {
            throw new Error("La carta no está en subasta.");
        }

        // Verificar que la subasta esté abierta
        if (auction.status as AuctionStatus !== AuctionStatus.Open) {
            throw new Error("La subasta no está abierta.");
        }

        // Actualizar la UserCard para transferirla de nuevo al usuario
        const updatedCard = await UserCard.findOneAndUpdate(
            { _id: userCardId },
            { status: CardStatus.NotForSale },  // Actualizar el estado
            { new: true, session: session }  // Retorna el documento actualizado
        );

        if (!updatedCard) {
            throw new Error("No se pudo retirar la carta de la subasta. La carta no se encontró o ya fue vendida.");
        }


        // Actualizar la subasta
        auction.endDate = new Date();
        auction.finalPrice = 0;
        auction.currentPrice = 0;
        auction.status = AuctionStatus.Cancelled;
        await auction.save({ session });

        // Registrar la transacción de retirada de la subasta
        const withdrawTransaction = new Transaction({
            user: auction.seller,
            username: auction.sellerUsername,
            userCard: userCardId,
            cardId: updatedCard.card,
            legibleCardId: updatedCard.legibleCardId,
            concept: isAdmin ? TransactionConcept.WithdrwanFromAuctionByAdmin : TransactionConcept.WithdrawnFromAuction,
            price: 0,
            date: new Date(),
            auctionId: auctionId,
        });
        await withdrawTransaction.save({ session });

        let notification = new Notification({
            usuarioId: auction.seller,
            username: auction.sellerUsername,
            type: NotificationType.AuctionCancelled,
            message: `La subasta de la carta ${updatedCard._id} ha sido cancelada.`,
            read: false,
            creationDate: new Date(),
            importance: NotificationImportance.High,
            realTime: true

        });

        if (isAdmin) {
            sendNotification(notification);
        }

        // Actualizar las pujas de la subasta a 'Subasta cancelada'
        const bids = await Bid.find({ auction: auctionId });
        for (let i = 0; i < bids.length; i++) {
            if (bids[i].status === BidStatus.Pending) {
                bids[i].status = BidStatus.AuctionCancelled;
                bids[i].endDate = new Date();
                let cancelledBidTransaction = new Transaction({
                    user: bids[i].user,
                    username: bids[i].username,
                    userCard: userCardId,
                    legibleCardId: updatedCard.legibleCardId,
                    concept: TransactionConcept.BidCancelledFromAuction,
                    price: bids[i].price,
                    date: new Date(),
                    auctionId: auctionId,
                    bidId: bids[i]._id
                });
                notification.usuarioId = bids[i].user;
                notification.username = bids[i].username;
                notification.importance = NotificationImportance.Low;
                notification.message = `Tu puja en la subasta de la carta ${updatedCard._id} ha sido cancelada debido a la retirada de la carta de la subasta.`;
                notification.realTime = false;
                sendNotification(notification);
                await cancelledBidTransaction.save({ session });
                await bids[i].save({ session });
            }
        }

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
 * Verifica todas las subastas activas y cierra aquellas que han finalizado, determinando también los ganadores.
 * Esta función recupera todas las subastas con estado 'Open', compara la fecha de finalización con la fecha actual,
 * y cierra las subastas que han finalizado. Además, invoca la función `checkWinnerBid` para cada subasta cerrada
 * con el fin de procesar y determinar el ganador de la subasta.
 * 
 * @param {Request} req - El objeto de solicitud HTTP. No se utiliza directamente en la función.
 * @param {Response} res - El objeto de respuesta HTTP. Se utiliza para enviar una respuesta al cliente.
 * 
 * @returns {Promise<void>} - No retorna ningún valor, pero envía una respuesta HTTP con detalles de las subastas cerradas.
 * 
 * @throws {Error} - Lanza un error con código 500 si se produce un error al verificar las subastas activas.
 */
const checkAllActiveAuctions = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const auctions = await Auction.find({ status: AuctionStatus.Open });
        const now = new Date();

        const updateAuctions = [];
        for (let i = 0; i < auctions.length; i++) {
            if (auctions[i].estimatedEndDate <= now && auctions[i].status === AuctionStatus.Open) {
                auctions[i].status = AuctionStatus.Closed;
                auctions[i].endDate = new Date();
                auctions[i].save({ session });
                await chekWinnerBid(auctions[i], session);
                updateAuctions.push(auctions[i]);
            }
        }

        // Realizar la transacción si todo fue exitoso
        await session.commitTransaction();
        session.endSession();
        res.status(200).json(updateAuctions);

    } catch (error: any) {
        console.error(error);
        throw new Error('No se pudieron verificar las subastas activas.');
    }
}


/**
 * Verifica el ganador de una subasta y procesa la transferencia de la carta al mismo.
 * 
 * Proceso:
 * 1. Obtener todas las pujas para la subasta especificada con estado 'Pending'.
 * 2. Filtrar las pujas para incluir solo aquellas con un precio mayor o igual al precio base.
 * 3. Ordenar las pujas filtradas por precio de manera descendente.
 * 4. Iterar sobre las pujas ordenadas para verificar que el usuario ganador tenga suficiente saldo para comprar la carta.
 * 5. Actualizar el estado de la subasta a 'Closed'.
 * 6. Actualizar el estado de la puja ganadora a 'Won'.
 * 7. Transferir la carta al usuario ganador y registrar la transacción correspondiente.
 * 8. Marcar todas las demás pujas como 'Lost'.
 * 
 * @param {Auction} auction - La subasta a verificar.
 * @param {Session} session - Datos de la sesión actual, utilizados para validar y procesar la transacción.
 * 
 * @returns {Promise<{message: string, updatedCard: Card, saleTransaction: Transaction, purchaseTransaction: Transaction, bid: Bid}>} 
 * - Promesa que resuelve con detalles de la operación, incluyendo mensajes y transacciones.
 * 
 * @throws {Error} - Si no se puede verificar el ganador, si la transferencia de la carta falla, o si la transacción no puede completarse.
 */
const chekWinnerBid = async (auction: IAuction, session: any) => {
    try {
        const bidsIds = auction.bids;
        const basePrice = auction.initialPrice;

        if (bidsIds.length === 0) {
            return;
        }


        // Obtener todas las pujas para la subasta específica y que tengan estado 'Pending'
        const allBids: IBid[] = await Bid.find({ auction: auction._id, status: BidStatus.Pending }).exec();

        // Filtrar las pujas para incluir solo aquellas con un price >= basePrice
        const filteredBids = allBids.filter(bid => bid.price >= basePrice);

        // Ordenar las pujas por precio de manera descendente
        const sortedBids = filteredBids.sort((bidA, bidB) => bidB.price - bidA.price);

        let winnerBid: IBid | null = null;

        let allChecked = false;

        for (let i = 0; i < sortedBids.length && !allChecked; i++) {
            const user = await User.findById(sortedBids[i].user).exec();
            if (user && user.balance >= sortedBids[i].price) {
                auction.currentPrice = sortedBids[i].price;
                winnerBid = sortedBids[i];
                break;
            }

        }

        if (!winnerBid) {
            allChecked = true;
            let notification = new Notification({
                usuarioId: auction.seller,
                username: auction.sellerUsername,
                type: NotificationType.CardNotSold,
                message: `La subasta de la carta ${auction.legibleCardId} no ha tenido ganador, se ha devuelto la carta a su colección.`,
                read: false,
                creationDate: new Date(),
                importance: NotificationImportance.High,
                realTime: false
            });
            sendNotification(notification);
        }

        if (winnerBid) {

            // Marcar las demás pujas como perdidas
            for (let i = 0; i < sortedBids.length; i++) {
                if (allBids[i].status === BidStatus.Pending && allBids[i]._id !== winnerBid?._id) {
                    allBids[i].status = BidStatus.Rejected;
                    allBids[i].endDate = new Date();
                    await allBids[i].save({ session });
                    let notification = new Notification({
                        usuarioId: allBids[i].user,
                        username: allBids[i].username,
                        type: NotificationType.BidRejected,
                        message: `Tu puja en la subasta de la carta ${auction.legibleCardId} ha sido rechazada.`,
                        read: false,
                        creationDate: new Date(),
                        importance: NotificationImportance.Low,
                        realTime: false

                    });
                    sendNotification(notification);
                }
            }

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
 * Transfiere una carta de un usuario vendedor a un usuario comprador, registrando las transacciones de venta y compra.
 * Esta función maneja la lógica completa del proceso de transferencia, incluyendo la verificación de los balances de los usuarios,
 * la actualización de la posesión de la carta, y el registro de las transacciones correspondientes.
 * 
 * Proceso:
 * 1. Verificar que el usuario vendedor exista.
 * 2. Verificar que el usuario comprador exista.
 * 3. Verificar que el comprador tenga suficiente saldo para realizar la compra.
 * 4. Transferir el dinero entre los usuarios.
 * 5. Actualizar la UserCard para transferirla al nuevo usuario.
 * 6. Registrar la transacción de venta.
 * 7. Registrar la transacción de compra.
 * 8. Añadir la referencia a la transacción de compra de la carta.
 * 9. Retornar un mensaje de éxito con los detalles de la operación.
 * 
 * @param {IAuction} auction - Objeto de subasta que contiene información del vendedor, la carta y detalles de la subasta.
 * @param {IBid} bid - Objeto de puja que incluye la identificación del comprador y el precio de la oferta.
 * @param {any} session - Sesión de base de datos para manejar la transacción.
 * 
 * @returns {Promise<{message: string, updatedCard: UserCard, saleTransaction: Transaction, purchaseTransaction: Transaction, bid: IBid}>}
 * Una promesa que resuelve con los detalles de la operación realizada incluyendo mensaje de éxito y los documentos actualizados.
 * 
 * @throws {Error} - Se lanzan errores en los siguientes casos:
 *  - Si alguno de los usuarios (vendedor o comprador) no se encuentra.
 *  - Si el comprador no tiene suficiente saldo para realizar la compra.
 *  - Si la carta no se encuentra o ya ha sido vendida.
 *  - Si no se puede completar la transacción por cualquier otro motivo técnico.
 */
const transferCard = async (auction: IAuction, bid: IBid, session: any) => {
    try {

        const sellerId = auction.seller;
        const sellerUsername = auction.sellerUsername.toLowerCase();
        const buyerId = bid.user;
        const buyerUsername = bid.username.toLowerCase();
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

        if (buyer.balance < salePrice) {
            throw new Error("El comprador no tiene suficiente saldo para comprar la carta.");
        }

        // Transferir el dinero entre los usuarios
        buyer.balance -= salePrice;
        seller.balance += salePrice;

        await buyer.save({ session });
        await seller.save({ session });



        // Actualizar la UserCard para transferirla al nuevo usuario
        const updatedCard = await UserCard.findOneAndUpdate(
            { _id: userCardId },
            { user: buyerId, username: buyerUsername, status: CardStatus.NotForSale },  // Actualizar el usuario y el estado
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
            concept: TransactionConcept.SoldOnAuction,
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
            concept: TransactionConcept.PurchaseByBid,
            price: salePrice,
            date: new Date(),
            auctionId: auctionId,
            bidId: bidId
        });
        await purchaseTransaction.save({ session });

        // Añadir la referencia de la transacción a la carta
        updatedCard.transactionHistory.push(purchaseTransaction._id);
        await updatedCard.save({ session });


        let notificationWinner = new Notification({
            usuarioId: bid.user,
            username: bid.username,
            type: NotificationType.BidWinner,
            message: `¡Felicidades! Has ganado la subasta de la carta ${auction.legibleCardId} con una oferta de ${bid.price} zens.`,
            read: false,
            creationDate: new Date(),
            importance: NotificationImportance.High,
            realTime: true
        });
        sendNotification(notificationWinner);

        let notificationSeller = new Notification({
            usuarioId: auction.seller,
            username: auction.sellerUsername,
            type: NotificationType.CardSold,
            message: `Enhorabuena, la carta ${auction.legibleCardId} ha sido vendida en subasta por ${bid.price} zens.`,
            read: false,
            creationDate: new Date(),
            importance: NotificationImportance.High,
            realTime: true
        });
        sendNotification(notificationSeller);

        return { message: 'La carta se ha transferido al comprador.', updatedCard: updatedCard, saleTransaction: saleTransaction, purchaseTransaction: purchaseTransaction, bid: bid };

    } catch (error: any) {
        // Si algo falla, abortar la transacción y manejar el error
        console.error(error);
        throw new Error('No se pudo completar la transferecia de la carta.');
    }
};


export {
    checkAllActiveAuctions, getActiveAuctions, getActiveAuctionsByUser, getAuction, getAuctions, putUserCardUpForAuction,
    withdrawnUserCardFromAuction
};


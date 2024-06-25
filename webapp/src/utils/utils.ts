import { TransactionConcept } from "../shared/sharedTypes";

export function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Devuelve el mensaje de la transacción
 * @param {TransactionConcept} concept - Concepto de la transacción
 * @returns  {string} - Mensaje de la transacción
 * 
 */
export function getTransactionMessage(concept: TransactionConcept) {
    switch (concept) {
        case TransactionConcept.BidCancelledFromAuction: return 'La puja se ha retirado debido a que la subasta ha sido cancelada.';
        case TransactionConcept.BidWithdrawn: return 'La puja se ha retirado por el usuario.';
        case TransactionConcept.Gift: return 'Carta obtenida como regalo.';
        case TransactionConcept.PurchaseByBid: return 'Carta adquirida al resultar ganador de la subasta.';
        case TransactionConcept.PurchaseByCardPack: return 'Carta adquirida mediante la compra de un sobre.';
        case TransactionConcept.ForSaleOnAuction: return 'La carta se ha puesto a la venta en subasta.';
        case TransactionConcept.NewBid: return 'El usuario ha realizado una nueva puja.';
        case TransactionConcept.SoldOnAuction: return 'La carta ha sido vendida en una subasta.';
        case TransactionConcept.WithdrawnFromAuction: return 'La carta ha sido retirada de la subasta por el usuario.';
        case TransactionConcept.WithdrwanFromAuctionByAdmin: return 'La carta ha sido retirada de la subasta por el administrador.';
        default: return 'Transacción';
    }
}

/**
 * Convierte milisegundos a horas
 * @param {number} milliseconds - Milisegundos
 * @returns {number} - Horas
 */
function millisecondsToHours(milliseconds: number) {
    let hours = milliseconds / 1000 / 60 / 60;
    return Math.round(hours);
}

/**
 * Devuelve el tiempo restante en horas para una subasta
 * @param {Date} date - Fecha de finalización de la subasta
 * @returns  {number} - Tiempo restante en horas
 */
export function calculateRemainingTime(date: Date) {
    const now = new Date();
    const endDate = new Date(date);
    const diff = endDate.getTime() - now.getTime();
    return millisecondsToHours(diff);
}
import { TransactionConcept } from "../shared/sharedTypes";

export function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Devuelve el mensaje de la transacción
 * @param {TransactionConcept} concept - Concepto de la transacción
 * @returns  {string} - Mensaje de la transacción
 */
export function getTransactionMessage(concept: TransactionConcept) {
    switch (concept) {
        case TransactionConcept.BidCancelledFromAuction: return 'La puja se ha retirado debido a que la subasta ha sido cancelada.';
        case TransactionConcept.BidWithdrawn: return 'La puja se ha retirado.';
        case TransactionConcept.Gift: return 'Carta regalada';
        case TransactionConcept.PurchaseByBid: return 'Carta adquirida mediante puja';
        case TransactionConcept.PurchaseByCardPack: return 'Carta adquirida mediante sobre';
        case TransactionConcept.ForSaleOnAuction: return 'Carta en subasta';
        case TransactionConcept.NewBid: return 'Nueva puja';
        case TransactionConcept.SoldOnAuction: return 'Carta vendida en subasta';
        case TransactionConcept.WithdrawnFromAuction: return 'Carta retirada de la subasta';
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
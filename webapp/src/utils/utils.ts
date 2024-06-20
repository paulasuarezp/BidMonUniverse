import { TransactionConcept } from "../shared/sharedTypes";

export function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

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
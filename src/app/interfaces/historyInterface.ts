export interface TradeHistory {
    ticket: number;
    order: number;
    time: number;
    type: number;
    entry: number;
    position_id: number;
    reason: number;
    volume: number;
    currentPrice: number;
    sl: number;
    tp: number;
    commission: number;
    swap: number;
    profit: number;
    fee: number;
    symbol: string;
    comment: string;
}

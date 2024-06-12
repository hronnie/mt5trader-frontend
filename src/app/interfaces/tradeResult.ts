// TradeResult.ts

export interface TradeResult {
    executionDate: string; // ISO 8601 string format
    volume: number;
    entryPrice: number;
    comment: string;
    symbol: string;
    slPrice: number;
    tpPrice: number;
    moneyAtRisk: number;
    tpPipValue: number;
    slPipValue: number;
    spread: number;
}

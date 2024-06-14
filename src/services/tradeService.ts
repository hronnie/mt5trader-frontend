// tradeService.ts

import axios from 'axios';
import { TradeResult } from './TradeResult';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const tradeService = {
    createLongOrder: async (symbol: string, slPrice: number, tpPrice: number, entryPrice: number, ratio: number, spread: number, risk: number): Promise<TradeResult> => {
        try {
            const response = await axios.post<TradeResult>(`${API_BASE_URL}/trade/long/${symbol}`, {
                slPrice,
                tpPrice,
                entryPrice,
                ratio,
                spread,
                risk
            });
            return response.data;
        } catch (error) {
            console.error('Error creating long order', error);
            throw error;
        }
    },

    createShortOrder: async (symbol: string, slPrice: number, tpPrice: number, entryPrice: number, ratio: number, spread: number, risk: number): Promise<TradeResult> => {
        try {
            const response = await axios.post<TradeResult>(`${API_BASE_URL}/trade/short/${symbol}`, {
                slPrice,
                tpPrice,
                entryPrice,
                ratio,
                spread,
                risk
            });
            return response.data;
        } catch (error) {
            console.error('Error creating short order', error);
            throw error;
        }
    }
};

export default tradeService;

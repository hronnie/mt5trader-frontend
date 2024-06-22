import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getSymbolInfo = async (symbol: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/symbol-news/${symbol}`);
        // @ts-ignore
        const sortedData = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        return sortedData;
    } catch (error) {
        console.error('Error fetching info', error);
        throw error;
    }
};

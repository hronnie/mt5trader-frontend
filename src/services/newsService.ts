import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';


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

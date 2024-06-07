import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const getPriceInfo = async (symbol: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/price/${symbol}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching info', error);
        throw error;
    }
};


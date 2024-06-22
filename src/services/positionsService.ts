import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const getPositions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/position/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching info', error);
        throw error;
    }
};


export const closePositions = async (ticket: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/position/close/${ticket}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching info', error);
        throw error;
    }
};

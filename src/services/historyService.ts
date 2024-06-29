import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const getAllHistoryService = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/history/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching info', error);
        throw error;
    }
};

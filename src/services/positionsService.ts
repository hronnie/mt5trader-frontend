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
        console.error('Error closing position', error);
        throw error;
    }
};

export const modifyPositions = async (ticket: number, sl: number, tp: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/position/modify/${ticket}`, {sl, tp});
        return response.data;
    } catch (error) {
        console.error('Error modifying position', error);
        throw error;
    }
};

export const breakEvenPositions = async (ticket: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/position/breakeven/${ticket}`);
        return response.data;
    } catch (error) {
        console.error('Error modifying position', error);
        throw error;
    }
};


export const hedgePositions = async (ticket: number, sl: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/position/hedge/${ticket}`, {sl});
        return response.data;
    } catch (error) {
        console.error('Error hedging position', error);
        throw error;
    }
};


export const flipPositions = async (ticket: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/position/flip/${ticket}`);
        return response.data;
    } catch (error) {
        console.error('Error flipping position', error);
        throw error;
    }
};

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const getPositionsService = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/position/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching info', error);
        throw error;
    }
};


export const closePositionsService = async (ticket: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/position/close/${ticket}`);
        return response.data;
    } catch (error) {
        console.error('Error closing position', error);
        throw error;
    }
};

export const modifyPositionsService = async (ticket: number, sl: number, tp: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/position/modify/${ticket}`, {sl, tp});
        return response.data;
    } catch (error) {
        console.error('Error modifying position', error);
        throw error;
    }
};

export const breakEvenPositionService = async (ticket: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/position/breakeven/${ticket}`);
        return response.data;
    } catch (error) {
        console.error('Error modifying position', error);
        throw error;
    }
};


export const hedgePositionService = async (ticket: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/position/hedge/${ticket}`);
        return response.data;
    } catch (error) {
        console.error('Error hedging position', error);
        throw error;
    }
};


export const flipPositionService = async (ticket: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/position/flip/${ticket}`);
        return response.data;
    } catch (error) {
        console.error('Error flipping position', error);
        throw error;
    }
};

export const closeAllPositionService = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/position/closeall`);
        return response.data;
    } catch (error) {
        console.error('Error closing all position', error);
        throw error;
    }
};

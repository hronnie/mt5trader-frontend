export const formatNumber = (num: number, digits = 5) => {
    if (!num) {
        return 0;
    }
    return parseFloat(num.toFixed(digits));
}

export const formatTime = (timestamp: number) => {
    const dateObject = new Date(timestamp * 1000);

    // Format the date
    return dateObject.toLocaleString();
}

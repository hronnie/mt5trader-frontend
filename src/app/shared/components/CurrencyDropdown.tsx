import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const currencies = [
    "EURUSD", "GBPUSD", "EURGBP", "USDJPY", "USDCAD",
    "USDCHF", "AUDUSD", "GBPJPY", "AUDJPY", "NZDUSD"
];

interface CurrencyDropdownProps {
    onCurrencySelect: (currency: string) => void;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({ onCurrencySelect }) => {
    const [selectedCurrency, setSelectedCurrency] = useState<string>("");

    const handleSelect = (selectedCurrency: string | null) => {
        if (selectedCurrency) {
            onCurrencySelect(selectedCurrency)
            setSelectedCurrency(selectedCurrency);
            console.log(`Selected currency: ${selectedCurrency}`);
        }
    };

    return (
        <DropdownButton
            id="currency-dropdown"
            title={selectedCurrency || "Select a Currency"}
            onSelect={handleSelect}
        >
            {currencies.map((currency) => (
                <Dropdown.Item key={currency} eventKey={currency}>
                    {currency}
                </Dropdown.Item>
            ))}
        </DropdownButton>
    );
};

export default CurrencyDropdown;

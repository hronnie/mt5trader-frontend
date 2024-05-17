"use client"
import React, {useState} from 'react';
import CurrencyDropdown from "@/app/shared/components/CurrencyDropdown";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Form } from 'react-bootstrap';
import NumberInput from "@/app/shared/components/NumberInput";

const Trade: React.FC = () => {
    const [selectedCurrency, setSelectedCurrency] = useState<string>("");
    const [numberValue, setNumberValue] = useState<number>(0);

    const handleCurrencySelect = (currency: string) => {
        setSelectedCurrency(currency);
        console.log(`Parent component received selected currency: ${currency}`);
    };

    const handleNumberChange = (value: number) => {
        setNumberValue(value);
        console.log(`Parent component received number value: ${value}`);
    };

    return (
        <div>
            <h1>Trade</h1>
            <Card style={{ width: '18rem' }}>
                <Card.Title>Choose currency</Card.Title>
                <Card.Body>
                    <CurrencyDropdown onCurrencySelect={handleCurrencySelect}/>
                    <NumberInput value={numberValue} onChange={handleNumberChange} />
                </Card.Body>
            </Card>
        </div>
    );
};

export default Trade;

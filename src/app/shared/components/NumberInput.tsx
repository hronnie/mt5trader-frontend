import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange }) => {
    const [inputValue, setInputValue] = useState<string>(value.toString());

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        if (newValue === "" || newValue === "-") {
            onChange(0);
        } else if (!isNaN(parseFloat(newValue))) {
            onChange(parseFloat(newValue));
        }
    };

    return (
        <Form.Group controlId="formNumberInput">
            <Form.Label>Number Input</Form.Label>
            <Form.Control
                type="number"
                value={inputValue}
                onChange={handleChange}
                step="any" // Allows for decimal input
            />
        </Form.Group>
    );
};

export default NumberInput;

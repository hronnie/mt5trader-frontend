'use client'

import {CCard, CCardBody, CCardTitle} from "@coreui/react-pro";
import React from "react";

interface SymbolCardProps {
    symbolName: string;
    isSelected: boolean;
    onSelect: () => void;
}

const SymbolCard: React.FC<SymbolCardProps> = ({symbolName, isSelected, onSelect}) => {
    return (
        <CCard
            style={{
                width: '10rem',
                height: '3.5rem',
                backgroundColor: isSelected ? '#d0e1ff' : '#f3f4f7',
                border: isSelected ? '2px solid #0056b3' : '1px solid #ccc',
                cursor: 'pointer',
                textAlign: 'center'
            }}
            onClick={onSelect}
        >
            <CCardBody>
                <CCardTitle>{symbolName}</CCardTitle>
            </CCardBody>
        </CCard>
    );
};

export default SymbolCard;

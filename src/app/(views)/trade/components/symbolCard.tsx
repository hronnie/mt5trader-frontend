import { CCard, CCardBody, CCardTitle } from "@coreui/react-pro";
import React from "react";

interface SymbolCardProps {
    symbolName: string;
    isSelected: boolean;
    onSelect: () => void;
}

const SymbolCard: React.FC<SymbolCardProps> = ({ symbolName, isSelected, onSelect }) => {
    return (
        <CCard
            style={{
                width: '18rem',
                backgroundColor: isSelected ? '#d0e1ff' : 'white', // change background color if selected
                border: isSelected ? '2px solid #0056b3' : '1px solid #ccc', // deeper blue border if selected
                cursor: 'pointer', // change cursor to pointer
                textAlign: 'center' // center align the text
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

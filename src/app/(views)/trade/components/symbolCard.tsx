import {CButton, CCard, CCardBody, CCardText, CCardTitle} from "@coreui/react-pro";
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
                backgroundColor: isSelected ? '#d0e1ff' : 'white' // change background color if selected
            }}
            onClick={onSelect}
        >
            <CCardBody>
                <CCardTitle>{symbolName}</CCardTitle>
                <CButton color="primary" href="#">
                    Select
                </CButton>
            </CCardBody>
        </CCard>
    );
};

export default SymbolCard;

import {CButton, CCard, CCardBody, CCardText, CCardTitle} from "@coreui/react-pro";
import React from "react";

interface SymbolCardProps {
    symbolName: string;
    bidPrice: number;
    askPrice: number;
    currentSpread: number;
}

const SymbolCard: React.FC<SymbolCardProps> = ({ symbolName, bidPrice, askPrice, currentSpread }) => {
    return (
        <CCard style={{ width: '18rem' }}>
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

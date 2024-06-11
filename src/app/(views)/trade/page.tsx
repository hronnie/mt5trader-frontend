'use client'

import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
    CCardGroup,
    CCardHeader,
    CCardImage,
    CCardLink,
    CCardSubtitle,
    CCardText,
    CCardTitle,
    CCol,
    CListGroup,
    CListGroupItem,
    CNav,
    CNavItem,
    CNavLink,
    CRow,
    CToast,
    CToastBody,
} from '@coreui/react-pro';
import { DocsExample } from '@/components';

import ReactImg from '@/public/images/react.jpg';
import React, { useEffect, useRef, useState } from "react";
import { SETTINGS_LOCAL_STORAGE } from "@/app/common/constants";
import SymbolCard from "@/app/(views)/trade/components/symbolCard";
import SymbolInfoCard from "@/app/(views)/trade/components/symbolInfoCard";
import ExecuteTradeCard from "@/app/(views)/trade/components/executeTradeCard";
import Link from "next/link";

const Trade = () => {
    const [formData, setFormData] = useState(null);
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [toast, addToast] = useState(0);
    const toaster = useRef();
    const settingSuccessToast = (
        <CToast color="success">
            <CToastBody>You successfully saved your settings!</CToastBody>
        </CToast>
    );

    useEffect(() => {
        const savedFormData = localStorage.getItem(SETTINGS_LOCAL_STORAGE);
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }
    }, []);

    const handleSymbolSelect = (symbol) => {
        setSelectedSymbol(symbol);
    };

    const renderSymbols = (symbols) => {
        return Object.keys(symbols).map((key) => (
            symbols[key].enabled && (
                <CCol xs={12} sm={6} md={5} lg={2} key={key} style={{marginTop: "15px"}}>
                    <SymbolCard
                        symbolName={key}
                        isSelected={selectedSymbol === key}
                        onSelect={() => handleSymbolSelect(key)}
                    />
                </CCol>
            )
        ));
    };

    const isSymbolArrayEmpty = (symbolArray) => {
        if (!symbolArray || Object.keys(symbolArray).length === 0) {
            return true;
        }
        return !Object.values(symbolArray).some(symbol => symbol?.enabled);
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Select a Symbol</strong>
                    </CCardHeader>
                    <CCardBody>
                        {!isSymbolArrayEmpty(formData?.forex) && (
                            <>
                                <h5>Forex symbols:</h5>
                                <CRow>
                                    {renderSymbols(formData.forex)}
                                </CRow>
                            </>
                        )}

                        {!isSymbolArrayEmpty(formData?.indices) && (
                            <>
                                <h5 style={{marginTop: "15px"}}>Indices symbols:</h5>
                                <CRow>
                                    {renderSymbols(formData.indices)}
                                </CRow>
                            </>
                        )}

                        {!isSymbolArrayEmpty(formData?.commodities) && (
                            <>
                                <h5 style={{marginTop: "15px"}}>Commodities symbols:</h5>
                                <CRow>
                                    {renderSymbols(formData.commodities)}
                                </CRow>
                            </>
                        )}

                        {isSymbolArrayEmpty(formData?.forex) &&
                            isSymbolArrayEmpty(formData?.indices) &&
                            isSymbolArrayEmpty(formData?.commodities) && (
                                <CCol>
                                    <CCardText>
                                        <CAlert color="danger">
                                            Please add at least one symbol in the <Link href="/settings">settings page</Link>.
                                        </CAlert>
                                    </CCardText>
                                </CCol>
                            )}
                    </CCardBody>
                </CCard>
            </CCol>
            {selectedSymbol && <CCol xs={12}>
                <SymbolInfoCard symbolName={selectedSymbol} />
            </CCol>}
            {selectedSymbol && <CCol xs={12}>
                <ExecuteTradeCard symbolName={selectedSymbol} />
            </CCol>}
        </CRow>
    );
};

export default Trade;

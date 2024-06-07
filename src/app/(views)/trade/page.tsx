'use client'

import {
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

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Select a Symbol</strong>
                    </CCardHeader>
                    <CCardBody>
                        <h5>Forex symbols: </h5>
                        <CRow>
                            {formData?.forex ? (
                                Object.keys(formData.forex).map((key) => (
                                    formData.forex[key].enabled && (
                                        <CCol xs={12} sm={6} md={5} lg={2} key={key} style={{marginTop: "15px"}}>
                                            <SymbolCard
                                                symbolName={key}
                                                isSelected={selectedSymbol === key}
                                                onSelect={() => handleSymbolSelect(key)}

                                            />
                                        </CCol>
                                    )
                                ))
                            ) : (
                                <CCol>
                                    <CCardText>Please add symbols in the Settings page</CCardText>
                                </CCol>
                            )}
                        </CRow>
                        <h5 style={{marginTop: "15px"}}>Indices symbols: </h5>
                        <CRow>
                            {formData?.indices ? (
                                Object.keys(formData.indices).map((key) => (
                                    formData.indices[key].enabled && (
                                        <CCol xs={12} sm={6} md={4} lg={2} key={key} style={{marginTop: "15px"}}>
                                            <SymbolCard
                                                symbolName={key}
                                                isSelected={selectedSymbol === key}
                                                onSelect={() => handleSymbolSelect(key)}
                                            />
                                        </CCol>
                                    )
                                ))
                            ) : (
                                <CCol>
                                    <CCardText>Please add symbols in the Settings page</CCardText>
                                </CCol>
                            )}
                        </CRow>
                        <h5 style={{marginTop: "15px"}}>Commodities symbols: </h5>
                        <CRow>
                            {formData?.commodities ? (
                                Object.keys(formData.commodities).map((key) => (
                                    formData.commodities[key].enabled && (
                                        <CCol xs={12} sm={6} md={4} lg={2} key={key} style={{marginTop: "15px"}}>
                                            <SymbolCard
                                                symbolName={key}
                                                isSelected={selectedSymbol === key}
                                                onSelect={() => handleSymbolSelect(key)}
                                            />
                                        </CCol>
                                    )
                                ))
                            ) : (
                                <CCol>
                                    <CCardText>Please add symbols in the Settings page</CCardText>
                                </CCol>
                            )}
                        </CRow>
                    </CCardBody>
                </CCard>
            </CCol>
            {selectedSymbol && <CCol xs={12}>
                <SymbolInfoCard symbolName={selectedSymbol}/>
            </CCol>}
            {/*<CCol xs={12}>*/}
            {/*    <CCard className="mb-4">*/}
            {/*        <CCardHeader>*/}
            {/*            <strong>Card title</strong>*/}
            {/*        </CCardHeader>*/}
            {/*        <CCardBody>*/}
            {/*            card body*/}
            {/*        </CCardBody>*/}
            {/*    </CCard>*/}
            {/*</CCol>*/}
        </CRow>
    );
};

export default Trade;

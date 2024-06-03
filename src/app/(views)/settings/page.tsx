'use client'

import React, {useState, useEffect, useRef} from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormCheck,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CListGroup,
    CListGroupItem,
    CRow, CToast, CToastBody, CToaster, CToastHeader
} from '@coreui/react-pro'
import styles from './settings.module.css';
import { SETTINGS_LOCAL_STORAGE } from '@/app/common/constants';

const defaultFormData = {
    forex: {
        EURUSD: true,
        GBPUSD: true,
        USDJPY: false,
        USDCAD: false,
        USDCHF: false,
        AUDUSD: false,
        GBPJPY: false,
        AUDJPY: false,
        NZDUSD: false,
    },
    indices: {
        US30: false,
        US100: false,
        US500: false,
        US2000: false,
        GER40: false,
        UK100: false,
        EU50: false,
        JP225: false,
        HK50: false,
        AUS200: false,
    },
    commodities: {
        XAUUSD: false,
        XAGUSD: false,
        XPDUSD: false,
        XPTUSD: false,
        USOIL: false,
        UKOIL: false,
        COCOA: false,
        COFFEE: false,
        SOYBEAN: false,
        WHEAT: false,
    },
    risk: 1,
    spread: 1
};

export default function Settings() {
    const [formData, setFormData] = useState(defaultFormData);
    const [toast, addToast] = useState(0)
    const toaster = useRef();
    const settingSuccessToast = (
        <CToast color="success">

            <CToastBody>You successfully saved your settings!</CToastBody>
        </CToast>
    )

    useEffect(() => {
        const savedFormData = localStorage.getItem(SETTINGS_LOCAL_STORAGE);
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }
    }, []);

    const handleChange = (category: string, name: string) => (event: { target: { type: string; checked: any; value: any; }; }) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setFormData((prevFormData) => {
            if (category === 'risk' || category === 'spread') {
                return {
                    ...prevFormData,
                    [category]: value
                };
            } else {
                return {
                    ...prevFormData,
                    [category]: {
                        ...prevFormData[category],
                        [name]: value
                    }
                };
            }
        });
    };

    const handleSave = () => {
        localStorage.setItem(SETTINGS_LOCAL_STORAGE, JSON.stringify(formData));
        addToast(settingSuccessToast);
    };

    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>
                    Available Symbols
                </CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol>
                            <h4>Forex</h4>
                            <CListGroup>
                                {Object.keys(formData.forex).map((key) => (
                                    <CListGroupItem key={key}>
                                        <CFormCheck
                                            label={key}
                                            checked={formData.forex[key]}
                                            onChange={handleChange('forex', key)}
                                        />
                                    </CListGroupItem>
                                ))}
                            </CListGroup>
                        </CCol>
                        <CCol>
                            <CListGroup>
                                <h4>Indices</h4>
                                {Object.keys(formData.indices).map((key) => (
                                    <CListGroupItem key={key}>
                                        <CFormCheck
                                            label={key}
                                            checked={formData.indices[key]}
                                            onChange={handleChange('indices', key)}
                                        />
                                    </CListGroupItem>
                                ))}
                            </CListGroup>
                        </CCol>
                        <CCol>
                            <CListGroup>
                                <h4>Commodities</h4>
                                {Object.keys(formData.commodities).map((key) => (
                                    <CListGroupItem key={key}>
                                        <CFormCheck
                                            label={key}
                                            checked={formData.commodities[key]}
                                            onChange={handleChange('commodities', key)}
                                        />
                                    </CListGroupItem>
                                ))}
                            </CListGroup>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
            <CCard className="mb-4">
                <CCardHeader>
                    Risk
                </CCardHeader>
                <CCardBody>
                    <CInputGroup className={styles.settingInput}>
                        <CFormInput
                            aria-label="Dollar amount (with dot and two decimal places)"
                            value={formData.risk}
                            onChange={handleChange('risk', 'risk')}
                        />
                        <CInputGroupText>%</CInputGroupText>
                    </CInputGroup>
                </CCardBody>
            </CCard>
            <CCard className="mb-4">
                <CCardHeader>
                    Maximum spread
                </CCardHeader>
                <CCardBody>
                    <CInputGroup className={styles.settingInput}>
                        <CFormInput
                            aria-label="Dollar amount (with dot and two decimal places)"
                            value={formData.spread}
                            onChange={handleChange('spread', 'spread')}
                        />
                        <CInputGroupText>%</CInputGroupText>
                    </CInputGroup>
                </CCardBody>
            </CCard>
            <CButton
                color="primary"
                variant="outline"
                className={styles.saveButton}
                onClick={handleSave}
            >
                Save
            </CButton>
            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        </>
    )
}

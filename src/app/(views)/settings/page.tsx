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
        EURUSD: { enabled: true, leverage: 100 },
        GBPUSD: { enabled: true, leverage: 100 },
        USDJPY: { enabled: false, leverage: 100 },
        USDCAD: { enabled: false, leverage: 100 },
        USDCHF: { enabled: false, leverage: 100 },
        AUDUSD: { enabled: false, leverage: 100 },
        GBPJPY: { enabled: false, leverage: 100 },
        AUDJPY: { enabled: false, leverage: 100 },
        NZDUSD: { enabled: false, leverage: 100 },
    },
    indices: {
        US30: { enabled: false, leverage: 100 },
        US100: { enabled: false, leverage: 100 },
        US500: { enabled: false, leverage: 100 },
        US2000: { enabled: false, leverage: 100 },
        GER40: { enabled: false, leverage: 100 },
        UK100: { enabled: false, leverage: 100 },
        EU50: { enabled: false, leverage: 100 },
        JP225: { enabled: false, leverage: 100 },
        HK50: { enabled: false, leverage: 100 },
        AUS200: { enabled: false, leverage: 100 },
    },
    commodities: {
        XAUUSD: { enabled: false, leverage: 100 },
        XAGUSD: { enabled: false, leverage: 100 },
        XPDUSD: { enabled: false, leverage: 100 },
        XPTUSD: { enabled: false, leverage: 100 },
        USOIL: { enabled: false, leverage: 100 },
        UKOIL: { enabled: false, leverage: 100 },
        COCOA: { enabled: false, leverage: 100 },
        COFFEE: { enabled: false, leverage: 100 },
        SOYBEAN: { enabled: false, leverage: 100 },
        WHEAT: { enabled: false, leverage: 100 },
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

    const handleChange = (category: string, name: string) => (event: { target: { type: string; checked: any; value: any; name: string; }; }) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const field = event.target.name;
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
                        [name]: {
                            ...prevFormData[category][name],
                            [field]: value
                        }
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
                            <CRow>
                                <CCol>
                                    Symbol
                                </CCol>
                                <CCol>
                                    Leverage
                                </CCol>
                            </CRow>
                            <CListGroup>
                                {Object.keys(formData.forex).map((key) => (
                                    <CListGroupItem key={key}>
                                        <CRow>
                                            <CCol>
                                                <CFormCheck
                                                    label={key}
                                                    checked={formData.forex[key].enabled}
                                                    onChange={handleChange('forex', key)}
                                                    name="enabled"
                                                />
                                            </CCol>
                                            <CCol>
                                                 <CFormInput
                                                    type="number"
                                                    value={formData.forex[key].leverage}
                                                    onChange={handleChange('forex', key)}
                                                    name="leverage"
                                                    className={styles.leverageInput}
                                                />
                                            </CCol>
                                        </CRow>
                                    </CListGroupItem>
                                ))}
                            </CListGroup>
                        </CCol>
                        <CCol>
                            <h4>Indices</h4>
                            <CRow>
                                <CCol>
                                    Symbol
                                </CCol>
                                <CCol>
                                    Leverage
                                </CCol>
                            </CRow>
                            <CListGroup>
                                {Object.keys(formData.indices).map((key) => (
                                    <CListGroupItem key={key}>
                                        <CRow>
                                            <CCol>
                                                <CFormCheck
                                                    label={key}
                                                    checked={formData.indices[key].enabled}
                                                    onChange={handleChange('indices', key)}
                                                    name="enabled"
                                                />
                                            </CCol>
                                            <CCol>
                                                <CFormInput
                                                    type="number"
                                                    value={formData.indices[key].leverage}
                                                    onChange={handleChange('indices', key)}
                                                    name="leverage"
                                                    className={styles.leverageInput}
                                                />
                                            </CCol>
                                        </CRow>
                                    </CListGroupItem>
                                ))}
                            </CListGroup>
                        </CCol>
                        <CCol>
                            <h4>Commodities</h4>
                            <CRow>
                                <CCol>
                                    Symbol
                                </CCol>
                                <CCol>
                                    Leverage
                                </CCol>
                            </CRow>
                            <CListGroup>
                                {Object.keys(formData.commodities).map((key) => (
                                    <CListGroupItem key={key}>
                                        <CRow>
                                            <CCol>
                                                <CFormCheck
                                                    label={key}
                                                    checked={formData.commodities[key].enabled}
                                                    onChange={handleChange('commodities', key)}
                                                    name="enabled"
                                                />
                                            </CCol>
                                            <CCol>
                                                <CFormInput
                                                    type="number"
                                                    value={formData.commodities[key].leverage}
                                                    onChange={handleChange('commodities', key)}
                                                    name="leverage"
                                                    className={styles.leverageInput}
                                                />
                                            </CCol>
                                        </CRow>
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

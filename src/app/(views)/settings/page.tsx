'use client'

import React, {useEffect, useRef, useState} from 'react'
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
    CRow,
    CToast,
    CToastBody,
    CToaster
} from '@coreui/react-pro'
import styles from './settings.module.css';
import {SETTINGS_LOCAL_STORAGE} from '@/app/common/constants';

const defaultFormData = {
    forex: {
        EURUSD: {enabled: true, leverage: 100, error: '', pipSize: 0.0001},
        GBPUSD: {enabled: true, leverage: 100, error: '', pipSize: 0.0001},
        USDJPY: {enabled: false, leverage: 100, error: '', pipSize: 0.01},
        USDCAD: {enabled: false, leverage: 100, error: '', pipSize: 0.0001},
        USDCHF: {enabled: false, leverage: 100, error: '', pipSize: 0.0001},
        AUDUSD: {enabled: false, leverage: 100, error: '', pipSize: 0.0001},
        GBPJPY: {enabled: false, leverage: 100, error: '', pipSize: 0.01},
        AUDJPY: {enabled: false, leverage: 100, error: '', pipSize: 0.01},
        NZDUSD: {enabled: false, leverage: 100, error: '', pipSize: 0.0001},
    },
    indices: {
        US30: {enabled: false, leverage: 100, error: '', pipSize: 1},
        US100: {enabled: false, leverage: 100, error: '', pipSize: 0.25},
        US500: {enabled: false, leverage: 100, error: '', pipSize: 0.25},
        US2000: {enabled: false, leverage: 100, error: '', pipSize: 0.1},
        GER40: {enabled: false, leverage: 100, error: '', pipSize: 0.5},
        UK100: {enabled: false, leverage: 100, error: '', pipSize: 0.5},
        EU50: {enabled: false, leverage: 100, error: '', pipSize: 1},
        JP225: {enabled: false, leverage: 100, error: '', pipSize: 1},
        HK50: {enabled: false, leverage: 100, error: '', pipSize: 1},
        AUS200: {enabled: false, leverage: 100, error: '', pipSize: 1},
    },
    commodities: {
        XAUUSD: {enabled: false, leverage: 100, error: '', pipSize: 0.1},
        XAGUSD: {enabled: false, leverage: 100, error: '', pipSize: 0.01},
        XPDUSD: {enabled: false, leverage: 100, error: '', pipSize: 0.01},
        XPTUSD: {enabled: false, leverage: 100, error: '', pipSize: 0.01},
        USOIL: {enabled: false, leverage: 100, error: '', pipSize: 0.01},
        UKOIL: {enabled: false, leverage: 100, error: '', pipSize: 0.01},
        COCOA: {enabled: false, leverage: 100, error: '', pipSize: 1},
        COFFEE: {enabled: false, leverage: 100, error: '', pipSize: 0.01},
        SOYBEAN: {enabled: false, leverage: 100, error: '', pipSize: 0.25},
        WHEAT: {enabled: false, leverage: 100, error: '', pipSize: 0.25},
    },
    risk: 1,
    spread: 1,
    ratio: 3
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
        // localStorage.setItem(SETTINGS_LOCAL_STORAGE, JSON.stringify(defaultFormData));
        const savedFormData = localStorage.getItem(SETTINGS_LOCAL_STORAGE);
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }
    }, []);

    const handleChange = (category: string, name: string) => (event: {
        target: { type: string; checked: any; value: any; name: string; };
    }) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const field = event.target.name;
        setFormData((prevFormData) => {
            if (category === 'risk' || category === 'spread' || category === 'ratio') {
                return {
                    ...prevFormData,
                    [category]: value
                };
            }
            const updatedCategory = {
                ...prevFormData[category],
                [name]: {
                    ...prevFormData[category][name],
                    [field]: value,
                    error: field === 'enabled' && value && !prevFormData[category][name].leverage ? 'Leverage cannot be empty' : ''
                }
            };
            return {
                ...prevFormData,
                [category]: updatedCategory
            };
        });
    };

    const handleSave = () => {
        const updatedFormData = {...formData};
        Object.keys(updatedFormData).forEach(category => {
            Object.keys(updatedFormData[category]).forEach(symbol => {
                if (updatedFormData[category][symbol].enabled && !updatedFormData[category][symbol].leverage) {
                    updatedFormData[category][symbol].error = 'Leverage cannot be empty';
                }
            });
        });
        setFormData(updatedFormData);

        const hasErrors = Object.keys(updatedFormData).some(category =>
            Object.keys(updatedFormData[category]).some(symbol => updatedFormData[category][symbol].error)
        );

        if (!hasErrors) {
            localStorage.setItem(SETTINGS_LOCAL_STORAGE, JSON.stringify(formData));
            addToast(settingSuccessToast);
        }
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
                                                {formData.forex[key].error && (
                                                    <div className={styles.error}>{formData.forex[key].error}</div>
                                                )}
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
                                                {formData.indices[key].error && (
                                                    <div className={styles.error}>{formData.indices[key].error}</div>
                                                )}
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
                                                {formData.commodities[key].error && (
                                                    <div
                                                        className={styles.error}>{formData.commodities[key].error}</div>
                                                )}
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
            <CCard className="mb-4">
                <CCardHeader>
                    Ratio
                </CCardHeader>
                <CCardBody>
                    <CInputGroup className={styles.settingInput}>
                        <CInputGroupText>1:</CInputGroupText>
                        <CFormInput
                            value={formData.ratio}
                            onChange={handleChange('ratio', 'ratio')}
                        />
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
            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster}/>
        </>
    )
}

import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCardText,
    CCardTitle,
    CCol,
    CFormInput,
    CFormSwitch,
    CListGroupItem,
    CRow
} from "@coreui/react-pro";
import React, { useEffect, useState } from "react";
import styles from "@/app/(views)/settings/settings.module.css";
import { getPriceInfo } from "@/services/priceService";
import { Price } from "@/app/interfaces/priceInterface";

interface ExecuteTradeCardProps {
    symbolName: string;
}

const ExecuteTradeCard: React.FC<ExecuteTradeCardProps> = ({ symbolName }) => {
    const [slPrice, setSlPrice] = useState(0);
    const [tpPrice, setTpPrice] = useState(0);
    const [entryPrice, setEntryPrice] = useState(0);
    const [tpEnabled, setTpEnabled] = useState(false);
    const [entryEnabled, setEntryEnabled] = useState(false);
    const [priceData, setPriceData] = useState<Price | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const priceResult = await getPriceInfo(symbolName);
            setPriceData(priceResult);
            setSlPrice(priceResult.askPrice);
            setEntryPrice(priceResult.askPrice);
            setTpPrice(priceResult.askPrice);
        };

        fetchData();
    }, [symbolName]);

    const handleChange = (setter) => (event) => {
        const price = parseFloat(event.target.value);
        setter(price);
    }

    const handleToggleChange = (setter) => (event) => {
        const checked = event.target.checked;
        setter(checked);
    }

    const isPriceFilledCorrectly = () => {
        return !priceData
            || priceData?.askPrice === slPrice
            || ((tpPrice === 0 || tpPrice === priceData?.askPrice) && tpEnabled)
            || ((entryPrice === 0) && entryEnabled) ;
    }

    const isShortDisabled = () => {
        if (isPriceFilledCorrectly()
            || (tpEnabled && tpPrice > priceData?.askPrice)
            || slPrice < entryPrice) {
            return true;
        }
        return false;
    }

    const isLongDisabled = () => {
        if (isPriceFilledCorrectly()
            || (tpEnabled && tpPrice < priceData?.askPrice)
            || slPrice > entryPrice) {
            return true;
        }
        return false;
    }

    return (
        <CCard>
            <CCardHeader>Execute trade for {symbolName}</CCardHeader>
            <CCardBody>
                <CCardTitle style={{ marginBottom: "20px" }}>Select entry parameters</CCardTitle>
                <CListGroupItem>
                    <CRow className="mb-3">
                        <CCol xs="auto">
                            <div>Sl Price</div>
                        </CCol>
                        <CCol xs="auto">
                            <CFormInput
                                type="number"
                                step={0.0001}
                                value={slPrice}
                                onChange={handleChange(setSlPrice)}
                                className={styles.leverageInput}
                                style={{ maxWidth: '150px' }}
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3 align-items-center">
                        <CCol xs="auto">
                            <CFormSwitch label="Take Profit" id="tpSwitch" onChange={handleToggleChange(setTpEnabled)} />
                        </CCol>
                        {tpEnabled && (
                            <CCol xs="auto">
                                <CFormInput
                                    type="number"
                                    value={tpPrice}
                                    step={0.0001}
                                    onChange={handleChange(setTpPrice)}
                                    className={styles.leverageInput}
                                    style={{ maxWidth: '150px' }}
                                />
                            </CCol>
                        )}
                    </CRow>
                    <CRow className="mb-3 align-items-center">
                        <CCol xs="auto">
                            <CFormSwitch label="Entry Price" id="entrySwitch" onChange={handleToggleChange(setEntryEnabled)} />
                        </CCol>
                        {entryEnabled && (
                            <CCol xs="auto">
                                <CFormInput
                                    type="number"
                                    value={entryPrice}
                                    step={0.0001}
                                    onChange={handleChange(setEntryPrice)}
                                    className={styles.leverageInput}
                                    style={{ maxWidth: '150px' }}
                                />
                            </CCol>
                        )}
                    </CRow>
                </CListGroupItem>
                {!priceData && <CAlert color="warning">
                    I could not get price data, please check if your Metatrader 5 client is running
                </CAlert>}
                {priceData?.askPrice === slPrice && <CAlert color="danger">
                    Stop Loss price cannot be equal to current price.
                </CAlert>}
                {((tpPrice === 0 || tpPrice === priceData?.askPrice) && tpEnabled) && <CAlert color="danger">
                    Take Profit price cannot be empty or equal to current price if it's enabled
                </CAlert>}
                {(entryPrice === 0 && entryEnabled) && <CAlert color="danger">
                    Entry price cannot be empty if it's enabled
                </CAlert>}
                {(tpEnabled && priceData?.askPrice && tpPrice > priceData.askPrice) && <CAlert color="warning">
                    Take Profit price is greater than current price so you can only start Long position.
                </CAlert>}
                {(tpEnabled && priceData?.askPrice && tpPrice < priceData.askPrice) && <CAlert color="warning">
                    Take Profit price is less than current price so you can only start Short position.
                </CAlert>}
                {(slPrice < entryPrice) && <CAlert color="warning">
                    Stop Loss price is less than entry price so you can only start Long position.
                </CAlert>}
                {(slPrice > entryPrice) && <CAlert color="warning">
                    Stop Loss price is greater than entry price so you can only start Short position.
                </CAlert>}
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <CCard textColor={'info'} className={`mb-3 border-info`} style={{ minWidth: '38rem' }}>
                        <CCardHeader>Enter</CCardHeader>
                        <CCardBody>
                            <CCardText>
                                <CListGroupItem>
                                    <CRow className="mb-3 align-items-center">
                                        <CCol className="d-flex justify-content-center">
                                            <CButton color="danger" size="lg" disabled={isShortDisabled()}>Short</CButton>
                                        </CCol>
                                        <CCol className="d-flex justify-content-center">
                                            <CButton color="success" size="lg" disabled={isLongDisabled()}>Long</CButton>
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3 align-items-center">
                                        <CCol className="d-flex justify-content-center">
                                            {!isShortDisabled() && <div>table</div>}
                                        </CCol>
                                        <CCol className="d-flex justify-content-center">
                                            {isShortDisabled()  && <div>table</div>}
                                        </CCol>
                                    </CRow>
                                </CListGroupItem>
                            </CCardText>
                        </CCardBody>
                    </CCard>
                </div>
            </CCardBody>
        </CCard>
    );
};

export default ExecuteTradeCard;

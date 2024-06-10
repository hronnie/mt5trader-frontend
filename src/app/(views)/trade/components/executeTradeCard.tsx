import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardHeader, CCardText,
    CCardTitle,
    CCol,
    CFormInput,
    CFormSwitch,
    CListGroupItem,
    CRow
} from "@coreui/react-pro";
import React, {useEffect, useState} from "react";
import styles from "@/app/(views)/settings/settings.module.css";
import {getSymbolInfo} from "@/services/newsService";
import {getPriceInfo} from "@/services/priceService";
import {Price} from "@/app/interfaces/priceInterface";

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
        let isMounted = true; // Track if component is still mounted

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
            || ((entryPrice === 0 || entryPrice === priceData?.askPrice) && entryEnabled);
    }

    const isShortDisabled = () => {
        if (isPriceFilledCorrectly()
            || (tpEnabled && tpPrice > priceData?.askPrice)) {
            return true;
        }
        return false;
    }

    const isLongDisabled = () => {
        if (isPriceFilledCorrectly()
            || (tpEnabled && tpPrice < priceData?.askPrice)) {
            return true;
        }
        return false;
    }

    return (
        <CCard>
            <CCardHeader>Execute trade for {symbolName}</CCardHeader>
            <CCardBody>
                <CCardTitle style={{marginBottom: "20px"}}>Select entry parameters</CCardTitle>
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
                    Take Profit price cannot be empty if it's enabled
                </CAlert>}
                {((entryPrice === 0 || entryPrice === priceData?.askPrice) && entryEnabled) && <CAlert color="danger">
                    Entry price cannot be empty if it's enabled
                </CAlert>}
                {(tpEnabled && priceData?.askPrice && tpPrice > priceData.askPrice) && <CAlert color="warning">
                    Take Profit price is greater than current price so you can only start Long position.
                </CAlert>}
                {(tpEnabled && priceData?.askPrice && tpPrice < priceData.askPrice) && <CAlert color="warning">
                    Take Profit price is less than current price so you can only start Short position.
                </CAlert>}
                <CCard
                    textColor={'info'}
                    className={`mb-3 border-info`}
                    style={{ maxWidth: '18rem' }}
                >
                    <CCardHeader>Enter</CCardHeader>
                    <CCardBody>
                        <CCardText>
                            <CButton color="danger" size="lg" disabled={isShortDisabled()}>Short</CButton>
                            <CButton color="success" size="lg" disabled={isLongDisabled()}>Long</CButton>
                        </CCardText>
                    </CCardBody>
                </CCard>
            </CCardBody>
        </CCard>
    );
};

export default ExecuteTradeCard;

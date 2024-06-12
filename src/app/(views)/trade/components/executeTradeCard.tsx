'use client'

import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
    CCol,
    CFormInput,
    CFormSwitch,
    CListGroup,
    CListGroupItem,
    CRow
} from "@coreui/react-pro";
import React, {BaseSyntheticEvent, useEffect, useState} from "react";
import styles from "@/app/(views)/settings/settings.module.css";
import {getPriceInfo} from "@/services/priceService";
import {Price} from "@/app/interfaces/priceInterface";
import {SETTINGS_LOCAL_STORAGE} from "@/app/common/constants";
import tradeService from "@/services/tradeService";
import {TradeResult} from "@/app/interfaces/tradeResult";

interface ExecuteTradeCardProps {
    symbolName: string;
}

const ExecuteTradeCard: React.FC<ExecuteTradeCardProps> = ({symbolName}) => {
    const [slPrice, setSlPrice] = useState(0);
    const [tpPrice, setTpPrice] = useState(0);
    const [entryPrice, setEntryPrice] = useState(0);
    const [tpEnabled, setTpEnabled] = useState(false);
    const [entryEnabled, setEntryEnabled] = useState(false);
    const [priceData, setPriceData] = useState<Price | null>(null);
    const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);

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

    const createLongOrder = async () => {
        try {
            const data = await tradeService.createLongOrder(symbolName, slPrice, tpPrice, entryPrice);
            setTradeResult(data);
        } catch (error) {
            console.error('Failed to create long order', error);
        }
    };

    const createShortOrder = async () => {
        try {
            const data = await tradeService.createShortOrder(symbolName, slPrice, tpPrice, entryPrice);
            setTradeResult(data);
        } catch (error) {
            console.error('Failed to create short order', error);
        }
    };

    const handleChange = (setter: Function) => (event: BaseSyntheticEvent) => {
        const price = parseFloat(event.target.value);
        setter(price);
    }

    const handleToggleChange = (checkboxSetter: Function, valueSetter: Function) => (event: BaseSyntheticEvent) => {
        const checked = event.target.checked;
        checkboxSetter(checked);
        valueSetter(priceData?.askPrice);
    }

    const isShortEnabled = () => {
        if (!priceData?.bidPrice) {
            return false;
        }
        const slPriceEligible = slPrice
            && slPrice > 0
            && slPrice > priceData?.bidPrice;

        const tpPriceEligible = tpPrice
            && tpPrice > 0
            && tpPrice < priceData?.bidPrice
            && tpPrice < slPrice;

        const onlySlPriceEnabled = !tpEnabled && !entryEnabled;
        const slAndTpPriceEnabled = tpEnabled && !entryEnabled;
        const allPriceEnabled = tpEnabled && entryEnabled;
        if (onlySlPriceEnabled) {
            if (slPriceEligible) {
                return true;
            }
        } else if (slAndTpPriceEnabled) {
            if (slPriceEligible && tpPriceEligible) {
                return true;
            }
        } else if (allPriceEnabled) {
            if (slPrice
                && slPrice > 0
                && tpPrice
                && tpPrice > 0
                && tpPrice < slPrice
                && entryPrice
                && entryPrice > 0
                && entryPrice < slPrice
                && entryPrice > tpPrice) {
                return true;
            }
        }
        return false;
    }

    const isLongEnabled = () => {
        if (!priceData?.askPrice) {
            return false;
        }
        const slPriceEligible = slPrice
            && slPrice > 0
            && slPrice < priceData?.askPrice;

        const tpPriceEligible = tpPrice
            && tpPrice > 0
            && tpPrice > priceData?.askPrice
            && tpPrice > slPrice;

        const onlySlPriceEnabled = !tpEnabled && !entryEnabled;
        const slAndTpPriceEnabled = tpEnabled && !entryEnabled;
        const allPriceEnabled = tpEnabled && entryEnabled;
        if (onlySlPriceEnabled) {
            if (slPriceEligible) {
                return true;
            }
        } else if (slAndTpPriceEnabled) {
            if (slPriceEligible && tpPriceEligible) {
                return true;
            }
        } else if (allPriceEnabled) {
            if (slPrice
                && slPrice > 0
                && tpPrice
                && tpPrice > 0
                && tpPrice > slPrice
                && entryPrice
                && entryPrice > 0
                && entryPrice > slPrice
                && entryPrice < tpPrice) {
                return true;
            }
        }
        return false;
    }

    const getEstimatedTpPrice = (direction: 'short' | 'long') => {
        if (tpEnabled) {
            return tpPrice;
        }
        const ratio = getRatio(symbolName);
        const slPip = parseFloat(getEstimatedSlPip(direction))
        const pipSize = getPipSizeBySymbol(symbolName);
        const estEntryPriceStr = getEstimatedEntryPrice(direction);
        if (!estEntryPriceStr) {
            return 0;
        }
        const estimatedEntryPrice = parseFloat(estEntryPriceStr);
        if (direction === 'short') {
            return (estimatedEntryPrice - (ratio * slPip * pipSize)).toFixed(5);
        } else {
            return (estimatedEntryPrice + (ratio * slPip * pipSize)).toFixed(5);
        }
    }

    const getEstimatedSlPip = (direction: 'short' | 'long') => {
        const estEntryPriceStr = getEstimatedEntryPrice(direction);
        if (!estEntryPriceStr) {
            return "0";
        }
        const estimatedEntryPrice = parseFloat(estEntryPriceStr);
        const result = Math.abs(estimatedEntryPrice - slPrice) / getPipSizeBySymbol(symbolName);
        return result.toFixed(2);
    }

    const getEstimatedEntryPrice = (direction: 'short' | 'long') => {
        if (direction === 'short') {
            return (entryEnabled ? entryPrice : priceData?.bidPrice)?.toFixed(5);
        } else {
            return (entryEnabled ? entryPrice : priceData?.askPrice)?.toFixed(5);
        }
    }
    const getEstimatedTpPip = (direction: 'short' | 'long') => {
        const entryPriceStr = getEstimatedEntryPrice(direction);
        const estimatedTpPriceStr = getEstimatedTpPrice(direction);
        if (!entryPriceStr || !estimatedTpPriceStr) {
            return 0;
        }
        // @ts-ignore
        const pipSize = Math.abs(parseFloat(entryPriceStr) - parseFloat(estimatedTpPriceStr)) / getPipSizeBySymbol(symbolName);
        return pipSize.toFixed(2);
    }

    const getPipSizeBySymbol = (symbol: string) => {
        const savedFormData = localStorage.getItem(SETTINGS_LOCAL_STORAGE);
        let parsedSymbolData = null;
        if (savedFormData) {
            parsedSymbolData = JSON.parse(savedFormData);
        }
        for (const category in parsedSymbolData) {
            if (parsedSymbolData[category].hasOwnProperty(symbol)) {
                return parsedSymbolData[category][symbol]?.pipSize;
            }
        }
        return null;
    }
    const getRatio = (symbol: string) => {
        const savedFormData = localStorage.getItem(SETTINGS_LOCAL_STORAGE);
        let parsedSymbolData = null;
        if (savedFormData) {
            parsedSymbolData = JSON.parse(savedFormData);
        }
        return parsedSymbolData.ratio;
    }


    return (
        <CCard>
            <CCardHeader>Execute trade for {symbolName}</CCardHeader>
            <CCardBody>
                <CCardTitle style={{marginBottom: "20px"}}>Select entry parameters</CCardTitle>
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
                            style={{maxWidth: '150px'}}
                        />
                    </CCol>
                </CRow>
                <CRow className="mb-3 align-items-center">
                    <CCol xs="auto">
                        <CFormSwitch label="Take Profit" id="tpSwitch"
                                     onChange={handleToggleChange(setTpEnabled, setTpPrice)}/>
                    </CCol>
                    {tpEnabled && (
                        <CCol xs="auto">
                            <CFormInput
                                type="number"
                                value={tpPrice}
                                step={0.0001}
                                onChange={handleChange(setTpPrice)}
                                className={styles.leverageInput}
                                style={{maxWidth: '150px'}}
                            />
                        </CCol>
                    )}
                </CRow>
                <CRow className="mb-3 align-items-center">
                    <CCol xs="auto">
                        <CFormSwitch label="Entry Price" id="entrySwitch"
                                     onChange={handleToggleChange(setEntryEnabled, setEntryPrice)}/>
                    </CCol>
                    {entryEnabled && (
                        <CCol xs="auto">
                            <CFormInput
                                type="number"
                                value={entryPrice}
                                step={0.0001}
                                onChange={handleChange(setEntryPrice)}
                                className={styles.leverageInput}
                                style={{maxWidth: '150px'}}
                            />
                        </CCol>
                    )}
                </CRow>
                {!isLongEnabled() && !isShortEnabled() && <CAlert color="danger">
                    Please provide valid data!

                    <h4>Guideline</h4>
                    <ul>
                        <li>SL and TP price cannot be equal with current price (it is provided as a default value)</li>
                        <li>SL and TP price cannot be empty, 0 or negative number</li>
                        <li>The given data should be able to create a valid order</li>
                    </ul>
                </CAlert>}

                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '200px'}}>
                    <CCard textColor={'info'} className={`mb-3 border-info`} style={{minWidth: '38rem'}}>
                        <CCardHeader>Create Order</CCardHeader>
                        <CCardBody>
                            <CRow className="mb-3 align-items-center">
                                <CCol className="d-flex justify-content-center">
                                    <CButton color="danger" size="lg" onClick={createShortOrder}
                                             disabled={!isShortEnabled()}
                                             style={{cursor: "pointer"}}>Short</CButton>
                                </CCol>
                                <CCol className="d-flex justify-content-center">
                                    <CButton color="success" size="lg" onClick={createLongOrder}
                                             disabled={!isLongEnabled()}
                                             style={{cursor: "pointer"}}>Long</CButton>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3 align-items-center">
                                <CCol className="d-flex justify-content-center">
                                    {isShortEnabled() && <span>
                                                <h5>Estimated order params: {symbolName}</h5>
                                                <CListGroup flush>
                                                    <CListGroupItem><strong>Entry Price:</strong> {getEstimatedEntryPrice('short')}</CListGroupItem>
                                                    <CListGroupItem><strong>Stop Loss Price:</strong> {slPrice}</CListGroupItem>
                                                    <CListGroupItem><strong>Take Profit Price:</strong> {getEstimatedTpPrice('short')}</CListGroupItem>
                                                    <CListGroupItem><strong>Stop Loss Pip:</strong> {getEstimatedSlPip('short')}</CListGroupItem>
                                                    <CListGroupItem><strong>Take Profit Pip:</strong> {getEstimatedTpPip('short')}</CListGroupItem>
                                            </CListGroup></span>}
                                </CCol>
                                <CCol className="d-flex justify-content-center">
                                    {isLongEnabled() && <span>
                                                <h5>Estimated order params: {symbolName}</h5>
                                                <CListGroup flush>
                                                    <CListGroupItem><strong>Entry Price:</strong> {getEstimatedEntryPrice('long')}</CListGroupItem>
                                                    <CListGroupItem><strong>Stop Loss Price:</strong> {slPrice}</CListGroupItem>
                                                    <CListGroupItem><strong>Take Profit Price:</strong> {getEstimatedTpPrice('long')}</CListGroupItem>
                                                    <CListGroupItem><strong>Stop Loss Pip:</strong> {getEstimatedSlPip('long')}</CListGroupItem>
                                                    <CListGroupItem><strong>Take Profit Pip: </strong> {getEstimatedTpPip('long')}</CListGroupItem>
                                            </CListGroup></span>}
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </div>

                {tradeResult && (
                    <div className="d-flex justify-content-center align-items-center" style={{minHeight: '200px'}}>
                        <CCard textBgColor={tradeResult?.comment === "Request executed" ? "success" : "danger"} textColor={"white"}
                               className={`mb-3 border-info`} style={{minWidth: '38rem'}}>
                            <CCardHeader>Order Creation Result</CCardHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol>
                                        <strong>Execution Date:</strong> {tradeResult.executionDate}
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <strong>Symbol:</strong> {tradeResult.symbol}
                                    </CCol>
                                    <CCol>
                                        <strong>Status:</strong> {tradeResult.comment}
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <strong>Entry Price:</strong> {tradeResult.entryPrice}
                                    </CCol>
                                    <CCol>
                                        <strong>Volume:</strong> {tradeResult.volume}
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <strong>SL Price:</strong> {tradeResult.slPrice}
                                    </CCol>
                                    <CCol>
                                        <strong>TP Price:</strong> {tradeResult.tpPrice}
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <strong>Money at Risk:</strong> {tradeResult.moneyAtRisk}
                                    </CCol>
                                    <CCol>
                                        <strong>TP Pip Value:</strong> {tradeResult.tpPipValue}
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <strong>SL Pip Value:</strong> {tradeResult.slPipValue}
                                    </CCol>
                                    <CCol>
                                        <strong>Spread:</strong> {tradeResult.spread}
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </div>)}

            </CCardBody>
        </CCard>

    );
};

export default ExecuteTradeCard;

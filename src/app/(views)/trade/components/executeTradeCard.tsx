import {
    CCard,
    CCardBody,
    CCardHeader,
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
            </CCardBody>
        </CCard>
    );
};

export default ExecuteTradeCard;

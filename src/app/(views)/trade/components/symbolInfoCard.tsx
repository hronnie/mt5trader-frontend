'use client';

import React, {useEffect, useState} from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
    CPlaceholder,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from "@coreui/react-pro";
import {getSymbolInfo} from "@/services/newsService";
import {getPriceInfo} from "@/services/priceService";
import {Price} from "@/app/interfaces/priceInterface";
import News, {NewsInterface} from "@/app/common/components/News";

interface SymbolCardProps {
    symbolName: string;
}

const SymbolInfoCard: React.FC<SymbolCardProps> = ({symbolName}) => {
    const [newsData, setNewsData] = useState<NewsInterface[] | null>(null);
    const [priceData, setPriceData] = useState<Price | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true; // Track if component is still mounted

        const fetchData = async () => {
            setLoading(true); // Set loading state to true whenever a new fetch starts
            try {
                const result = await getSymbolInfo(symbolName);
                const priceResult = await getPriceInfo(symbolName);
                if (isMounted) {
                    setNewsData(result);
                    setPriceData(priceResult);
                    setError(null); // Clear any previous errors
                }
            } catch (error: any) {
                if (isMounted) {
                    setError(error);
                    setNewsData(null); // Clear any previous data
                    setPriceData(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false); // Set loading state to false once fetching is done
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Cleanup function to prevent state updates if component unmounts
        };
    }, [symbolName]); // Add symbolName as a dependency

    if (loading)
        return (
            <CCard textColor={"primary"} className={`mb-3 border-primary`} style={{}}>
                <CCardHeader>{symbolName} Info</CCardHeader>
                <CCardBody>
                    <CCardTitle>News info</CCardTitle>
                    <CPlaceholder as="p" animation="wave">
                        <CPlaceholder xs={12}/>
                        <CPlaceholder xs={12}/>
                        <CPlaceholder xs={12}/>
                        <CPlaceholder xs={12}/>
                    </CPlaceholder>
                </CCardBody>
            </CCard>
        );

    if (error) return <div>Error: {error.message}</div>;

    return (
        <CCard textColor={"primary"} className={`mb-3 border-primary`} style={{}}>
            <CCardHeader>{symbolName} Info</CCardHeader>
            <CCardBody>
                <CCardTitle>News info</CCardTitle>
                <News newsData={newsData}/>
                <CCardTitle>Price info</CCardTitle>
                {priceData && (
                    <CTable align="middle" small>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col" className="w-25">
                                    Bid Price
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col" className="w-25">
                                    Ask Price
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col" className="w-25">
                                    Current Spread
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>

                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell>{priceData.bidPrice}</CTableDataCell>
                                <CTableDataCell>{priceData.askPrice}</CTableDataCell>
                                <CTableDataCell>{priceData.spread} Pip(s)</CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                )}
            </CCardBody>
        </CCard>
    );
};

export default SymbolInfoCard;

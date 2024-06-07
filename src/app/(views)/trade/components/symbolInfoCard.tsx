import {
    CCard,
    CCardBody,
    CCardHeader,
    CCardText,
    CCardTitle, CPlaceholder,
    CTable, CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow
} from "@coreui/react-pro";
import React, {useEffect, useState} from "react";
import {getSymbolInfo} from "@/services/newsService";
import {getPriceInfo} from "@/services/priceService";

interface SymbolCardProps {
    symbolName: string;
}

interface News {
    time: string;
    currency: string;
    description: string;
}

interface Price {
    askPrice: string;
    bidPrice: string;
    spread: string;
}

const SymbolInfoCard: React.FC<SymbolCardProps> = ({ symbolName }) => {
    const [data, setData] = useState<News[] | null>(null);
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
                    setData(result);
                    setPriceData(priceResult);
                    setError(null); // Clear any previous errors
                }
            } catch (error: any) {
                if (isMounted) {
                    setError(error);
                    setData(null); // Clear any previous data
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
        return <CCard
            textColor={"primary"}
            className={`mb-3 border-primary`}
            style={{}}
        >
            <CCardHeader>{symbolName} Info</CCardHeader>
            <CCardBody>
                <CCardTitle>News info</CCardTitle>
                <CCardText>
                    <CPlaceholder as="p" animation="wave">
                        <CPlaceholder xs={12} />
                        <CPlaceholder xs={12} />
                        <CPlaceholder xs={12} />
                        <CPlaceholder xs={12} />
                    </CPlaceholder>
                </CCardText>
            </CCardBody>
        </CCard>;

    if (error) return <div>Error: {error.message}</div>;

    return (
        <CCard
            textColor={"primary"}
            className={`mb-3 border-primary`}
            style={{}}
        >
            <CCardHeader>{symbolName} Info</CCardHeader>
            <CCardBody>
                <CCardTitle>News info</CCardTitle>
                <CCardText>
                    {
                        !data || data.length === 0 ? (
                            <div>I couldn't find any news for {symbolName}</div>
                        ) : (
                            <CTable align="middle" small>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col" className="w-25">
                                            Time
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope="col" className="w-25">
                                            Currency
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope="col" className="w-25">
                                            Description
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>

                                <CTableBody>
                                    {data.map((news: News, index: number) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell>
                                                {news.time}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {news.currency}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {news.description}
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        )
                    }
                </CCardText>
                <CCardTitle>Price info</CCardTitle>
                <CCardText>
                    {priceData && <CTable align="middle" small>
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
                                <CTableDataCell>
                                    {priceData.bidPrice}
                                </CTableDataCell>
                                <CTableDataCell>
                                    {priceData.askPrice}
                                </CTableDataCell>
                                <CTableDataCell>
                                    {priceData.spread}
                                </CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>}
                </CCardText>
            </CCardBody>
        </CCard>
    );
};

export default SymbolInfoCard;

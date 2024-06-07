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

interface SymbolCardProps {
    symbolName: string;
}

interface News {
    time: string;
    currency: string;
    description: string
}

const SymbolInfoCard: React.FC<SymbolCardProps> = ({ symbolName }) => {
    const [data, setData] = useState<News[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading state to true whenever a new fetch starts
            try {
                const result = await getSymbolInfo(symbolName);
                setData(result);
                setError(null); // Clear any previous errors
            } catch (error: any) {
                setError(error);
                setData(null); // Clear any previous data
            } finally {
                setLoading(false); // Set loading state to false once fetching is done
            }
        };

        fetchData();
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
                            {data && data.map((news: News, index: number) => (
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
                </CCardText>
            </CCardBody>
        </CCard>
    );
};

export default SymbolInfoCard;

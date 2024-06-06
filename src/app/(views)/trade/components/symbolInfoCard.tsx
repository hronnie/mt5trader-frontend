import {
    CCard,
    CCardBody,
    CCardHeader,
    CCardText,
    CCardTitle,
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
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getSymbolInfo(symbolName);
                setData(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error?.message}</div>;
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
                            {data && data.map((news: News) => (
                                <CTableRow>
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




                        {/*<table className="table w-100">*/}
                        {/*    <tbody>*/}
                        {/*    {data && data.map((news: News) => (*/}
                        {/*        <>*/}
                        {/*    <tr>*/}
                        {/*        <td className="text-medium-emphasis">Time:</td>*/}
                        {/*        <td className="font-weight-bold">{news.time}</td>*/}
                        {/*    </tr>*/}
                        {/*    <tr>*/}
                        {/*        <td className="text-medium-emphasis">Currency:</td>*/}
                        {/*        <td className="font-weight-bold">{news.currency}</td>*/}
                        {/*    </tr>*/}
                        {/*    <tr>*/}
                        {/*        <td className="text-medium-emphasis">Description:</td>*/}
                        {/*        <td className="font-weight-bold">{news.description}</td>*/}
                        {/*    </tr>*/}
                        {/*        </>*/}
                        {/*    ))}*/}
                        {/*    </tbody>*/}
                        {/*</table>*/}
                </CCardText>
            </CCardBody>
        </CCard>
    );
};

export default SymbolInfoCard;

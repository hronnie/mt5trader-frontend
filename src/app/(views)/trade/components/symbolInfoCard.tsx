import {CCard, CCardBody, CCardHeader, CCardText, CCardTitle} from "@coreui/react-pro";
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
                <CCardTitle>{"primary"} card title</CCardTitle>
                <CCardText>
                    {data && data.map((news: News) => (
                        <table className="table w-100">
                            <tbody>
                            <tr>
                                <td className="text-medium-emphasis">Time:</td>
                                <td className="font-weight-bold">{news.time}</td>
                            </tr>
                            <tr>
                                <td className="text-medium-emphasis">Currency:</td>
                                <td className="font-weight-bold">{news.currency}</td>
                            </tr>
                            <tr>
                                <td className="text-medium-emphasis">Description:</td>
                                <td className="font-weight-bold">{news.description}</td>
                            </tr>
                            </tbody>
                        </table>
                    ))}
                </CCardText>
            </CCardBody>
        </CCard>
    );
};

export default SymbolInfoCard;

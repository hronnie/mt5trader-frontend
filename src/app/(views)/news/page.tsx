'use client'

import React, {useEffect, useState} from 'react';
import {getSymbolInfo} from '@/services/newsService';
import News, {NewsInterface} from "@/app/common/components/News";
import {CCard, CCardBody, CCardHeader} from "@coreui/react-pro";


const NewsPage: React.FC = () => {
    const [newsData, setNewsData] = useState<NewsInterface[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const result = await getSymbolInfo('ALL');
                setNewsData(result);
                setError(null);
            } catch (error: any) {
                setError(error);
                setNewsData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <CCard className="mb-4">
            <CCardHeader>
                <strong>News for all Symbol</strong>
            </CCardHeader>
            <CCardBody>
                <News newsData={newsData}/>
            </CCardBody>
        </CCard>
    );
};

export default NewsPage;

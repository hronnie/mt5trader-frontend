import React from "react";
import {CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,} from "@coreui/react-pro";
import {format, parseISO} from "date-fns";

export interface NewsInterface {
    date: string;
    country: string;
    title: string;
    impact: string;
}

interface NewsProps {
    newsData: NewsInterface[] | null;
}

const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    const formattedDate = format(date, "PPP"); // Format date part
    return formattedDate;
};

const formatTime = (dateString: string) => {
    const date = parseISO(dateString);
    const formattedTime = format(date, "p"); // Format time part
    return formattedTime;
};

const getImpactStyles = (impact: string) => {
    switch (impact) {
        case "High":
            return {backgroundColor: "#ef376e", color: "white"};
        case "Medium":
            return {backgroundColor: "#ffcc00", color: "#000000"};
        case "Low":
        default:
            return {backgroundColor: "#f3f4f7", color: "#000000"};
    }
};

const News: React.FC<NewsProps> = ({newsData}) => {
    return !newsData || newsData.length === 0 ? (
        <div>I couldn't find any news for today</div>
    ) : (
        <CTable align="middle" small>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell scope="col" className="w-25">
                        Date
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="w-25">
                        Country
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="w-25">
                        Impact
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="w-25">
                        Title
                    </CTableHeaderCell>
                </CTableRow>
            </CTableHead>

            <CTableBody>
                {newsData.map((news: NewsInterface, index: number) => (
                    <CTableRow
                        key={index}
                        color={new Date(news?.date) < new Date() ? "dark" : ""}
                    >
                        <CTableDataCell>
                            {formatDate(news.date)} <strong>{formatTime(news.date)}</strong>
                        </CTableDataCell>
                        <CTableDataCell>{news.country}</CTableDataCell>
                        <CTableDataCell style={getImpactStyles(news.impact)}>
                            {news.impact}
                        </CTableDataCell>
                        <CTableDataCell>{news.title}</CTableDataCell>
                    </CTableRow>
                ))}
            </CTableBody>
        </CTable>
    );
};

export default News;

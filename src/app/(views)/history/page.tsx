'use client'

import {
    CCard,
    CCardBody,
    CCardHeader,
    CBadge,
    CButton,
    CCollapse,
    CSmartTable,
    CToaster, CRow, CCol, CFormInput
} from '@coreui/react-pro';
import React, {useEffect, useState} from "react";
import { TradeHistory } from '@/interfaces';
import CIcon from "@coreui/icons-react";
import {cilReload} from "@coreui/icons";
import {formatNumber, formatTime} from "@/app/common/helperMethods";
import {positionTableColumns} from "@/app/(views)/positions/positionTableColumn";
import {getAllHistoryService} from "@/services/historyService";
import {historyTableColumns} from "@/app/(views)/history/historyTableColumn";

const History = () => {
    const [history, setHistory] = useState<TradeHistory[]>([]);
    const [error, setError] = useState<Error | null>(null);

    const refreshHistory = async () => {
        try {
            const histories = await getAllHistoryService();
            setHistory(histories);
            setError(null);
        } catch (error: any) {
            setError(error);
            setHistory([]);
        } finally {
        }
    }

    useEffect(() => {
        refreshHistory();
    }, []);

    const getProfitBadge = (profit: number) => {
        return profit > 0 ? 'success' : 'danger';
    }

    const getOrderTypeBadge = (orderType: string) => {
        return orderType.includes('Sell') ? 'danger' : 'success';
    }


    if (error) return <div>Error: {error.message}</div>;

    return (
        <CCard className="mb-4">
            <CCardHeader>
                <strong>Trading History</strong>
                <CButton color="primary" className="float-end" onClick={refreshHistory}>
                    <CIcon icon={cilReload}/>
                </CButton>

            </CCardHeader>
            <CCardBody>
                <CSmartTable
                    activePage={1}
                    columns={historyTableColumns}
                    columnFilter
                    columnSorter
                    items={history}
                    itemsPerPageSelect
                    itemsPerPage={10}
                    pagination
                    scopedColumns={{
                        profit: (item: TradeHistory) => (
                            <td>
                                <CBadge color={getProfitBadge(item.profit)}>{formatNumber(item.profit, 2)}</CBadge>
                            </td>
                        ),
                        type: (item: TradeHistory) => (
                            <td>
                                <CBadge color={getOrderTypeBadge(item.type)}>{item.type}</CBadge>
                            </td>
                        ),
                        entry_price: (item: TradeHistory) => (
                            <td>{formatNumber(item.price)}</td>
                        ),
                        sl: (item: TradeHistory) => (
                            <td>{formatNumber(item.sl)}</td>
                        ),
                        tp: (item: TradeHistory) => (
                            <td>{formatNumber(item.tp)}</td>
                        ),
                        volume: (item: TradeHistory) => (
                            <td>{formatNumber(item.volume, 2)}</td>
                        ),
                        current_price: (item: TradeHistory) => (
                            <td>{formatNumber(item.current_price)}</td>
                        ),
                        time: (item: TradeHistory) => (
                            <td>{formatTime(item.time)}</td>
                        ),
                        commission: (item: TradeHistory) => (
                            <td>{formatNumber(item.commission, 2)}</td>
                        ),
                        swap: (item: TradeHistory) => (
                            <td>{formatNumber(item.swap, 2)}</td>
                        ),
                        fee: (item: TradeHistory) => (
                            <td>{formatNumber(item.fee, 2)}</td>
                        ),
                    }}
                    sorterValue={{ column: 'time', state: 'desc' }}
                    tableProps={{
                        className: 'add-this-class',
                        responsive: true,
                        striped: true,
                        hover: true,
                    }}
                    tableBodyProps={{
                        className: 'align-middle'
                    }}
                />
            </CCardBody>
        </CCard>
    );
};

export default History;

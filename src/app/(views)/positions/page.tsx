'use client'

import { CCard, CCardBody, CCardHeader, CBadge, CButton, CCollapse, CSmartTable } from '@coreui/react-pro';
import React, { useEffect, useState } from "react";
import { closePositions, getPositions } from '@/services/positionsService';
import { TradePosition } from '@/interfaces';

const Positions = () => {
    const [positions, setPositions] = useState<TradePosition[]>([]);
    const [details, setDetails] = useState<number[]>([]);

    const refreshPositions = async () => {
        const positions = await getPositions();
        setPositions(positions);
    }

    useEffect(() => {
        refreshPositions();
    }, []);

    const columns = [
        { key: 'symbol', label: 'Symbol' },
        { key: 'ticket', label: 'Ticket' },
        { key: 'time', label: 'Time' },
        { key: 'type', label: 'Type' },
        { key: 'volume', label: 'Volume' },
        { key: 'price', label: 'Price' },
        { key: 'sl', label: 'SL' },
        { key: 'tp', label: 'TP' },
        { key: 'current_price', label: 'Current Price' },
        { key: 'profit', label: 'Profit' },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            filter: false,
            sorter: false,
        },
    ];

    const getProfitBadge = (profit: number) => {
        return profit > 0 ? 'success' : 'danger';
    }

    const getOrderTypeBadge = (orderType: string) => {
        return orderType.includes('Sell') ? 'danger' : 'success';
    }

    const formatNumber = (num: number) => {
        return num.toFixed(4);
    }

    const toggleDetails = (index: number) => {
        const position = details.indexOf(index);
        let newDetails = details.slice();
        if (position !== -1) {
            newDetails.splice(position, 1);
        } else {
            newDetails = [...details, index];
        }
        setDetails(newDetails);
    }

    const handlePositionClose = async (ticket: number) => {
        const closeResult = await closePositions(ticket);
    }

    return (
        <CCard className="mb-4">
            <CCardHeader>
                <strong>Active positions</strong>
            </CCardHeader>
            <CCardBody>
                <CSmartTable
                    activePage={1}
                    clickableRows
                    columns={columns}
                    columnFilter
                    columnSorter
                    footer
                    items={positions}
                    itemsPerPageSelect
                    itemsPerPage={5}
                    pagination
                    scopedColumns={{
                        profit: (item: TradePosition) => (
                            <td>
                                <CBadge color={getProfitBadge(item.profit)}>{item.profit}</CBadge>
                            </td>
                        ),
                        type: (item: TradePosition) => (
                            <td>
                                <CBadge color={getOrderTypeBadge(item.type)}>{item.type}</CBadge>
                            </td>
                        ),
                        price: (item: TradePosition) => (
                            <td>{formatNumber(item.price)}</td>
                        ),
                        sl: (item: TradePosition) => (
                            <td>{formatNumber(item.sl)}</td>
                        ),
                        tp: (item: TradePosition) => (
                            <td>{formatNumber(item.tp)}</td>
                        ),
                        show_details: (item: TradePosition) => {
                            return (
                                <td className="py-2">
                                    <CButton
                                        color="primary"
                                        variant="outline"
                                        shape="square"
                                        size="sm"
                                        onClick={() => {
                                            toggleDetails(item.ticket)
                                        }}
                                    >
                                        {details.includes(item.ticket) ? 'Hide' : 'Show'}
                                    </CButton>
                                </td>
                            )
                        },
                        details: (item: TradePosition) => {
                            return (
                                <CCollapse visible={details.includes(item.ticket)}>
                                    <CCardBody className="p-3">
                                        <h4>{item.symbol}</h4>
                                        <p className="text-muted">Position opened at: {item.time}</p>
                                        <CButton size="sm" color="danger" className="ml-1" onClick={() => handlePositionClose(item.ticket)}>
                                            Close Trade
                                        </CButton>
                                    </CCardBody>
                                </CCollapse>
                            )
                        },
                    }}
                    sorterValue={{ column: 'profit', state: 'asc' }}
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

export default Positions;

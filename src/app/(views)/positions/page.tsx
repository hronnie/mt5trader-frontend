'use client'

import {
    CCard,
    CCardBody,
    CCardHeader,
    CBadge,
    CButton,
    CCollapse,
    CSmartTable,
    CCardTitle,
    CPlaceholder, CToast, CToastBody, CToaster, CRow, CCol, CFormInput
} from '@coreui/react-pro';
import React, {BaseSyntheticEvent, useEffect, useRef, useState} from "react";
import {closePositions, getPositions, modifyPositions} from '@/services/positionsService';
import { TradePosition } from '@/interfaces';
import CIcon from "@coreui/icons-react";
import {cilCloudDownload, cilReload} from "@coreui/icons";
import {getSymbolInfo} from "@/services/newsService";
import {getPriceInfo} from "@/services/priceService";
import styles from "@/app/(views)/settings/settings.module.css";

const Positions = () => {
    const [positions, setPositions] = useState<TradePosition[]>([]);
    const [details, setDetails] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [toast, addToast] = useState(0)
    const [sl, setSl] = useState(0)
    const [tp, setTp] = useState(0)

    const toaster = useRef();
    const successToast = (
        <CToast color="success">
            <CToastBody>You successfully closed the position!</CToastBody>
        </CToast>
    )
    const errorToast = (
        <CToast color="danger">
            <CToastBody>There was an error during closing the position!</CToastBody>
        </CToast>
    )

    const refreshPositions = async () => {
        addToast(0);
        setLoading(true);
        try {
            const positions = await getPositions();
            setPositions(positions);
            setError(null);
        } catch (error: any) {
            setError(error);
            setPositions([]);
        } finally {
            setLoading(false);
        }
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
        try {
            const closeResult = await closePositions(ticket);
            await refreshPositions();
            addToast(successToast);
        } catch (error) {
            console.error('Error creating long order', error);
            await refreshPositions();
            addToast(errorToast);
            throw error;
        }
    }

    const handleModifyPosition = async (ticket: number) => {
        try {
            const modifyResult = await modifyPositions(ticket, sl, tp);
            await refreshPositions();
            addToast(successToast);
        } catch (error) {
            console.error('Error creating long order', error);
            await refreshPositions();
            addToast(errorToast);
            throw error;
        }
    }

    const handleChange = (setter: Function) => (event: BaseSyntheticEvent) => {
        const price = parseFloat(event.target.value);
        setter(price)
    }

    if (loading)
        return <CCard
        >
            <CCardHeader><strong>Active Positions (Loading...)</strong></CCardHeader>
            <CCardBody>
                <CCardTitle></CCardTitle>
                <CPlaceholder as="p" animation="wave">
                    <CPlaceholder xs={12}/>
                    <CPlaceholder xs={12}/>
                    <CPlaceholder xs={12}/>
                    <CPlaceholder xs={12}/>
                </CPlaceholder>
            </CCardBody>
        </CCard>;

    if (error) return <div>Error: {error.message}</div>;

    return (
        <CCard className="mb-4">
            <CCardHeader>
                <strong>Active positions</strong>
                <CButton color="primary" className="float-end" onClick={refreshPositions}>
                    <CIcon icon={cilReload}/>
                </CButton>
            </CCardHeader>
            <CCardBody>
                <CSmartTable
                    activePage={1}
                    columns={columns}
                    columnFilter
                    columnSorter
                    items={positions}
                    itemsPerPageSelect
                    itemsPerPage={5}
                    pagination
                    scopedColumns={{
                        profit: (item: TradePosition) => (
                            <td>
                                <CBadge color={getProfitBadge(item.profit)}>{formatNumber(item.profit)}</CBadge>
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
                                        {details.includes(item.ticket) ? 'Hide' : 'Details'}
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
                                        <CRow className="mb-3 align-items-center">
                                            <CCol className="d-flex justify-content-center">
                                                <CButton size="sm" color="danger" className="ml-1" onClick={() => handlePositionClose(item.ticket)}>
                                                    Close Trade
                                                </CButton>
                                            </CCol>
                                            <CCol className="d-flex justify-content-center">
                                                <CFormInput
                                                    type="number"
                                                    step={0.0001}
                                                    value={sl}
                                                    onChange={handleChange(setSl)}
                                                    className={styles.leverageInput}
                                                    style={{maxWidth: '150px'}}
                                                />
                                                <CFormInput
                                                    type="number"
                                                    step={0.0001}
                                                    value={tp}
                                                    onChange={handleChange(setTp)}
                                                    className={styles.leverageInput}
                                                    style={{maxWidth: '150px'}}
                                                />
                                                <CButton color="success" size="lg" onClick={() => handleModifyPosition(item.ticket)}
                                                         style={{cursor: "pointer"}}>Modify</CButton>
                                            </CCol>
                                        </CRow>

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
                <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
            </CCardBody>
        </CCard>
    );
};

export default Positions;

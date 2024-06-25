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
import {
    breakEvenPositions,
    closePositions, flipPositions,
    getPositions,
    hedgePositions,
    modifyPositions
} from '@/services/positionsService';
import { TradePosition } from '@/interfaces';
import CIcon from "@coreui/icons-react";
import {cilReload} from "@coreui/icons";
import {
    errorBreakEvenToast,
    errorCloseToast, errorFlipToast, errorHedgeToast, errorModifyToast,
    successBreakEvenToast,
    successCloseToast, successFlipToast, successHedgeToast, successModifyToast
} from "@/app/(views)/positions/positionResultToasts";

const Positions = () => {
    const [positions, setPositions] = useState<TradePosition[]>([]);
    const [details, setDetails] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [toast, addToast] = useState(0);
    const [positionSLTP, setPositionSLTP] = useState<{[key: number]: {sl: number, tp: number}}>({});

    const toaster = useRef();


    const initializePositionSLTP = (positions: TradePosition[]) => {
        const initialSLTP: {[key: number]: {sl: number, tp: number}} = {};
        positions.forEach(position => {
            initialSLTP[position.ticket] = {
                sl: position.sl,
                tp: position.tp,
            };
        });
        setPositionSLTP(initialSLTP);
    };

    const refreshPositions = async () => {
        addToast(0);
        setLoading(true);
        try {
            const positions = await getPositions();
            setPositions(positions);
            initializePositionSLTP(positions);
            setError(null);
        } catch (error: any) {
            setError(error);
            setPositions([]);
        } finally {
            setLoading(false);
        }
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
            addToast(successCloseToast);
        } catch (error) {
            console.error('Error creating long order', error);
            await refreshPositions();
            addToast(errorCloseToast);
            throw error;
        }
    }

    const handleModifyDisabled = (sl: number, tp: number): boolean => {
        const isSlEmpty = !sl || sl === 0 || sl < 0;
        const isTpEmpty = !tp || tp === 0 || tp < 0;
        return isSlEmpty && isTpEmpty;
    }

    const handleBreakEven = async (ticket: number) => {
        try {
            const breakEvenResult = await breakEvenPositions(ticket);
            await refreshPositions();
            addToast(successBreakEvenToast);
        } catch (error) {
            await refreshPositions();
            addToast(errorBreakEvenToast);
            throw error;
        }
    }

    const handleModifyPosition = async (ticket: number) => {
        const { sl, tp } = positionSLTP[ticket] || { sl: 0, tp: 0 };
        try {
            const modifyResult = await modifyPositions(ticket, sl, tp);
            await refreshPositions();
            addToast(successModifyToast);
        } catch (error) {
            await refreshPositions();
            addToast(errorModifyToast);
            throw error;
        }
    }

    const handleHedgePosition = async (ticket: number) => {
        const { sl, tp } = positionSLTP[ticket] || { sl: 0, tp: 0 };
        try {
            const hedgeResult = await hedgePositions(ticket, sl);
            await refreshPositions();
            addToast(successHedgeToast);
        } catch (error) {
            await refreshPositions();
            addToast(errorHedgeToast);
            throw error;
        }
    }

    const handleFlipPosition = async (ticket: number) => {
        try {
            const flipResult = await flipPositions(ticket);
            await refreshPositions();
            addToast(successFlipToast);
        } catch (error) {
            await refreshPositions();
            addToast(errorFlipToast);
            throw error;
        }
    }

    const handleBreakEvenDisabled = (profit: number) => {
        debugger;
        return profit < 10;
    }

    const handleChange = (ticket: number, field: 'sl' | 'tp') => (event: BaseSyntheticEvent) => {
        const value = parseFloat(event.target.value);
        setPositionSLTP(prev => ({
            ...prev,
            [ticket]: {
                ...prev[ticket],
                [field]: value
            }
        }));
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
                            const { sl = item.slPrice, tp = item.tpPrice } = positionSLTP[item.ticket] || {};
                            // @ts-ignore
                            return (
                                <CCollapse visible={details.includes(item.ticket)}>
                                    <CCardBody className="p-3">
                                        <h4>{item.symbol}</h4>
                                        <p className="text-muted">Position opened at: {item.time}</p>
                                        <CRow className="mb-3 align-items-center">
                                            <CCol className="d-flex">
                                                <CButton size="lg" color="danger" className="ml-1" onClick={() => handlePositionClose(item.ticket)} style={{color: "white"}}>
                                                    Close Trade
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3 align-items-center">
                                            <CCol className="d-flex">
                                                <CButton size="lg" color="primary"
                                                         className="ml-1"
                                                         onClick={() => handleBreakEven(item.ticket)}
                                                         disabled={handleBreakEvenDisabled(item.profit)}
                                                         style={{color: "white"}}>
                                                    Break Even
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3 align-items-center">
                                            <CCol className="d-flex">
                                                <strong style={{marginTop: '10px', marginRight: '14px'}}>SL:</strong><CFormInput
                                                    type="number"
                                                    step={0.0001}
                                                    value={sl}
                                                    onChange={handleChange(item.ticket, 'sl')}
                                                    style={{maxWidth: '150px', marginRight: '8px'}}
                                                />
                                                <strong style={{marginTop: '10px', marginRight: '14px'}}>TP:</strong><CFormInput
                                                    type="number"
                                                    step={0.0001}
                                                    value={tp}
                                                    onChange={handleChange(item.ticket, 'tp')}
                                                    style={{maxWidth: '150px', marginRight: '8px'}}
                                                />
                                                <CButton color="primary" size="lg" onClick={() => handleModifyPosition(item.ticket)}
                                                         style={{cursor: "pointer"}} disabled={handleModifyDisabled(sl, tp)}>Modify</CButton>
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3 align-items-center">
                                            <CCol className="d-flex">
                                                <strong style={{marginTop: '10px', marginRight: '14px'}}>SL:</strong><CFormInput
                                                    type="number"
                                                    step={0.0001}
                                                    value={sl}
                                                    onChange={handleChange(item.ticket, 'sl')}
                                                    style={{maxWidth: '150px', marginRight: '8px'}}
                                                />
                                                <CButton color="danger" size="lg" onClick={() => handleHedgePosition(item.ticket)}
                                                         style={{cursor: "pointer"}} >Hedge</CButton>
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3 align-items-center">
                                            <CCol className="d-flex">
                                                <CButton color="danger" size="lg" onClick={() => handleFlipPosition(item.ticket)}
                                                         style={{cursor: "pointer"}} >Flip</CButton>
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

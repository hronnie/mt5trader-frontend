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
    CPlaceholder, CToast, CToastBody, CToaster, CRow, CCol, CFormInput, CTooltip
} from '@coreui/react-pro';
import React, {BaseSyntheticEvent, useEffect, useRef, useState} from "react";
import {
    breakEvenPositionService, closeAllPositionService,
    closePositionsService, flipPositionService,
    getPositionsService,
    hedgePositionService,
    modifyPositionsService,
} from '@/services/positionsService';
import { TradePosition } from '@/interfaces';
import CIcon from "@coreui/icons-react";
import {cilArrowThickToRight, cilCode, cilCropRotate, cilDelete, cilElevator, cilReload} from "@coreui/icons";
import {
    errorBreakEvenToast, errorCloseAllToast,
    errorCloseToast, errorFlipToast, errorHedgeToast, errorModifyToast,
    successBreakEvenToast, successCloseAllToast,
    successCloseToast, successFlipToast, successHedgeToast, successModifyToast
} from "@/app/(views)/positions/positionResultToasts";
import {ORDER_REQUEST_SUCCESS_TEXT} from "@/app/common/constants";
import {formatNumber} from "@/app/common/helperMethods";

const Positions = () => {
    const [positions, setPositions] = useState<TradePosition[]>([]);
    const [details, setDetails] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [toast, addToast] = useState(0);
    const [positionSLTP, setPositionSLTP] = useState<{[key: number]: {sl: number, tp: number}}>({});
    const [visible, setVisible] = useState(false)

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
            const positions = await getPositionsService();
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
        { key: 'entry_price', label: 'Entry Price' },
        { key: 'sl', label: 'SL' },
        { key: 'tp', label: 'TP' },
        { key: 'current_price', label: 'Current Price' },
        { key: 'profit', label: 'Profit' },
        { key: 'actions', label: 'Actions' },
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
            const closeResult = await closePositionsService(ticket);
            if (closeResult?.comment == ORDER_REQUEST_SUCCESS_TEXT) {
                await refreshPositions();
                addToast(successCloseToast);
            } else {
                await refreshPositions();
                addToast(errorCloseToast);
            }
        } catch (error) {
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
            const breakEvenResult = await breakEvenPositionService(ticket);
            if (breakEvenResult?.comment == ORDER_REQUEST_SUCCESS_TEXT) {
                await refreshPositions();
                addToast(successBreakEvenToast);
            } else {
                await refreshPositions();
                addToast(errorBreakEvenToast);
            }
        } catch (error) {
            await refreshPositions();
            addToast(errorBreakEvenToast);
            throw error;
        }
    }

    const handleModifyPosition = async (ticket: number) => {
        const { sl, tp } = positionSLTP[ticket] || { sl: 0, tp: 0 };
        try {
            const modifyResult = await modifyPositionsService(ticket, sl, tp);
            if (modifyResult?.comment == ORDER_REQUEST_SUCCESS_TEXT) {
                await refreshPositions();
                addToast(successModifyToast);
            } else {
                await refreshPositions();
                addToast(errorModifyToast);
            }
        } catch (error) {
            await refreshPositions();
            addToast(errorModifyToast);
            throw error;
        }
    }

    const handleHedgePosition = async (ticket: number) => {
        try {
            const hedgeResult = await hedgePositionService(ticket);
            if (hedgeResult?.comment == ORDER_REQUEST_SUCCESS_TEXT) {
                await refreshPositions();
                addToast(successHedgeToast);
            } else {
                await refreshPositions();
                addToast(errorHedgeToast);
            }
        } catch (error) {
            await refreshPositions();
            addToast(errorHedgeToast);
            throw error;
        }
    }

    const handleFlipPosition = async (ticket: number) => {
        try {
            const flipResult = await flipPositionService(ticket);
            if (flipResult?.comment == ORDER_REQUEST_SUCCESS_TEXT) {
                await refreshPositions();
                addToast(successFlipToast);
            } else {
                await refreshPositions();
                addToast(errorFlipToast);
            }
        } catch (error) {
            await refreshPositions();
            addToast(errorFlipToast);
            throw error;
        }
    }

    const handleCloseAllPosition = async () => {
        try {
            const closeAllPositionResult = await closeAllPositionService();
            if (closeAllPositionResult?.comment == ORDER_REQUEST_SUCCESS_TEXT) {
                await refreshPositions();
                addToast(successCloseAllToast);
            } else {
                await refreshPositions();
                addToast(errorCloseAllToast);
            }
        } catch (error) {
            await refreshPositions();
            addToast(errorCloseAllToast);
            throw error;
        }
    }

    const handleBreakEvenDisabled = (profit: number) => {
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

    const closeAllPositionSection =   <>
        <CButton color="danger" onClick={() => setVisible(!visible)}>
            Close All
        </CButton>
        <CCollapse visible={visible}>
            <CCard className="mt-3">
                <CCardBody>
                    <CButton color="danger" className="float-start" onClick={handleCloseAllPosition}>
                        <CIcon icon={cilDelete}/> Close All
                    </CButton>
                </CCardBody>
            </CCard>
        </CCollapse>
    </>

    const actionButtonsSection = (ticket: number, profit: number) =>  <>
        <CRow className="mb-3 align-items-center">
            <CCol className="d-flex">
                <CButton color="danger" className="float-start" onClick={() => handlePositionClose(ticket)} style={{marginBottom: "3px"}} title={"Close position"}>
                    <CIcon icon={cilDelete}/>
                </CButton>
                <span style={{marginTop: "8px", marginLeft: "5px"}}>Close</span>
            </CCol>
            <CCol className="d-flex">
                <CButton color="primary" className="float-start" onClick={() => handleBreakEven(ticket)} style={{marginBottom: "3px"}} disabled={handleBreakEvenDisabled(profit)}>
                    <CIcon icon={cilArrowThickToRight}/>
                </CButton>
                <span style={{marginTop: "8px", marginLeft: "5px"}}>Break Even</span>
            </CCol>
            <CCol className="d-flex">
                <CButton color="warning" className="float-start" onClick={() => handleHedgePosition(ticket)} style={{marginBottom: "3px"}}>
                    <CIcon icon={cilElevator}/>
                </CButton>
                <span style={{marginTop: "8px", marginLeft: "5px"}}>Hedge</span>
            </CCol>
            <CCol className="d-flex">
                <CButton color="danger" className="float-start" onClick={() => handleFlipPosition(ticket)} style={{marginBottom: "3px"}}>
                    <CIcon icon={cilCropRotate}/>
                </CButton>
                <span style={{marginTop: "8px", marginLeft: "5px"}}>Flip</span>
            </CCol>
        </CRow>
    </>

    return (
        <CCard className="mb-4">
            <CCardHeader>
                <strong>Active positions</strong>
                <CButton color="primary" className="float-end" onClick={refreshPositions}>
                    <CIcon icon={cilReload}/>
                </CButton>

            </CCardHeader>
            <CCardBody>
                {closeAllPositionSection}
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
                        entry_price: (item: TradePosition) => (
                            <td>{formatNumber(item.price)}</td>
                        ),
                        sl: (item: TradePosition) => (
                            <td>{formatNumber(item.sl)}</td>
                        ),
                        tp: (item: TradePosition) => (
                            <td>{formatNumber(item.tp)}</td>
                        ),
                        actions: (item: TradePosition) => (
                            <td>{actionButtonsSection(item.ticket, item.profit)}</td>
                        ),
                        volume: (item: TradePosition) => (
                            <td>{formatNumber(item.volume, 2)}</td>
                        ),
                        current_price: (item: TradePosition) => (
                            <td>{formatNumber(item.current_price)}</td>
                        ),
                        show_details: (item: TradePosition) => {
                            return (
                                <td className="py-2">
                                    <CButton
                                        color="danger"
                                        variant="outline"
                                        shape="square"
                                        size="sm"
                                        onClick={() => {
                                            toggleDetails(item.ticket)
                                        }}
                                    >
                                        {details.includes(item.ticket) ? 'Hide' : 'Modify'}
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
                                                <CButton color="primary" size="sm" onClick={() => handleModifyPosition(item.ticket)}
                                                         style={{cursor: "pointer"}} disabled={handleModifyDisabled(sl, tp)}>Modify</CButton>
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

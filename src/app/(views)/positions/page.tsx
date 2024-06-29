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
import {positionTableColumns} from "@/app/(views)/positions/positionTableColumn";
import {actionButtonsSection} from "@/app/(views)/positions/components/actionButtonComponent";

const Positions = () => {
    const [positions, setPositions] = useState<TradePosition[]>([]);
    const [details, setDetails] = useState<number[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [toast, addToast] = useState(0);
    const [visible, setVisible] = useState(false);
    const [sl, setSl] = useState(0);
    const [tp, setTp] = useState(0);

    const toaster = useRef();

    const POSITION_REFRESH_RATE = 200000;

    const refreshPositions = async () => {
        addToast(0);
        try {
            const positions = await getPositionsService();
            setPositions(positions);
            setError(null);
        } catch (error: any) {
            setError(error);
            setPositions([]);
        } finally {
        }
    }

    useEffect(() => {
        refreshPositions();

        const interval = setInterval(() => {
            refreshPositions();
        }, POSITION_REFRESH_RATE); // Refresh every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

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

    const handleModifyDisabled = (sl: number, tp: number): boolean => {
        const isSlEmpty = !sl || sl === 0 || sl < 0;
        const isTpEmpty = !tp || tp === 0 || tp < 0;
        return isSlEmpty && isTpEmpty;
    }

    const handlePositionAction = async (
        serviceFunction: (ticket: number) => Promise<any>,
        ticket: number,
        successToast: any,
        errorToast: any
    ) => {
        try {
            const result = await serviceFunction(ticket);
            if (result?.comment == ORDER_REQUEST_SUCCESS_TEXT) {
                await refreshPositions();
                addToast(successToast);
            } else {
                await refreshPositions();
                addToast(errorToast);
            }
        } catch (error) {
            await refreshPositions();
            addToast(errorToast);
            throw error;
        }
    };

    const handlePositionClose = (ticket: number) => handlePositionAction(closePositionsService, ticket, successCloseToast, errorCloseToast);
    const handleBreakEven = (ticket: number) => handlePositionAction(breakEvenPositionService, ticket, successBreakEvenToast, errorBreakEvenToast);
    const handleHedgePosition = (ticket: number) => handlePositionAction(hedgePositionService, ticket, successHedgeToast, errorHedgeToast);
    const handleFlipPosition = (ticket: number) => handlePositionAction(flipPositionService, ticket, successFlipToast, errorFlipToast);

    const handleModifyPosition = async (ticket: number) => {
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
    };

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
    };


    const handleBreakEvenDisabled = (profit: number) => {
        return profit < 10;
    }

    const handleChange = (field: 'sl' | 'tp') => (event: BaseSyntheticEvent) => {
        const value = parseFloat(event.target.value);
        if (field === "sl") {
            setSl(value);
        } else {
            setTp(value);
        }
    }

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
                    columns={positionTableColumns}
                    columnFilter
                    columnSorter
                    items={positions}
                    itemsPerPageSelect
                    itemsPerPage={5}
                    pagination
                    scopedColumns={{
                        profit: (item: TradePosition) => (
                            <td>
                                <CBadge color={getProfitBadge(item.profit)}>{formatNumber(item.profit, 2)}</CBadge>
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
                            <td>{actionButtonsSection(
                                item.ticket,
                                item.profit,
                                handlePositionClose,
                                handleBreakEven,
                                handleBreakEvenDisabled,
                                handleHedgePosition,
                                handleFlipPosition
                            )}</td>
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
                                                onChange={handleChange('sl')}
                                                style={{maxWidth: '150px', marginRight: '8px'}}
                                            />
                                                <strong style={{marginTop: '10px', marginRight: '14px'}}>TP:</strong><CFormInput
                                                type="number"
                                                step={0.0001}
                                                value={tp}
                                                onChange={handleChange('tp')}
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
                    sorterValue={{ column: 'time', state: 'asc' }}
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

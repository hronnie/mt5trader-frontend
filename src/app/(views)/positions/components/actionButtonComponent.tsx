import {CButton, CCol, CRow} from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import {cilArrowThickToRight, cilCropRotate, cilDelete, cilElevator} from "@coreui/icons";
import React from "react";
export const actionButtonsSection = (
    ticket: number,
    profit: number,
    handlePositionClose: (ticket: number) => void,
    handleBreakEven: (ticket: number) => void,
    handleBreakEvenDisabled: (profit: number) => boolean,
    handleHedgePosition: (ticket: number) => void,
    handleFlipPosition: (ticket: number) => void
) => (
    <>
        <CRow className="mb-3 align-items-center">
            <CCol className="d-flex">
                <CButton
                    color="danger"
                    className="float-start"
                    onClick={() => handlePositionClose(ticket)}
                    style={{marginBottom: "3px"}}
                    title={"Close position"}
                >
                    <CIcon icon={cilDelete}/>
                </CButton>
                <span style={{marginTop: "8px", marginLeft: "5px"}}>Close</span>
            </CCol>
            <CCol className="d-flex">
                <CButton
                    color="primary"
                    className="float-start"
                    onClick={() => handleBreakEven(ticket)}
                    style={{marginBottom: "3px"}}
                    disabled={handleBreakEvenDisabled(profit)}
                >
                    <CIcon icon={cilArrowThickToRight}/>
                </CButton>
                <span style={{marginTop: "8px", marginLeft: "5px"}}>Break Even</span>
            </CCol>
            <CCol className="d-flex">
                <CButton
                    color="warning"
                    className="float-start"
                    onClick={() => handleHedgePosition(ticket)}
                    style={{marginBottom: "3px"}}
                >
                    <CIcon icon={cilElevator}/>
                </CButton>
                <span style={{marginTop: "8px", marginLeft: "5px"}}>Hedge</span>
            </CCol>
            <CCol className="d-flex">
                <CButton
                    color="danger"
                    className="float-start"
                    onClick={() => handleFlipPosition(ticket)}
                    style={{marginBottom: "3px"}}
                >
                    <CIcon icon={cilCropRotate}/>
                </CButton>
                <span style={{marginTop: "8px", marginLeft: "5px"}}>Flip</span>
            </CCol>
        </CRow>
    </>
);

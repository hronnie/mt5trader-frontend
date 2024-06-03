import React from 'react'
import {
    CBadge,
    CDropdown,
    CDropdownHeader,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CProgress,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {cilBasket, cilBell, cilChartPie, cilSpeedometer, cilUserFollow, cilUserUnfollow,} from '@coreui/icons'

const AppHeaderDropdownNotif = () => {
    const itemsCount = 5
    return (
        <CDropdown variant="nav-item" alignment="end">
            <CDropdownToggle caret={false}>
                <CIcon icon={cilBell} size="lg" className="my-1 mx-2"/>
                <CBadge
                    shape="rounded-pill"
                    color="danger-gradient"
                    className="position-absolute top-0 end-0"
                >
                    {itemsCount}
                </CBadge>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0">
                <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold rounded-top mb-2">
                    You have {itemsCount} notifications
                </CDropdownHeader>
                <CDropdownItem>
                    <CIcon icon={cilUserFollow} className="me-2 text-success"/> New user registered
                </CDropdownItem>
                <CDropdownItem>
                    <CIcon icon={cilUserUnfollow} className="me-2 text-danger"/> User deleted
                </CDropdownItem>
                <CDropdownItem>
                    <CIcon icon={cilChartPie} className="me-2 text-info"/> Sales report is ready
                </CDropdownItem>
                <CDropdownItem>
                    <CIcon icon={cilBasket} className="me-2 text-primary"/> New client
                </CDropdownItem>
                <CDropdownItem>
                    <CIcon icon={cilSpeedometer} className="me-2 text-warning"/> Server overloaded
                </CDropdownItem>
                <CDropdownHeader className="bg-body-secondary text-body-secondary fw-semibold my-2">
                    Server
                </CDropdownHeader>
                <CDropdownItem className="d-block py-2">
                    <div className="text-uppercase small fw-semibold mb-1">CPU Usage</div>
                    <CProgress thin color="info-gradient" value={25}/>
                    <div className="text-body-secondary small">348 Processes. 1/4 Cores.</div>
                </CDropdownItem>
                <CDropdownItem className="d-block py-2">
                    <div className="text-uppercase small fw-semibold mb-1">Memory Usage</div>
                    <CProgress thin color="warning-gradient" value={70}/>
                    <div className="text-body-secondary small">11444GB/16384MB</div>
                </CDropdownItem>
                <CDropdownItem className="d-block py-2">
                    <div className="text-uppercase small fw-semibold mb-1">SSD 1 Usage</div>
                    <CProgress thin color="danger-gradient" value={90}/>
                    <div className="text-body-secondary small">243GB/256GB</div>
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default AppHeaderDropdownNotif

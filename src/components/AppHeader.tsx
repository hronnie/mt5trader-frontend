import {useEffect, useRef} from 'react'
import {useDispatch} from 'react-redux'
import Link from 'next/link'

import {CContainer, CHeader, CHeaderNav, CHeaderToggler, CNavItem, CNavLink, useColorModes,} from '@coreui/react-pro'
import {cilMenu} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import {useTypedSelector} from './../store'

import {AppBreadcrumb} from '@/components'

const AppHeader = (): JSX.Element => {
    const headerRef = useRef<HTMLDivElement>(null)
    const {colorMode, setColorMode} = useColorModes('coreui-pro-next-js-admin-template-theme-default')

    const dispatch = useDispatch()
    const sidebarShow = useTypedSelector((state) => state.sidebarShow)
    const asideShow = useTypedSelector((state) => state.asideShow)

    useEffect(() => {
        document.addEventListener('scroll', () => {
            headerRef.current &&
            headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
        })
    }, [])

    return (
        <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
            <CContainer className="border-bottom px-4" fluid>
                <CHeaderToggler
                    onClick={() => dispatch({type: 'set', sidebarShow: !sidebarShow})}
                    style={{marginInlineStart: '-14px'}}
                >
                    <CIcon icon={cilMenu} size="lg"/>
                </CHeaderToggler>
                <CHeaderNav className="d-none d-md-flex">
                    <CNavItem>
                        <CNavLink href="/" as={Link}>
                            Dashboard
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink href="#">Users</CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink href="#">Settings</CNavLink>
                    </CNavItem>
                </CHeaderNav>
                <CHeaderNav className="d-none d-md-flex ms-auto">
                    {/*<AppHeaderDropdownNotif/>*/}
                    {/*<AppHeaderDropdownTasks/>*/}
                    {/*<AppHeaderDropdownMssg/>*/}
                </CHeaderNav>
                {/*<CHeaderNav className="ms-auto ms-md-0">*/}
                {/*    <li className="nav-item py-1">*/}
                {/*        <div className="vr h-100 mx-2 text-body text-opacity-75"></div>*/}
                {/*    </li>*/}
                {/*    <CDropdown variant="nav-item" placement="bottom-end">*/}
                {/*        <CDropdownToggle caret={false}>*/}
                {/*            {colorMode === 'dark' ? (*/}
                {/*                <CIcon icon={cilMoon} size="lg"/>*/}
                {/*            ) : colorMode === 'auto' ? (*/}
                {/*                <CIcon icon={cilContrast} size="lg"/>*/}
                {/*            ) : (*/}
                {/*                <CIcon icon={cilSun} size="lg"/>*/}
                {/*            )}*/}
                {/*        </CDropdownToggle>*/}
                {/*        <CDropdownMenu>*/}
                {/*            <CDropdownItem*/}
                {/*                active={colorMode === 'light'}*/}
                {/*                className="d-flex align-items-center"*/}
                {/*                as="button"*/}
                {/*                type="button"*/}
                {/*                onClick={() => setColorMode('light')}*/}
                {/*            >*/}
                {/*                <CIcon className="me-2" icon={cilSun} size="lg"/> Light*/}
                {/*            </CDropdownItem>*/}
                {/*            <CDropdownItem*/}
                {/*                active={colorMode === 'dark'}*/}
                {/*                className="d-flex align-items-center"*/}
                {/*                as="button"*/}
                {/*                type="button"*/}
                {/*                onClick={() => setColorMode('dark')}*/}
                {/*            >*/}
                {/*                <CIcon className="me-2" icon={cilMoon} size="lg"/> Dark*/}
                {/*            </CDropdownItem>*/}
                {/*            <CDropdownItem*/}
                {/*                active={colorMode === 'auto'}*/}
                {/*                className="d-flex align-items-center"*/}
                {/*                as="button"*/}
                {/*                type="button"*/}
                {/*                onClick={() => setColorMode('auto')}*/}
                {/*            >*/}
                {/*                <CIcon className="me-2" icon={cilContrast} size="lg"/> Auto*/}
                {/*            </CDropdownItem>*/}
                {/*        </CDropdownMenu>*/}
                {/*    </CDropdown>*/}
                {/*    <li className="nav-item py-1">*/}
                {/*        <div className="vr h-100 mx-2 text-body text-opacity-75"></div>*/}
                {/*    </li>*/}
                {/*    <AppHeaderDropdown/>*/}
                {/*</CHeaderNav>*/}
                {/*<CHeaderToggler*/}
                {/*    onClick={() => dispatch({type: 'set', asideShow: !asideShow})}*/}
                {/*    style={{marginInlineEnd: '-12px'}}*/}
                {/*>*/}
                {/*    <CIcon icon={cilApplicationsSettings} size="lg"/>*/}
                {/*</CHeaderToggler>*/}
            </CContainer>
            <CContainer className="px-4" fluid>
                <AppBreadcrumb/>
            </CContainer>
        </CHeader>
    )
}

export default AppHeader

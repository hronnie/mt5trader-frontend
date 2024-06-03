import React from 'react'
import Link from 'next/link'
import {useDispatch} from 'react-redux'
import {useTypedSelector} from './../store'
import {
    CCloseButton, CImage,
    CSidebar,
    CSidebarBrand,
    CSidebarFooter,
    CSidebarHeader,
    CSidebarToggler,
} from '@coreui/react-pro'

import AppSidebarNav from './AppSidebarNav'


// sidebar nav config
import navigation from '../_nav'

const AppSidebar = (): JSX.Element => {
    const dispatch = useDispatch()
    const unfoldable = useTypedSelector((state) => state.sidebarUnfoldable)
    const sidebarShow = useTypedSelector((state) => state.sidebarShow)

    return (
        <CSidebar
            className="border-end"
            colorScheme="dark"
            position="fixed"
            unfoldable={unfoldable}
            visible={sidebarShow}
            onVisibleChange={(visible) => {
                dispatch({type: 'set', sidebarShow: visible})
            }}
        >
            <CSidebarHeader className="border-bottom">
                <CSidebarBrand as={Link} href="/">
                    <CImage src= '/images/main_logo.jpeg' height={75}/>
                    <span style={{marginLeft: "15px"}}>MT5 Trader</span>
                </CSidebarBrand>
                <CCloseButton
                    className="d-lg-none"
                    dark
                    onClick={() => dispatch({type: 'set', sidebarShow: false})}
                />
            </CSidebarHeader>
            <AppSidebarNav items={navigation}/>
            <CSidebarFooter className="border-top d-none d-lg-flex">
                <CSidebarToggler
                    onClick={() => dispatch({type: 'set', sidebarUnfoldable: !unfoldable})}
                />
            </CSidebarFooter>
        </CSidebar>
    )
}

export default React.memo(AppSidebar)

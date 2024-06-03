import React, {ElementType} from 'react'
import {cilDrop, cilGem, cilPuzzle, cilSpeedometer,} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {CNavGroup, CNavItem, CNavTitle} from '@coreui/react-pro'

export type Badge = {
    color: string
    text: string
}

export type NavItem = {
    component: string | ElementType
    name: string | JSX.Element
    icon?: string | JSX.Element
    badge?: Badge
    href?: string
    items?: NavItem[]
}

const _nav = [
    {
        component: CNavItem,
        name: 'Dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon"/>,
        href: '/',
    },
    {
        component: CNavTitle,
        name: 'Trade',
    },
    {
        component: CNavItem,
        name: 'Trade',
        href: '/trade',
        icon: <CIcon icon={cilDrop} customClassName="nav-icon"/>,
    },
    {
        component: CNavTitle,
        name: 'Settings',
    },
    {
        component: CNavItem,
        name: 'Settings',
        href: '/settings',
        icon: <CIcon icon={cilGem} customClassName="nav-icon"/>,
    },

]

export default _nav

import React, {ElementType} from 'react'
import {
    cilChartLine,
    cilDrop,
    cilGem,
    cilIndentIncrease,
    cilNewspaper,
    cilSettings,
    cilSpeedometer,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {CNavItem, CNavTitle} from '@coreui/react-pro'

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
        icon: <CIcon icon={cilChartLine} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'Positions',
        href: '/positions',
        icon: <CIcon icon={cilIndentIncrease} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'News',
        href: '/news',
        icon: <CIcon icon={cilNewspaper} customClassName="nav-icon"/>,
    },
    {
        component: CNavTitle,
        name: 'Settings',
    },
    {
        component: CNavItem,
        name: 'Settings',
        href: '/settings',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon"/>,
    },

]

export default _nav

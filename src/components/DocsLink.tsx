import React from 'react'
import {CLink} from '@coreui/react-pro'

const DocsLink = (props: {
    href: string
    name?: string
    text?: string
}) => {
    const {href, name, text, ...rest} = props

    const _href = name ? `https://coreui.io/react/docs/components/${name}` : href

    return (
        <div className="float-end">
            <CLink
                {...rest}
                href={_href}
                rel="noreferrer noopener"
                target="_blank"
                className="card-header-action"
            >
                <small className="text-medium-emphasis">{text || 'docs'}</small>
            </CLink>
        </div>
    )
}

export default React.memo(DocsLink)

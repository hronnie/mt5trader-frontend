import React from 'react'

import {CFooter} from '@coreui/react-pro'

const AppFooter = () => {
    return (
        <CFooter>
            <div>
                <span className="ms-1">&copy; 2024 EasyPeasy Code.</span>
            </div>
            <div className="ms-auto">
                <span className="me-1">Powered by</span>
                <a
                    href="https://aronharsfalvi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Aron Harsfalvi
                </a>
            </div>
        </CFooter>
    )
}

export default React.memo(AppFooter)

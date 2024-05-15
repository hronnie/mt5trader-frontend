import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import './layout.css';
import Header from './header';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <html>
            <body>
                <div>
                    <Header/>
                    <div className="d-flex">
                        <div className="sidebar bg-dark text-white p-3">
                            <div className="sidebar-header d-flex align-items-center mb-3">
                                <h2 className="sidebar-brand mb-0">MetaTrader 5 Trader</h2>
                            </div>
                            <div className="sidebar-header d-flex align-items-center mb-3">
                                <img src="/mt5trader-icon.webp" alt="MetaTrader 5 Trader" className="sidebar-logo me-2"/>
                            </div>
                            <nav className="nav flex-column">
                                <a className="nav-link text-white" href="#">Dashboards</a>
                                <a className="nav-link text-white" href="#">Trade</a>
                                <a className="nav-link text-white" href="#">Settings</a>
                            </nav>
                        </div>
                        <div className="content flex-grow-1 p-4">
                            {children}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
};

export default Layout;

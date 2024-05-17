import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

const Sidebar: React.FC = () => {
    return (
        <div className="d-flex">
            <div className="sidebar bg-dark text-white p-3">
                <div className="sidebar-header d-flex align-items-center mb-3">
                    <h2 className="sidebar-brand mb-0">MetaTrader 5 Trader</h2>
                </div>
                <div className="sidebar-header d-flex align-items-center mb-3">
                    {/*<img src="/mt5trader-icon.webp" alt="MetaTrader 5 Trader" className="sidebar-logo me-2"/>*/}
                </div>
                <nav className="nav flex-column">
                    <Link className="nav-link text-white" href="/pages/dashboard">
                        Dashboard
                    </Link>
                    <Link className="nav-link text-white" href="/pages/trade">
                        Trade
                    </Link>
                    <Link className="nav-link text-white" href="/pages/settings">
                        Settings
                    </Link>
                </nav>
            </div>

        </div>
    );
};

export default Sidebar;

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar: React.FC = () => {
    return (
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

        </div>
    );
};

export default Sidebar;

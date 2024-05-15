import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header: React.FC = () => {
    return (
        <header className="header bg-light p-3 mb-4">
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="h3">MetaTrader 5 Trader Dashboard</h1>
                    <div className="user-info d-flex align-items-center">
                        <img
                            src="/path-to-user-avatar.jpg"
                            alt="User Avatar"
                            className="rounded-circle me-2"
                            style={{ width: '40px', height: '40px' }}
                        />
                        <span>John Doe</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

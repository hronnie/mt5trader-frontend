import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import './layout.css';
import Header from './layout/header/header';
import Sidebar from "@/app/layout/sidebar/sidebar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <html>
            <body>
                <div>
                    <Header/>
                    <Sidebar/>
                </div>
            </body>
        </html>
    );
};

export default Layout;

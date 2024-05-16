import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import './layout.css';
import Header from '@/app/layout/header/header';
import Sidebar from "@/app/layout/sidebar/sidebar";
import Link from "next/link";

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
                <main>
                    <div className="content flex-grow-1 p-4">
                        {children}
                    </div>

                </main>
            </div>
            </body>
        </html>
    );
};

export default Layout;

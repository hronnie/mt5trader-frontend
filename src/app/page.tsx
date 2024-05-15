import React from 'react';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to My Next.js App</h1>
            <p>This is a simple Next.js app with a sidebar layout.</p>
            <div className="alert alert-primary" role="alert">
                A simple primary alert—check it out!
            </div>
            <div className="alert alert-secondary" role="alert">
                A simple secondary alert—check it out!
            </div>
            <div className="alert alert-success" role="alert">
                A simple success alert—check it out!
            </div>
            <div className="alert alert-danger" role="alert">
                A simple danger alert—check it out!
            </div>
        </div>
    );
};

export default Home;

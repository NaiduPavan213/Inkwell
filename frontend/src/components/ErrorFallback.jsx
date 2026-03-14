import React from 'react';

function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div className="error-fallback-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24'
        }}>
            <h1>Oops! Something went wrong.</h1>
            <p style={{ margin: '10px 0', fontWeight: 'bold' }}>{error.message}</p>
            <button
                onClick={resetErrorBoundary}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#721c24',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '20px'
                }}
            >
                Try again
            </button>
        </div>
    );
}

export default ErrorFallback;

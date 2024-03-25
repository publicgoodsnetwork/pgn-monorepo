import React from 'react';

// Define the props type to include an onClose function
interface AlertBannerProps {
    message: string;
    onClose: () => void; // Add this line
}

const AlertBanner: React.FC<AlertBannerProps> = ({ message, onClose }) => {
    return (
        <div style={{ backgroundColor: '#ffcc00', padding: '10px', position: 'relative', textAlign: 'center', fontSize: '14px' }}>
            {message}
            <button
                onClick={onClose} // Use the onClose prop here
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
            >
                ×
            </button>
        </div>
    );
};

export default AlertBanner;
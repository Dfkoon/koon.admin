import React from 'react';
import './GlassCard.css';

/**
 * GlassCard - Reusable glass-morphism card component
 * Matches the design system from the main website
 */
const GlassCard = ({
    children,
    className = '',
    hover = true,
    onClick,
    ...props
}) => {
    return (
        <div
            className={`glass-card ${hover ? 'glass-card-hover' : ''} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

// Sub-components for structured content
GlassCard.Header = ({ children, className = '' }) => (
    <div className={`glass-card-header ${className}`}>
        {children}
    </div>
);

GlassCard.Body = ({ children, className = '' }) => (
    <div className={`glass-card-body ${className}`}>
        {children}
    </div>
);

GlassCard.Footer = ({ children, className = '' }) => (
    <div className={`glass-card-footer ${className}`}>
        {children}
    </div>
);

export default GlassCard;

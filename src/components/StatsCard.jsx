import React from 'react';
import './StatsCard.css';

/**
 * StatsCard - Display statistics with icon and value
 * Used in Dashboard for quick metrics
 */
const StatsCard = ({
    icon,
    title,
    value,
    change,
    changeType = 'positive', // positive, negative, neutral
    color = 'primary'
}) => {
    const getChangeIcon = () => {
        if (changeType === 'positive') return '📈';
        if (changeType === 'negative') return '📉';
        return '➡️';
    };

    const getChangeClass = () => {
        if (changeType === 'positive') return 'stats-change-positive';
        if (changeType === 'negative') return 'stats-change-negative';
        return 'stats-change-neutral';
    };

    return (
        <div className={`stats-card stats-card-${color} fade-in`}>
            <div className="stats-icon">{icon}</div>
            <div className="stats-content">
                <h3 className="stats-title">{title}</h3>
                <div className="stats-value">{value}</div>
                {change && (
                    <div className={`stats-change ${getChangeClass()}`}>
                        <span className="change-icon">{getChangeIcon()}</span>
                        <span className="change-text">{change}</span>
                    </div>
                )}
            </div>
            {/* Ambient Background Glow for Innovation feel */}
            <div className="card-glow"></div>
        </div>
    );
};

export default StatsCard;

import React from 'react';
import Badge from '../common/Badge';
import { priorityClass } from '../../utils/helpers';

const AIRiskCard = ({ riskScore, priority, reasons = [] }) => {
  const variant = priorityClass(priority);

  return (
    <div className={`fb-ai-risk fb-ai-risk--${variant}`}>
      <div className="fb-ai-risk__header">
        <span className="fb-ai-risk__label">🤖 AI ANALYSIS</span>
        <Badge variant={variant}>{priority} SURPLUS RISK</Badge>
      </div>

      <div className="fb-ai-risk__score-wrap">
        <div className="fb-ai-risk__score">{riskScore}%</div>
        <div className="fb-ai-risk__ring-wrap">
          <svg viewBox="0 0 36 36" className="fb-ai-risk__ring">
            <path
              className="fb-ai-risk__ring-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`fb-ai-risk__ring-fill fb-ai-risk__ring-fill--${variant}`}
              strokeDasharray={`${riskScore}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
      </div>

      {reasons.length > 0 && (
        <div className="fb-ai-risk__reasons">
          <p className="fb-ai-risk__why">Why?</p>
          <ul>
            {reasons.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIRiskCard;

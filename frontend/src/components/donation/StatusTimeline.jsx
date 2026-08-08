import React from 'react';

const STEPS = [
  { key: 'SUBMITTED', label: 'Submitted', level: 0 },
  { key: 'NEED_MATCHED', label: 'Need Matched', level: 1 },
  { key: 'PICKED_UP', label: 'Picked Up', level: 2 },
  { key: 'COMPLETED', label: 'Completed', level: 3 },
];

/**
 * Maps database status string to step level (0 to 3)
 */
const getStatusLevel = (status) => {
  if (!status) return 0;
  const s = status.toUpperCase();

  if (s === 'AVAILABLE') return 0;
  if (s === 'PENDING_ACCEPTANCE') return 0.5; // Offer sent, waiting acceptance
  if (s === 'MATCHED' || s === 'ACCEPTED') return 1; // Receiver accepted -> Need Matched done!
  if (s === 'PICKUP_SCHEDULED' || s === 'PICKED_UP') return 2; // Picked Up done!
  if (s === 'COMPLETED') return 3; // Completed done!
  return 0;
};

const StatusTimeline = ({ status }) => {
  const currentLevel = getStatusLevel(status);

  return (
    <div className="fb-timeline">
      {STEPS.map((step, idx) => {
        const isDone = step.level <= currentLevel;

        return (
          <div
            key={step.key}
            className={`fb-timeline__step ${isDone ? 'done' : ''}`}
          >
            <div className="fb-timeline__dot">
              {isDone ? '✓' : '○'}
            </div>
            <span className="fb-timeline__label">{step.label}</span>
            {idx < STEPS.length - 1 && (
              <div className={`fb-timeline__line ${step.level < currentLevel ? 'done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;

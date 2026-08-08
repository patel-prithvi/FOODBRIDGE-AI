import React from 'react';

const STEPS = [
  { key: 'AVAILABLE', label: 'Submitted' },
  { key: 'MATCHED', label: 'AI Matched' },
  { key: 'ACCEPTED', label: 'Receiver Accepted' },
  { key: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled' },
  { key: 'PICKED_UP', label: 'Picked Up' },
  { key: 'COMPLETED', label: 'Completed' },
];

const ORDER = ['AVAILABLE', 'MATCHED', 'ACCEPTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'COMPLETED'];

const StatusTimeline = ({ status }) => {
  const currentIdx = ORDER.indexOf(status);

  return (
    <div className="fb-timeline">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const current = idx === currentIdx;
        return (
          <div key={step.key} className={`fb-timeline__step ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
            <div className="fb-timeline__dot">
              {done ? '✓' : current ? '●' : '○'}
            </div>
            <span className="fb-timeline__label">{step.label}</span>
            {idx < STEPS.length - 1 && <div className={`fb-timeline__line ${done ? 'done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;

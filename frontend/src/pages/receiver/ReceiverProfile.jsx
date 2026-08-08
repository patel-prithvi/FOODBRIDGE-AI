import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';

const ReceiverProfile = () => {
  const { user } = useAuth();

  return (
    <div className="fb-profile">
      <div className="fb-page-header">
        <h1>Receiver Profile</h1>
        <p className="fb-page-header__subtitle">Your organization information</p>
      </div>

      <div className="fb-profile__card">
        <div className="fb-profile__avatar">🏢</div>
        <div className="fb-profile__info">
          <Badge variant="receiver">RECEIVER</Badge>
          <h2>{user?.organizationName}</h2>
          <p className="fb-muted">{user?.email}</p>
        </div>
      </div>

      <div className="fb-profile__grid">
        <div className="fb-detail-card">
          <h3>Contact Details</h3>
          <div className="fb-detail-row"><span>Contact Person</span><strong>{user?.contactPerson}</strong></div>
          <div className="fb-detail-row"><span>Email</span><strong>{user?.email}</strong></div>
          <div className="fb-detail-row"><span>Phone</span><strong>{user?.phone}</strong></div>
        </div>
        <div className="fb-detail-card">
          <h3>Organization</h3>
          <div className="fb-detail-row">
            <span>Verification</span>
            <Badge variant={user?.verificationStatus === 'VERIFIED' ? 'success' : 'pending'}>
              {user?.verificationStatus || 'PENDING'}
            </Badge>
          </div>
          <div className="fb-detail-row"><span>Location</span><strong>{user?.location?.address}, {user?.location?.city}</strong></div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverProfile;

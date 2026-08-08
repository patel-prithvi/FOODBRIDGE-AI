import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';

const DonorProfile = () => {
  const { user } = useAuth();

  return (
    <div className="fb-profile">
      <div className="fb-page-header">
        <h1>Donor Profile</h1>
        <p className="fb-page-header__subtitle">Your account information</p>
      </div>

      <div className="fb-profile__card">
        <div className="fb-profile__avatar">🏪</div>
        <div className="fb-profile__info">
          <Badge variant="donor">DONOR</Badge>
          <h2>{user?.organizationName}</h2>
          <p className="fb-muted">{user?.email}</p>
        </div>
      </div>

      <div className="fb-profile__grid">
        <div className="fb-detail-card">
          <h3>Contact Details</h3>
          <div className="fb-detail-row"><span>Contact Name</span><strong>{user?.name}</strong></div>
          <div className="fb-detail-row"><span>Email</span><strong>{user?.email}</strong></div>
          <div className="fb-detail-row"><span>Phone</span><strong>{user?.phone}</strong></div>
        </div>
        <div className="fb-detail-card">
          <h3>Location</h3>
          <div className="fb-detail-row"><span>Address</span><strong>{user?.location?.address}</strong></div>
          <div className="fb-detail-row"><span>City</span><strong>{user?.location?.city}</strong></div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;

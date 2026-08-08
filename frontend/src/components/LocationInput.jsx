import React, { useState } from 'react';
import { getCurrentCoordinates, reverseGeocode, forwardGeocode } from '../services/locationService';

export const LocationInput = ({ locationData, onChangeLocation }) => {
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(Boolean(locationData?.lat && locationData?.lng));
  const [errorMsg, setErrorMsg] = useState('');
  const [manualMode, setManualMode] = useState(false);

  const handleDetectLocation = async () => {
    setDetecting(true);
    setErrorMsg('');

    try {
      // 1. Get browser GPS coordinates
      const coords = await getCurrentCoordinates();

      // 2. Reverse geocode coordinates to readable address and city
      const geoResult = await reverseGeocode(coords.lat, coords.lng);

      // 3. Update parent form state
      onChangeLocation({
        address: geoResult.address,
        city: geoResult.city,
        lat: geoResult.lat,
        lng: geoResult.lng,
      });

      setDetected(true);
      setManualMode(false);
    } catch (err) {
      console.error('[Location Detection Error]', err);
      setErrorMsg(err.message || 'Unable to detect location. Please enter manually.');
      setDetected(false);
    } finally {
      setDetecting(false);
    }
  };

  const handleManualChange = async (field, value) => {
    const updated = { ...locationData, [field]: value };
    onChangeLocation(updated);

    // Perform forward geocoding on address & city edit if both fields have content
    if (updated.address?.trim() && updated.city?.trim()) {
      const coords = await forwardGeocode(updated.address, updated.city);
      if (coords) {
        onChangeLocation({
          ...updated,
          lat: coords.lat,
          lng: coords.lng,
        });
      }
    }
  };

  return (
    <div className="location-section-container">
      <div className="location-section-header">
        <label className="location-section-title">📍 Location Information *</label>
        <span className="location-help-text">
          Your location helps FoodBridge find suitable nearby food connections.
        </span>
      </div>

      {errorMsg && (
        <div className="form-alert error location-error">
          <span>{errorMsg}</span>
          <button
            type="button"
            className="btn-link-sm"
            onClick={() => setManualMode(true)}
          >
            Enter Manually
          </button>
        </div>
      )}

      {/* DETECT LOCATION BUTTON */}
      <div className="location-actions-bar">
        <button
          type="button"
          className={`btn-location-detect ${detected ? 'success' : ''}`}
          onClick={handleDetectLocation}
          disabled={detecting}
        >
          {detecting
            ? '⏳ Detecting Location...'
            : detected
            ? '✓ Location Detected (Click to Re-detect)'
            : '📍 Use My Current Location'}
        </button>

        <button
          type="button"
          className="btn-toggle-manual"
          onClick={() => setManualMode(!manualMode)}
        >
          {manualMode ? 'Hide Manual Edit' : '✏️ Edit / Enter Manually'}
        </button>
      </div>

      {/* READABLE DETECTED LOCATION SUMMARY CARD */}
      {detected && !manualMode && (
        <div className="location-preview-card">
          <div className="preview-icon">📍</div>
          <div className="preview-details">
            <span className="preview-city">{locationData.city || 'Detected City'}</span>
            <span className="preview-address">{locationData.address || 'Detected Address'}</span>
            <div className="preview-coords">
              <span>Lat: {locationData.lat}</span>
              <span>Lng: {locationData.lng}</span>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL LOCATION INPUT FALLBACK & EDIT FORM */}
      {(manualMode || (!detected && !detecting)) && (
        <div className="manual-location-grid">
          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              placeholder="e.g. Ahmedabad"
              value={locationData.city || ''}
              onChange={(e) => handleManualChange('city', e.target.value)}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Street Address *</label>
            <input
              type="text"
              placeholder="e.g. 102 MG Road, Satellite"
              value={locationData.address || ''}
              onChange={(e) => handleManualChange('address', e.target.value)}
              required
            />
          </div>

          <div className="coords-display-row">
            <span className="coords-badge">
              Captured Coordinates: {locationData.lat && locationData.lng ? `${locationData.lat}, ${locationData.lng}` : 'Pending detection / geocoding'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

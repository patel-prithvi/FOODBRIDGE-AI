import React from 'react';

const Loader = ({ text = 'Loading...' }) => (
  <div className="fb-loader">
    <div className="fb-loader__spinner" />
    <p className="fb-loader__text">{text}</p>
  </div>
);

export default Loader;

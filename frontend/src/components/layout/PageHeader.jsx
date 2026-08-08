import React from 'react';

const PageHeader = ({ title, subtitle, actions }) => (
  <div className="fb-page-header">
    <div className="fb-page-header__text">
      <h1 className="fb-page-header__title">{title}</h1>
      {subtitle && <p className="fb-page-header__subtitle">{subtitle}</p>}
    </div>
    {actions && <div className="fb-page-header__actions">{actions}</div>}
  </div>
);

export default PageHeader;

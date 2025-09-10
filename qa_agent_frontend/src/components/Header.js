import React from 'react';

/**
 * Header: minimal sticky header with brand and subtitle.
 */
export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand-mark" aria-hidden="true" />
        <div className="title-wrap">
          <h1 className="app-title">Product Support Q&A</h1>
          <p className="app-subtitle">Concise answers for features, troubleshooting, pricing, and warranty</p>
        </div>
      </div>
    </header>
  );
}

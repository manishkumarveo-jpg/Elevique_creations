'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="ft-footer">
      <div className="ft-container">
        {/* Rounded container with top border gradient */}
        <div className="ft-card">
          {/* Top center glow */}
          <div className="ft-glow-line" />
          <div className="ft-glow-radial" />

          {/* Layout Grid: Logo/Copyright on the left, columns on the right */}
          <div className="ft-content">

            {/* Left Side: Logo and Copyright */}
            <div className="ft-left">
              <div className="ft-logo">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="9" x2="20" y2="9"></line>
                  <line x1="4" y1="15" x2="20" y2="15"></line>
                  <line x1="10" y1="3" x2="8" y2="21"></line>
                  <line x1="16" y1="3" x2="14" y2="21"></line>
                </svg>
              </div>
              <p className="ft-copyright">
                © 2026 Asme. All rights reserved.
              </p>
            </div>

            {/* Right Side: Links Columns Grid */}
            <div className="ft-right">
              {/* Product */}
              <div className="ft-col">
                <h3 className="ft-title">
                  Product
                </h3>
                <ul className="ft-list" role="list">
                  <li>
                    <a
                      href="#features"
                      className="ft-link"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="ft-link"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#testimonials"
                      className="ft-link"
                    >
                      Testimonials
                    </a>
                  </li>
                  <li>
                    <a
                      href="#integration"
                      className="ft-link"
                    >
                      Integration
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div className="ft-col">
                <h3 className="ft-title">
                  Company
                </h3>
                <ul className="ft-list" role="list">
                  <li>
                    <a
                      href="#faqs"
                      className="ft-link"
                    >
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      className="ft-link"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#privacy"
                      className="ft-link"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#terms"
                      className="ft-link"
                    >
                      Terms of Services
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div className="ft-col">
                <h3 className="ft-title">
                  Resources
                </h3>
                <ul className="ft-list" role="list">
                  <li>
                    <a
                      href="#blog"
                      className="ft-link"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#changelog"
                      className="ft-link"
                    >
                      Changelog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#brand"
                      className="ft-link"
                    >
                      Brand
                    </a>
                  </li>
                  <li>
                    <a
                      href="#help"
                      className="ft-link"
                    >
                      Help
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social Links */}
              <div className="ft-col">
                <h3 className="ft-title">
                  Social Links
                </h3>
                <ul className="ft-list" role="list">
                  <li>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ft-link"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ft-link"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ft-link"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
                      </svg>
                      Youtube
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ft-link"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}


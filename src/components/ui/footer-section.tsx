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
                  <li>
                    <a
                      href="https://wa.me/917217832613"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ft-link"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.69-3.146c-.202-.101-1.202-.593-1.385-.658-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.202-.493 1.37-.967.165-.473.165-.88.115-.967-.049-.088-.182-.133-.381-.233"/>
                      </svg>
                      WhatsApp
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


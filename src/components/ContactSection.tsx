"use client";

import { useState } from "react";
import { MessageSquareMore, Phone, Mail, CheckCircle } from "lucide-react";

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    setIsSubmitting(false);
    setIsSent(true);
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <section className="ct-section" id="contact" aria-labelledby="contact-heading">
      {/* Background patterns */}
      <div className="ct-grid-overlay" aria-hidden="true" />
      <div className="ct-bloom" aria-hidden="true" />

      <div className="ct-container">
        <div className="ct-grid">
          {/* Left Column: Content Details */}
          <div className="ct-left">
            <span className="ct-eyebrow">Get in touch with us</span>
            <h2 className="ct-heading" id="contact-heading">
              Let’s create your ideas into reality
            </h2>

            <ul className="ct-details" role="list">
              {/* Ready for coffee */}
              <li className="ct-detail" role="listitem">
                <div className="ct-detail-icon">
                  <MessageSquareMore size={20} strokeWidth={1.5} />
                </div>
                <div className="ct-detail-content">
                  <h3 className="ct-detail-title">Ready for some coffee?</h3>
                  <span className="ct-detail-text">401 Broadway, 24th floor</span>
                  <span className="ct-detail-text">Church View, London</span>
                </div>
              </li>

              {/* Don't hesitate to reach out */}
              <li className="ct-detail" role="listitem">
                <div className="ct-detail-icon">
                  <Phone size={20} strokeWidth={1.5} />
                </div>
                <div className="ct-detail-content">
                  <h3 className="ct-detail-title">Don&apos;t hesitate to reach out!</h3>
                  <span className="ct-detail-text">Phone : 310-2568-4578</span>
                  <span className="ct-detail-text">Fax : 310-1298-4836</span>
                </div>
              </li>

              {/* How can we assist */}
              <li className="ct-detail" role="listitem">
                <div className="ct-detail-icon">
                  <Mail size={20} strokeWidth={1.5} />
                </div>
                <div className="ct-detail-content">
                  <h3 className="ct-detail-title">How can we assist you?</h3>
                  <span className="ct-detail-text">johndoe@gmail.com</span>
                  <span className="ct-detail-text">smithjohn@gmail.com</span>
                </div>
              </li>
            </ul>

            <div className="ct-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="ct-social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="ct-social-btn" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="ct-social-btn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="ct-social-btn" aria-label="GitHub">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="ct-form-wrap">
            {isSent ? (
              <div className="ct-success">
                <div className="ct-success-icon">
                  <CheckCircle size={56} strokeWidth={1.2} />
                </div>
                <h3 className="ct-success-title">Message Sent!</h3>
                <p className="ct-success-body">
                  Thank you for reaching out. We have received your message and will get back to you shortly.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="ct-submit"
                  style={{ width: "auto", paddingLeft: "2rem", paddingRight: "2rem" }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="ct-form">
                <h3 className="ct-success-title" style={{ textAlign: "left", marginBottom: "0.5rem" }}>
                  Say hello!
                </h3>

                <div className="ct-field">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Enter your name here.."
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  />
                </div>

                <div className="ct-field">
                  <label htmlFor="emailAddress">Your Email</label>
                  <input
                    id="emailAddress"
                    type="email"
                    required
                    placeholder="Enter your email here..."
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  />
                </div>

                <div className="ct-field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Enter your message"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="ct-submit">
                  {isSubmitting ? "Sending..." : "Send Inquiry"}
                </button>

                <p className="ct-disclaimer">
                  I understand that my data will be hold securely in accordance with the{" "}
                  <a href="#privacy">privacy policy</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

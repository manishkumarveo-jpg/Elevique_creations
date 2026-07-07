"use client";

import { useState } from "react";
import { MessageSquareMore, Phone, Mail, CheckCircle } from "lucide-react";
import { LocationMap } from "@/website/components/ui/LocationMap";
import { BorderBeam } from "@/website/components/ui/border-beam";
import { ScrollReveal } from "@/website/components/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/website/components/StaggerGroup";

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to send");
      setIsSent(true);
      setFormState({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      alert("Failed to send message. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="ct-section" id="contact" aria-labelledby="contact-heading">
      {/* Background patterns */}
      <div className="ct-grid-overlay" aria-hidden="true" />
      <div className="ct-bloom" aria-hidden="true" />

      <div className="ct-container">
        <div className="ct-grid">
          {/* Left Column: Content Details */}
          <ScrollReveal direction="left" className="ct-left">
            <span className="ct-eyebrow">Get in touch with us</span>
            <h2 className="ct-heading" id="contact-heading">
              Let’s create your ideas into reality
            </h2>

            <StaggerContainer margin="-5% 0px">
              <ul className="ct-details" role="list">
                {/* Ready for coffee */}
                <StaggerItem direction="up">
                  <li className="ct-detail" role="listitem">
                    <div className="ct-detail-icon">
                      <MessageSquareMore size={20} strokeWidth={1.5} />
                    </div>
                    <div className="ct-detail-content">
                      <h3 className="ct-detail-title">Ready for some coffee?</h3>
                      <span className="ct-detail-text">Elevique creations</span>
                      <span className="ct-detail-text">Vishwakarma colony, Pul Pehladpur ,New delhi 110044</span>
                    </div>
                  </li>
                </StaggerItem>

                {/* Don't hesitate to reach out */}
                <StaggerItem direction="up">
                  <li className="ct-detail" role="listitem">
                    <div className="ct-detail-icon">
                      <Phone size={20} strokeWidth={1.5} />
                    </div>
                    <div className="ct-detail-content">
                      <h3 className="ct-detail-title">Don&apos;t hesitate to reach out!</h3>
                      <span className="ct-detail-text">Phone : +91 7217832613</span>
                      <span className="ct-detail-text">
                        WhatsApp:{" "}
                        <a
                          href="https://wa.me/917217832613"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ct-inline-link"
                        >
                          +91 7217832613
                        </a>
                      </span>
                    </div>
                  </li>
                </StaggerItem>

                {/* How can we assist */}
                <StaggerItem direction="up">
                  <li className="ct-detail" role="listitem">
                    <div className="ct-detail-icon">
                      <Mail size={20} strokeWidth={1.5} />
                    </div>
                    <div className="ct-detail-content">
                      <h3 className="ct-detail-title">How can we assist you?</h3>
                      <span className="ct-detail-text">eleviquecreations.ai@gmail.com</span>
                    </div>
                  </li>
                </StaggerItem>
              </ul>
            </StaggerContainer>

            <div className="ct-map-wrapper">
              <LocationMap
                location="Vishwakarma colony, Pul Pehladpur, New Delhi 110044"
                coordinates="28.4978° N, 77.2947° E"
                mapUrl="https://www.google.com/maps/search/?api=1&query=Vishwakarma+Colony+Pul+Pehladpur+New+Delhi+110044"
              />
            </div>
          </ScrollReveal>

          {/* Right Column: Contact Form */}
          <ScrollReveal direction="right" delay={0.15} className="ct-form-wrap">
            <BorderBeam
              size={120}
              duration={20}
              colorFrom="#14b8a6"
              colorTo="#5eead4"
              style={{ filter: "drop-shadow(0 0 16px #14b8a6) drop-shadow(0 0 32px #14b8a6)" }}
            />
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
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="ct-submit"
                  style={{ width: "auto", paddingLeft: "2rem", paddingRight: "2rem" }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <StaggerContainer>
                <form onSubmit={handleSubmit} className="ct-form">
                  <StaggerItem direction="up">
                    <h3 className="ct-success-title" style={{ textAlign: "left", marginBottom: "0.5rem" }}>
                      Say hello!
                    </h3>
                  </StaggerItem>

                  <StaggerItem direction="up">
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
                  </StaggerItem>

                  <StaggerItem direction="up">
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
                  </StaggerItem>

                  <StaggerItem direction="up">
                    <div className="ct-field">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number here..."
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      />
                    </div>
                  </StaggerItem>

                  <StaggerItem direction="up">
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
                  </StaggerItem>

                  <StaggerItem direction="up">
                    <button type="submit" disabled={isSubmitting} className="ct-submit">
                      {isSubmitting ? "Sending..." : "Send Inquiry"}
                    </button>
                  </StaggerItem>

                  <StaggerItem direction="up">
                    <p className="ct-disclaimer">
                      I understand that my data will be hold securely in accordance with the{" "}
                      <a href="#privacy">privacy policy</a>
                    </p>
                  </StaggerItem>
                </form>
              </StaggerContainer>
            )}
          </ScrollReveal>
        </div>

        <div className="ct-socials">
          <a href="https://www.instagram.com/eleviquecreations/" target="_blank" rel="noopener noreferrer" className="ct-social-btn" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          <a href="https://www.linkedin.com/in/elevique-creations-8794b9385/" target="_blank" rel="noopener noreferrer" className="ct-social-btn" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href="https://wa.me/917217832613" target="_blank" rel="noopener noreferrer" className="ct-social-btn" aria-label="WhatsApp">
            <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.69-3.146c-.202-.101-1.202-.593-1.385-.658-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.202-.493 1.37-.967.165-.473.165-.88.115-.967-.049-.088-.182-.133-.381-.233" />
            </svg>
          </a>
          {/* <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="ct-social-btn" aria-label="GitHub">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a> */}
        </div>
      </div>
    </section>
  );
}

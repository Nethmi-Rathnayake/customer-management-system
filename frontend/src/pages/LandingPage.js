import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const FEATURES = [
  {
    icon: <BoltIcon />,
    title: 'Lightning Fast',
    desc: 'Built on Spring Boot with optimized database queries for real-time data retrieval.',
  },
  {
    icon: <ExcelIcon />,
    title: 'Bulk Upload',
    desc: 'Process up to 1,000,000 records using our streaming Excel processor.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Secure',
    desc: 'Enterprise-grade security with MariaDB and encrypted data storage.',
  },
  {
    icon: <ChartIcon />,
    title: 'Analytics',
    desc: 'Visual dashboards to track customer growth and engagement metrics.',
  },
  {
    icon: <CodeIcon />,
    title: 'Open Source',
    desc: 'Get full access to the backend Java source code and frontend React implementation.',
  },
  {
    icon: <FamilyIcon />,
    title: 'Family Relations',
    desc: 'Advanced self-referencing database structure for linking family members.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="landing">
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav className={`lnav ${scrolled ? 'lnav--scrolled' : ''}`}>
        <div className="lnav-inner">
          <div className="lnav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="lnav-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="#2563EB"/>
                <path d="M6 8h12M6 12h8M6 16h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="lnav-brand-name">NexusCRM</span>
          </div>

          <div className={`lnav-links ${mobileOpen ? 'open' : ''}`}>
            <a href="#features" className="lnav-link" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#about" className="lnav-link" onClick={() => setMobileOpen(false)}>About</a>
            <a href="#contact" className="lnav-link" onClick={() => setMobileOpen(false)}>Contact</a>
          </div>

          <div className="lnav-actions">
            <button className="btn btn-outline-nav" onClick={() => navigate('/customers')}>Log In</button>
            <button className="btn btn-nav-primary" onClick={() => navigate('/customers')}>Get Started</button>
          </div>

          <button className="lnav-hamburger" onClick={() => setMobileOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Trusted by 10,000+ businesses worldwide
          </div>
          <h1 className="hero-headline">
            Manage Your Customers<br />
            <span className="hero-headline-accent">Like a Pro.</span>
          </h1>
          <p className="hero-subtext">
            The ultimate Customer Management System for modern businesses. Bulk uploads,
            smart analytics, and seamless data handling built on Java Spring Boot &amp; React.
          </p>
          <div className="hero-cta">
            <button className="btn hero-btn-primary" onClick={() => navigate('/customers')}>
              Start Free Trial
            </button>
            <button
              className="btn hero-btn-outline"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              View Features
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>1M+</strong><span>Records supported</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>10K+</strong><span>Companies using it</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>99.9%</strong><span>Uptime SLA</span></div>
          </div>
        </div>
      </section>

      {/* ── WHY SECTION ────────────────────────────────────── */}
      <section id="features" className="features-section">
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">Why Choose Nexus CRM?</h2>
            <p className="section-subtitle">Powerful features designed for performance and scalability.</p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────── */}
      <section id="about" className="about-section">
        <div className="section-inner about-inner">
          <div className="about-text">
            <div className="section-eyebrow">About</div>
            <h2 className="section-title">Built for Scale,<br />Designed for Teams</h2>
            <p className="about-body">
              NexusCRM is a production-ready customer management platform built with
              enterprise-grade technologies. From small businesses to large enterprises,
              our system scales with your needs while keeping your data secure and
              operations efficient.
            </p>
            <ul className="about-list">
              <li><CheckIcon /> Spring Boot backend with MariaDB</li>
              <li><CheckIcon /> SAX-based streaming for bulk upload</li>
              <li><CheckIcon /> React frontend with real-time updates</li>
              <li><CheckIcon /> Caffeine cache for master data</li>
            </ul>
            <button className="btn btn-nav-primary" onClick={() => navigate('/customers')}>
              Get Started →
            </button>
          </div>
          <div className="about-visual">
            <div className="about-card-stack">
              <div className="about-mock-card about-mock-card--1">
                <div className="mock-card-header">
                  <div className="mock-dot green" /><div className="mock-label">Total Customers</div>
                </div>
                <div className="mock-number">12,450</div>
                <div className="mock-trend">↑ 12% from last month</div>
              </div>
              <div className="about-mock-card about-mock-card--2">
                <div className="mock-card-header">
                  <div className="mock-dot blue" /><div className="mock-label">Active Uploads</div>
                </div>
                <div className="mock-number">8</div>
              </div>
              <div className="about-mock-card about-mock-card--3">
                <div className="mock-card-header">
                  <div className="mock-dot orange" /><div className="mock-label">Database Load</div>
                </div>
                <div className="mock-number">42%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────── */}
      <section id="contact" className="cta-section">
        <div className="section-inner">
          <h2 className="cta-title">Ready to transform your customer management?</h2>
          <p className="cta-sub">Join thousands of companies already using NexusCRM.</p>
          <button className="btn hero-btn-primary" onClick={() => navigate('/customers')}>
            Start Free Trial — No credit card required
          </button>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo-row">
              <div className="lnav-logo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="6" fill="#2563EB"/>
                  <path d="M6 8h12M6 12h8M6 16h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="footer-brand-name">NexusCRM</span>
            </div>
            <p className="footer-tagline">
              Empowering businesses with smart customer data solutions. Join thousands of companies today.
            </p>
            <div className="footer-socials">
              <a href="#!" className="social-btn" title="GitHub"><GitHubIcon /></a>
              <a href="#!" className="social-btn" title="Twitter"><TwitterIcon /></a>
              <a href="#!" className="social-btn" title="LinkedIn"><LinkedInIcon /></a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <div className="footer-col-title">Product</div>
              <a href="#features" className="footer-link">Features</a>
              <a href="#!" className="footer-link">Pricing</a>
              <a href="#!" className="footer-link">Documentation</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <a href="#about" className="footer-link">About Us</a>
              <a href="#!" className="footer-link">Careers</a>
              <a href="#contact" className="footer-link">Contact</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Legal</div>
              <a href="#!" className="footer-link">Privacy Policy</a>
              <a href="#!" className="footer-link">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2023 Nexus CRM Systems. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

/* ── SVG Icons ─────────────────────────────────────────────── */
function BoltIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}
function ExcelIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>;
}
function ShieldIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function ChartIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function CodeIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
}
function FamilyIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function CheckIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function GitHubIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.04c-3.34.72-4.04-1.61-4.04-1.61-.54-1.37-1.32-1.73-1.32-1.73-1.08-.74.08-.72.08-.72 1.19.08 1.82 1.22 1.82 1.22 1.06 1.82 2.78 1.29 3.46.99.1-.77.42-1.29.76-1.59-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>;
}
function TwitterIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>;
}
function LinkedInIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;
}
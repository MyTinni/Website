import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function Index() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el);
  };

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [establishment, setEstablishment] = useState('');
  const [notes, setNotes] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      setFormState('error');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      setFormState('error');
      return;
    }

    setFormState('submitting');
    setErrorMsg('');

    const { error } = await supabase
      .from('interest_submissions')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: establishment.trim() || null,
        message: notes.trim() || null,
      });

    if (error) {
      console.error(error);
      setErrorMsg('Something went wrong. Please try again.');
      setFormState('error');
      return;
    }

    setFormState('success');
  };

  return (
    <>
      <style>{`
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          position: relative;
          z-index: 1;
        }

        .hero-ornament {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          opacity: 0.5;
        }

        .ornament-line {
          width: 60px;
          height: 1px;
          background: var(--red);
        }

        .hero h1 {
          font-family: 'Mate SC', serif;
          font-size: clamp(52px, 10vw, 96px);
          color: var(--red);
          line-height: 1.05;
          letter-spacing: 0.02em;
          margin-bottom: 8px;
        }

        .hero-sub {
          font-family: 'Mate', serif;
          font-style: italic;
          font-size: clamp(18px, 3vw, 26px);
          color: var(--accent);
          margin-bottom: 28px;
          letter-spacing: 0.04em;
        }

        .hero-desc {
          max-width: 540px;
          font-size: 16px;
          line-height: 1.75;
          color: var(--text);
          opacity: 0.8;
          margin-bottom: 48px;
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .axis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-top: 40px;
        }

        .axis-card {
          background: rgba(139, 26, 26, 0.04);
          border: 1px solid rgba(139, 26, 26, 0.15);
          border-radius: 2px;
          padding: 24px 20px;
          text-align: center;
          transition: border-color 0.2s, background 0.2s;
        }

        .axis-card:hover {
          border-color: rgba(139, 26, 26, 0.35);
          background: rgba(139, 26, 26, 0.07);
        }

        .axis-icon {
          font-size: 28px;
          margin-bottom: 10px;
          display: block;
        }

        .axis-name {
          font-family: 'Mate SC', serif;
          font-size: 13px;
          color: var(--red);
          letter-spacing: 0.1em;
          margin-bottom: 6px;
        }

        .axis-desc {
          font-size: 12px;
          opacity: 0.6;
          line-height: 1.5;
        }

        .pentagon-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .pentagon-section { grid-template-columns: 1fr; }
        }

        .pentagon-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .radar-svg { width: 280px; height: 280px; }

        .feature-list {
          list-style: none;
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .feature-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 15px;
          line-height: 1.6;
          opacity: 0.85;
        }

        .feature-bullet {
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 999px;
          flex-shrink: 0;
          margin-top: 8px;
        }

        .quote-block {
          border-left: 3px solid var(--accent);
          padding: 20px 28px;
          background: rgba(139, 26, 26, 0.04);
          border-radius: 0 2px 2px 0;
          margin: 40px 0;
        }

        .quote-text {
          font-family: 'Mate', serif;
          font-style: italic;
          font-size: 20px;
          line-height: 1.6;
          color: var(--red);
          margin-bottom: 12px;
        }

        .quote-attr {
          font-size: 13px;
          opacity: 0.6;
          letter-spacing: 0.05em;
        }

        /* FORM SECTION */
        .form-section {
          background: rgba(139, 26, 26, 0.04);
          border-top: 1px solid rgba(139, 26, 26, 0.15);
          border-bottom: 1px solid rgba(139, 26, 26, 0.15);
          padding: 80px 48px;
          position: relative;
          z-index: 1;
        }

        .form-inner {
          max-width: 520px;
          margin: 0 auto;
        }

        .form-field {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-family: 'Mate SC', serif;
          font-size: 13px;
          color: var(--red);
          letter-spacing: 0.03em;
        }

        .form-optional {
          color: rgb(160, 120, 90);
          font-size: 12px;
          font-family: 'Mate', serif;
          font-weight: normal;
        }

        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid rgb(139, 26, 26);
          border-radius: 4px;
          background-color: rgb(232, 213, 181);
          color: rgb(60, 30, 20);
          font-family: 'Mate', serif;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          border-color: rgb(238, 139, 96);
        }

        .form-textarea {
          min-height: 90px;
          resize: vertical;
        }

        .form-submit {
          width: 100%;
          padding: 13px;
          background-color: rgb(139, 26, 26);
          color: rgb(232, 213, 181);
          border: none;
          border-radius: 4px;
          font-family: 'Mate SC', serif;
          font-size: 15px;
          letter-spacing: 0.05em;
          margin-top: 8px;
          cursor: pointer;
          transition: opacity 0.2s, background 0.2s;
        }

        .form-submit:hover:not(:disabled) {
          background: rgb(110, 20, 20);
        }

        .form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-error {
          color: rgb(180, 40, 40);
          font-size: 13px;
          margin-bottom: 8px;
          font-family: 'Mate', serif;
        }

        .form-consent {
          font-size: 11px;
          color: rgb(140, 100, 70);
          text-align: center;
          margin-top: 12px;
          line-height: 1.5;
          font-family: 'Mate', serif;
        }

        .form-success {
          text-align: center;
          padding: 40px 0;
        }

        .form-success-icon {
          font-size: 36px;
          margin-bottom: 12px;
        }

        .form-success-title {
          font-family: 'Mate SC', serif;
          color: var(--red);
          font-size: 22px;
          font-weight: 400;
          margin-bottom: 10px;
        }

        .form-success-text {
          color: rgb(100, 60, 40);
          font-size: 15px;
          line-height: 1.6;
        }

        /* CTA SECTION */
        .cta-section {
          background: var(--red);
          padding: 80px 48px;
          text-align: center;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }

        .cta-section::before {
          content: 'MyTinni';
          position: absolute;
          font-family: 'Mate SC', serif;
          font-size: 200px;
          color: rgba(232, 213, 181, 0.05);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          white-space: nowrap;
        }

        .cta-section h2 {
          font-family: 'Mate SC', serif;
          font-size: clamp(28px, 4vw, 42px);
          color: var(--cream);
          margin-bottom: 16px;
          position: relative;
        }

        .cta-section p {
          color: rgba(232, 213, 181, 0.75);
          font-size: 16px;
          margin-bottom: 36px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          line-height: 1.7;
        }

        @media (max-width: 600px) {
          .cta-section { padding: 60px 24px; }
          .form-section { padding: 60px 24px; }
        }
      `}</style>

      <div className="watermark">MT</div>

      {/* NAV */}
      <nav>
        <a href="/" className="nav-logo">
          <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="14,2 26,9 26,23 14,28 2,23 2,9" fill="none" stroke="rgb(139,26,26)" strokeWidth="1.5"/>
            <line x1="14" y1="2" x2="14" y2="28" stroke="rgb(139,26,26)" strokeWidth="0.75" opacity="0.4"/>
            <line x1="2" y1="9" x2="26" y2="23" stroke="rgb(139,26,26)" strokeWidth="0.75" opacity="0.4"/>
            <line x1="26" y1="9" x2="2" y2="23" stroke="rgb(139,26,26)" strokeWidth="0.75" opacity="0.4"/>
            <circle cx="14" cy="14" r="2.5" fill="rgb(238,139,96)"/>
          </svg>
          MyTinni
        </a>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#what-it-is" onClick={() => setMenuOpen(false)}>What It Is</a></li>
          <li><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a></li>
          <li><a href="#get-it" onClick={() => setMenuOpen(false)}>Get Involved</a></li>
          <li><a href="https://app.mytinni.com" onClick={() => setMenuOpen(false)}>Try The App!</a></li>
        </ul>
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
        >
          <div className="nav-toggle-line"/>
          <div className="nav-toggle-line"/>
          <div className="nav-toggle-line"/>
        </button>
        <span className="beta-badge">BETA</span>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-ornament">
          <div className="ornament-line"/>
          <svg width="16" height="16" viewBox="0 0 16 16"><polygon points="8,0 16,8 8,16 0,8" fill="rgb(238,139,96)"/></svg>
          <div className="ornament-line"/>
        </div>
        <h1>MyTinni</h1>
        <p className="hero-sub">Flavour Engine</p>
        <p className="hero-desc">
          Every ingredient is a vector. Every cocktail, a composition. A private tasting ledger built for professionals who think in taste.
        </p>
        <div className="hero-buttons">
          <a href="#get-it" className="btn-primary">Get Involved</a>
          <a href="#how-it-works" className="btn-secondary">See How It Works</a>
        </div>
      </section>

      <div className="section-divider">
        <div className="divider-line"/>
        <div className="divider-diamond"/>
        <div className="divider-line"/>
      </div>

      {/* WHAT IT IS */}
      <section className="section" id="what-it-is">
        <div className="fade-in" ref={addRef}>
          <p className="section-label">The Idea</p>
          <h2 className="section-title">Taste has a grammar.<br/>We built it.</h2>
          <p className="section-body">
            MyTinni maps every ingredient across five primary taste axes — the same axes your palate uses, whether you know it or not. The result is a sensory engine that speaks the language of the bar, not the spreadsheet.
          </p>
          <div className="quote-block">
            <p className="quote-text">"Better to learn how to think than to follow a guide."</p>
            <p className="quote-attr">— The MyTinni philosophy</p>
          </div>
        </div>

        <div className="fade-in axis-grid" ref={addRef}>
          {[
            { icon: "🍯", name: "Sweet", desc: "Sugars, syrups, liqueurs" },
            { icon: "🍋", name: "Sour", desc: "Citrus, acid, ferment" },
            { icon: "🌿", name: "Bitter", desc: "Botanicals, tannins, peel" },
            { icon: "🧂", name: "Umami", desc: "Depth, salinity, savour" },
            { icon: "🌶", name: "Spice", desc: "Heat, pepper, warmth" },
          ].map((axis) => (
            <div className="axis-card" key={axis.name}>
              <span className="axis-icon">{axis.icon}</span>
              <p className="axis-name">{axis.name}</p>
              <p className="axis-desc">{axis.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider">
        <div className="divider-line"/>
        <div className="divider-diamond"/>
        <div className="divider-line"/>
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works">
        <div className="pentagon-section">
          <div className="fade-in" ref={addRef}>
            <p className="section-label">The Engine</p>
            <h2 className="section-title">Vectors, not adjectives.</h2>
            <p className="section-body">
              Each ingredient carries a precise numerical profile across all five axes. When you build a cocktail, the engine calculates the resulting composition — not from adjectives, but from primary receptor biology.
            </p>
            <ul className="feature-list">
              <li><span className="feature-bullet"/><span>Inventory your bar — every bottle becomes a data point</span></li>
              <li><span className="feature-bullet"/><span>See what you can make with what you have</span></li>
              <li><span className="feature-bullet"/><span>Find substitutions ranked by sensory proximity</span></li>
              <li><span className="feature-bullet"/><span>Build custom recipes and watch the vector shift in real time</span></li>
            </ul>
          </div>

          <div className="fade-in pentagon-wrap" ref={addRef}>
            <svg className="radar-svg" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
              {[0.25, 0.5, 0.75, 1].map((scale, i) => {
                const pts = [
                  [140, 140 - 110 * scale],
                  [140 + 104.6 * scale, 140 - 34.1 * scale],
                  [140 + 64.7 * scale, 140 + 89.1 * scale],
                  [140 - 64.7 * scale, 140 + 89.1 * scale],
                  [140 - 104.6 * scale, 140 - 34.1 * scale],
                ].map(p => p.join(",")).join(" ");
                return <polygon key={i} points={pts} fill="none" stroke="rgba(139,26,26,0.12)" strokeWidth="1"/>;
              })}
              {[
                [140, 30], [244.6, 105.9], [204.7, 229.1], [75.3, 229.1], [35.4, 105.9]
              ].map(([x, y], i) => (
                <line key={i} x1="140" y1="140" x2={x} y2={y} stroke="rgba(139,26,26,0.15)" strokeWidth="1"/>
              ))}
              <polygon
                points="140,68 213,112 188,208 92,208 67,112"
                fill="rgba(139,26,26,0.12)"
                stroke="rgb(139,26,26)"
                strokeWidth="1.5"
              />
              {[
                [140, 68], [213, 112], [188, 208], [92, 208], [67, 112]
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="4" fill="rgb(238,139,96)" stroke="rgb(139,26,26)" strokeWidth="1.5"/>
              ))}
              <text x="140" y="22" textAnchor="middle" fontFamily="Mate SC, serif" fontSize="11" fill="rgb(139,26,26)" opacity="0.7">Sweet</text>
              <text x="252" y="108" textAnchor="start" fontFamily="Mate SC, serif" fontSize="11" fill="rgb(139,26,26)" opacity="0.7">Sour</text>
              <text x="210" y="245" textAnchor="middle" fontFamily="Mate SC, serif" fontSize="11" fill="rgb(139,26,26)" opacity="0.7">Bitter</text>
              <text x="70" y="245" textAnchor="middle" fontFamily="Mate SC, serif" fontSize="11" fill="rgb(139,26,26)" opacity="0.7">Umami</text>
              <text x="28" y="108" textAnchor="end" fontFamily="Mate SC, serif" fontSize="11" fill="rgb(139,26,26)" opacity="0.7">Spice</text>
              <text x="140" y="158" textAnchor="middle" fontFamily="Mate, serif" fontSize="10" fill="rgb(139,26,26)" opacity="0.45" fontStyle="italic">Negroni</text>
            </svg>
          </div>
        </div>
      </section>

      <div className="section-divider">
        <div className="divider-line"/>
        <div className="divider-diamond"/>
        <div className="divider-line"/>
      </div>

      {/* GET IT */}
      <section className="section" id="get-it">
        <div className="fade-in" ref={addRef}>
          <p className="section-label">Distribution</p>
          <h2 className="section-title">Currently in Beta.</h2>
          <p className="section-body">
            MyTinni is live on Android. We're working with a closed group of industry professionals before wider release. iOS coming soon.
          </p>
          <ul className="feature-list" style={{ marginTop: 28 }}>
            <li><span className="feature-bullet"/><span>Android available now via Google Play (open beta)</span></li>
            <li><span className="feature-bullet"/><span>iOS — coming soon</span></li>
            <li><span className="feature-bullet"/><span>Interest list open — fill in the form below to be considered</span></li>
          </ul>
        </div>
      </section>

      {/* FORM */}
      <div className="form-section">
        <div className="form-inner">
          <p className="section-label" style={{ textAlign: 'center', marginBottom: 8 }}>Get Involved</p>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 12 }}>Join Us</h2>
          <p style={{ textAlign: 'center', fontSize: 15, lineHeight: 1.7, opacity: 0.75, marginBottom: 36 }}>
            If you are interested in our project & want to get involved tell us about yourself, we are constantly evolving and would love to hear from you.
          </p>

          {formState === 'success' ? (
            <div className="form-success">
              <p className="form-success-icon">🍸</p>
              <h3 className="form-success-title">Message Recieved!.</h3>
              <p className="form-success-text">Sit tight — we'll get in touch shortly.</p>
            </div>
          ) : (
            <>
              <div className="form-field">
                <label className="form-label">Name <span style={{ color: 'rgb(139,26,26)' }}>*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  className="form-input"
                  disabled={formState === 'submitting'}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Email <span style={{ color: 'rgb(139,26,26)' }}>*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="form-input"
                  disabled={formState === 'submitting'}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Establishment / Role <span className="form-optional">(optional)</span></label>
                <input
                  type="text"
                  value={establishment}
                  onChange={e => setEstablishment(e.target.value)}
                  placeholder="Bar, Freelance, Investor..."
                  className="form-input"
                  disabled={formState === 'submitting'}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Notes <span className="form-optional">(optional)</span></label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Tell us what you hope to see..."
                  className="form-input form-textarea"
                  disabled={formState === 'submitting'}
                />
              </div>

              {formState === 'error' && (
                <p className="form-error">{errorMsg}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={formState === 'submitting'}
                className="form-submit"
              >
                {formState === 'submitting' ? 'Sending...' : 'Send'}
              </button>

              <p className="form-consent">
                By submitting, you agree to us storing your details to contact you about the MyTinni beta.
              </p>
            </>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <h2>Built by bartenders. Engineered for precision.</h2>
        <p>Twenty years of professional taste experience encoded into an algorithm. MyTinni is not a guide — it's a thinking tool.</p>
        <a href="#get-it" className="btn-cream">Get Involved</a>
      </div>

      {/* FOOTER */}
      <footer>
        <span className="footer-logo">MyTinni</span>
        <ul className="footer-links">
          <li><a href="/terms">Terms &amp; Conditions</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/support">Support</a></li>
          <li><a href="/delete-account">Delete Account</a></li>
          <li><a href="mailto:hello@hello.mytinni.com">Contact</a></li>
        </ul>
        <p className="footer-copy">© {new Date().getFullYear()} MyTinni. All rights reserved.</p>
      </footer>
    </>
  );
}

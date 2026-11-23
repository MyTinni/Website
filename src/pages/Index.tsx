import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type FormState = 'idle' | 'submitting' | 'success' | 'error';

// Botanical plates — public media-assets bucket (same library the app renders)
const PLATE_BASE =
  'https://kkmrmjywklyhjsnnembl.supabase.co/storage/v1/object/public/media-assets';
const plate = (slug: string) => `${PLATE_BASE}/${slug}.webp`;

const APP_STORE_URL = 'https://apps.apple.com/us/app/tasteologist/id6761769253';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mytinni.app&hl=en';
const WEB_APP_URL = 'https://app.mytinni.com';

/* ---------- Brand mark: framed "Ta" tile ---------- */
function TaMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Tasteologist mark"
    >
      <rect x="1.5" y="1.5" width="61" height="61" fill="rgb(246,233,206)" stroke="rgb(60,46,34)" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" fill="none" stroke="rgb(197,152,62)" strokeWidth="1" />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="Cormorant, serif"
        fontWeight="600"
        fontSize="36"
        fill="rgb(123,42,18)"
      >
        Ta
      </text>
    </svg>
  );
}

/* ---------- The five-axis radar, Tasteologist dress ---------- */
function Radar() {
  const grid = [0.25, 0.5, 0.75, 1];
  const vertex = (scale: number) =>
    [
      [140, 140 - 110 * scale],
      [140 + 104.6 * scale, 140 - 34.1 * scale],
      [140 + 64.7 * scale, 140 + 89.1 * scale],
      [140 - 64.7 * scale, 140 + 89.1 * scale],
      [140 - 104.6 * scale, 140 - 34.1 * scale],
    ];
  return (
    <svg className="radar-svg" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
      {grid.map((scale, i) => (
        <polygon
          key={i}
          points={vertex(scale).map((p) => p.join(',')).join(' ')}
          fill="none"
          stroke="rgba(60,46,34,0.14)"
          strokeWidth="1"
        />
      ))}
      {vertex(1).map(([x, y], i) => (
        <line key={i} x1="140" y1="140" x2={x} y2={y} stroke="rgba(60,46,34,0.16)" strokeWidth="1" />
      ))}
      {/* a taste profile — olive watercolour fill */}
      <polygon
        points="140,62 219,114 182,214 95,201 73,118"
        fill="rgba(122,120,78,0.3)"
        stroke="rgb(122,120,78)"
        strokeWidth="1.5"
      />
      {/* a cocktail laid over it */}
      <polygon
        points="140,86 201,120 170,196 108,188 92,124"
        fill="none"
        stroke="rgb(123,42,18)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      {[
        [140, 62], [219, 114], [182, 214], [95, 201], [73, 118],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="rgb(197,152,62)" stroke="rgb(60,46,34)" strokeWidth="1.2" />
      ))}
      <text x="140" y="22" textAnchor="middle" fontFamily="Cormorant, serif" fontWeight="600" fontSize="14" fill="rgb(60,46,34)" opacity="0.8">Sweet</text>
      <text x="252" y="108" textAnchor="start" fontFamily="Cormorant, serif" fontWeight="600" fontSize="14" fill="rgb(60,46,34)" opacity="0.8">Sour</text>
      <text x="212" y="244" textAnchor="middle" fontFamily="Cormorant, serif" fontWeight="600" fontSize="14" fill="rgb(60,46,34)" opacity="0.8">Bitter</text>
      <text x="68" y="244" textAnchor="middle" fontFamily="Cormorant, serif" fontWeight="600" fontSize="14" fill="rgb(60,46,34)" opacity="0.8">Umami</text>
      <text x="28" y="108" textAnchor="end" fontFamily="Cormorant, serif" fontWeight="600" fontSize="14" fill="rgb(60,46,34)" opacity="0.8">Spice</text>
      <text x="140" y="152" textAnchor="middle" fontFamily="Cormorant, serif" fontStyle="italic" fontSize="12" fill="rgb(123,42,18)" opacity="0.65">Negroni</text>
      <text x="140" y="270" textAnchor="middle" fontFamily="Mate SC, serif" fontSize="9" letterSpacing="0.15em" fill="rgb(122,120,78)" opacity="0.8">YOUR PROFILE · A COMPOSITION</text>
    </svg>
  );
}

/* ---------- Store badges, house dress ---------- */
function StoreBadges() {
  return (
    <div className="store-badges">
      <a href={APP_STORE_URL} className="store-badge" aria-label="Download on the App Store">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
        <span>
          <small>Download on the</small>
          App Store
        </span>
      </a>
      <a href={PLAY_STORE_URL} className="store-badge" aria-label="Get it on Google Play">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M3.6 1.8c-.3.3-.5.8-.5 1.4v17.6c0 .6.2 1.1.5 1.4l.1.1 9.9-9.9v-.2L3.7 1.7l-.1.1zm13.2 10.3-3.3-3.3 3.3-3.3 4 2.3c1.1.7 1.1 1.7 0 2.4l-4 1.9zm-.7.7-3.4 3.4L4.8 23l10.6-6.1 1.3-4.1-.6 0zM4.8 1l7.9 6.8 3.4 3.4.6 0-1.3-4.1L4.8 1z" />
        </svg>
        <span>
          <small>Get it on</small>
          Google Play
        </span>
      </a>
    </div>
  );
}

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

    const { error } = await supabase.from('interest_submissions').insert({
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
        /* ---------- HERO ---------- */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 130px 24px 80px;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }

        .hero .plate-bg { opacity: 0.16; }

        .hero-ornament {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
          opacity: 0.8;
        }
        .ornament-line { width: 64px; height: 1px; background: var(--gold); }

        .hero h1 {
          font-family: 'Cormorant', serif;
          font-weight: 600;
          font-size: clamp(56px, 10vw, 104px);
          color: var(--crimson);
          line-height: 1.02;
          letter-spacing: 0.01em;
          margin: 20px 0 6px;
        }

        .hero-sub {
          font-family: 'Cormorant', serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(20px, 3.2vw, 30px);
          color: var(--olive);
          margin-bottom: 26px;
          letter-spacing: 0.02em;
        }

        .hero-desc {
          max-width: 560px;
          font-size: 16.5px;
          line-height: 1.8;
          color: var(--ink);
          opacity: 0.85;
          margin-bottom: 42px;
        }

        .hero-heritage {
          margin-top: 34px;
          font-size: 13.5px;
          font-style: italic;
          color: var(--olive);
        }

        /* store badges */
        .store-badges { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
        .store-badge {
          display: flex;
          align-items: center;
          gap: 11px;
          background: var(--crimson);
          color: rgb(255,255,255);
          text-decoration: none;
          padding: 10px 22px 10px 18px;
          border-radius: 2px;
          transition: background 0.2s, transform 0.15s;
          text-align: left;
        }
        .store-badge:hover { background: rgb(98, 33, 14); transform: translateY(-1px); }
        .store-badge span {
          display: flex;
          flex-direction: column;
          font-family: 'Cormorant', serif;
          font-weight: 600;
          font-size: 19px;
          line-height: 1.15;
        }
        .store-badge small {
          font-family: 'Mate SC', serif;
          font-size: 9px;
          letter-spacing: 0.14em;
          opacity: 0.75;
        }
        .hero-weblink { margin-top: 20px; font-size: 14px; }

        /* ---------- CHAPTERS ---------- */
        .chapter-label {
          font-family: 'Mate SC', serif;
          font-size: 11px;
          letter-spacing: 0.26em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .quote-block {
          border-left: 2px solid var(--gold);
          padding: 20px 28px;
          background: rgba(197, 152, 62, 0.07);
          border-radius: 0 2px 2px 0;
          margin: 40px 0 0;
          max-width: 620px;
        }
        .quote-text {
          font-family: 'Cormorant', serif;
          font-style: italic;
          font-weight: 500;
          font-size: 22px;
          line-height: 1.55;
          color: var(--crimson);
          margin-bottom: 10px;
        }
        .quote-attr {
          font-family: 'Mate SC', serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          color: var(--olive);
        }

        /* theory axes */
        .axis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 14px;
          margin-top: 44px;
        }
        .axis-card { text-align: center; }
        .axis-card .specimen-card-inner { padding: 20px 14px; }
        .axis-name {
          font-family: 'Cormorant', serif;
          font-weight: 700;
          font-size: 22px;
          color: var(--crimson);
          margin-bottom: 4px;
        }
        .axis-opposite {
          font-family: 'Mate SC', serif;
          font-size: 9.5px;
          letter-spacing: 0.12em;
          color: var(--gold);
          margin-bottom: 8px;
          display: block;
        }
        .axis-desc { font-size: 12.5px; color: var(--ink); opacity: 0.7; line-height: 1.55; }

        .pentagon-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .pentagon-section { grid-template-columns: 1fr; }
        }
        .pentagon-wrap { display: flex; justify-content: center; align-items: center; }
        .radar-svg { width: 300px; height: 300px; }

        /* ---------- FUNCTION BLOCKS ---------- */
        .function-block {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 56px;
          align-items: center;
          padding: 72px 0;
        }
        .function-block.flip { grid-template-columns: 0.85fr 1.15fr; }
        .function-block.flip .function-copy { order: 2; }
        .function-block.flip .function-art { order: 1; }
        @media (max-width: 768px) {
          .function-block, .function-block.flip { grid-template-columns: 1fr; gap: 32px; }
          .function-block.flip .function-copy { order: 1; }
          .function-block.flip .function-art { order: 2; }
        }

        .function-art img {
          width: 100%;
          max-height: 340px;
          object-fit: contain;
          display: block;
        }
        .function-art .specimen-card-inner { padding: 18px; background: rgba(251,247,238,0.4); }
        .plate-credit {
          font-size: 10.5px;
          color: var(--olive);
          opacity: 0.85;
          margin-top: 10px;
          text-align: center;
          font-style: italic;
          line-height: 1.5;
        }

        .feature-list {
          list-style: none;
          margin-top: 26px;
          display: flex;
          flex-direction: column;
          gap: 13px;
        }
        .feature-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 15px;
          line-height: 1.65;
          opacity: 0.88;
        }
        .feature-bullet {
          width: 6px;
          height: 6px;
          background: var(--gold);
          transform: rotate(45deg);
          flex-shrink: 0;
          margin-top: 8px;
        }

        .function-title {
          font-family: 'Cormorant', serif;
          font-weight: 600;
          font-size: clamp(28px, 3.6vw, 40px);
          color: var(--crimson);
          line-height: 1.15;
          margin-bottom: 16px;
        }

        /* ---------- NAME SECTION ---------- */
        .name-section { text-align: center; }
        .name-section .section-body { margin-left: auto; margin-right: auto; }
        .name-lineage {
          display: flex;
          gap: 0;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 44px;
          font-family: 'Cormorant', serif;
        }
        .lineage-item { padding: 0 34px; text-align: center; }
        .lineage-item + .lineage-item { border-left: 1px solid rgba(197,152,62,0.5); }
        .lineage-name {
          font-weight: 600;
          font-size: 24px;
          color: var(--crimson);
          margin-bottom: 4px;
        }
        .lineage-role {
          font-family: 'Mate SC', serif;
          font-size: 10px;
          letter-spacing: 0.16em;
          color: var(--olive);
        }
        @media (max-width: 600px) {
          .lineage-item { padding: 14px 0; width: 100%; }
          .lineage-item + .lineage-item { border-left: none; border-top: 1px solid rgba(197,152,62,0.5); }
        }

        /* ---------- FORM ---------- */
        .form-section {
          background: var(--parchment);
          border-top: 1px solid rgba(60, 46, 34, 0.2);
          border-bottom: 1px solid rgba(60, 46, 34, 0.2);
          padding: 80px 48px;
          position: relative;
          z-index: 1;
        }
        .form-inner { max-width: 520px; margin: 0 auto; }
        .form-field { margin-bottom: 20px; display: flex; flex-direction: column; gap: 6px; }
        .form-label {
          font-family: 'Mate SC', serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: var(--ink);
        }
        .form-optional { color: var(--olive); font-size: 11px; font-family: 'Lora', serif; font-style: italic; }
        .form-input {
          width: 100%;
          padding: 11px 12px;
          border: 1px solid rgba(60, 46, 34, 0.4);
          border-radius: 2px;
          background-color: var(--ivory);
          color: var(--ink);
          font-family: 'Lora', serif;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: var(--gold); }
        .form-textarea { min-height: 90px; resize: vertical; }
        .form-submit {
          width: 100%;
          padding: 13px;
          background-color: var(--crimson);
          color: rgb(255,255,255);
          border: none;
          border-radius: 2px;
          font-family: 'Mate SC', serif;
          font-size: 15px;
          letter-spacing: 0.08em;
          margin-top: 8px;
          cursor: pointer;
          transition: opacity 0.2s, background 0.2s;
        }
        .form-submit:hover:not(:disabled) { background: rgb(98, 33, 14); }
        .form-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .form-error { color: var(--crimson); font-size: 13px; margin-bottom: 8px; }
        .form-consent {
          font-size: 11px;
          color: var(--olive);
          text-align: center;
          margin-top: 12px;
          line-height: 1.6;
        }
        .form-success { text-align: center; padding: 40px 0; }
        .form-success-title {
          font-family: 'Cormorant', serif;
          font-weight: 600;
          color: var(--crimson);
          font-size: 26px;
          margin-bottom: 10px;
        }
        .form-success-text { color: var(--ink); opacity: 0.8; font-size: 15px; line-height: 1.6; }

        /* ---------- CLOSING BAND ---------- */
        .cta-section {
          background: var(--crimson);
          padding: 88px 48px;
          text-align: center;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        .cta-section::before {
          content: 'Tasteologist';
          position: absolute;
          font-family: 'Cormorant', serif;
          font-weight: 600;
          font-size: 180px;
          color: rgba(246, 233, 206, 0.06);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          white-space: nowrap;
        }
        .cta-section h2 {
          font-family: 'Cormorant', serif;
          font-weight: 600;
          font-size: clamp(30px, 4.4vw, 46px);
          color: var(--parchment);
          margin-bottom: 16px;
          position: relative;
        }
        .cta-section p {
          color: rgba(246, 233, 206, 0.8);
          font-size: 16px;
          margin: 0 auto 36px;
          max-width: 500px;
          position: relative;
          line-height: 1.75;
        }
        .cta-section .store-badges { position: relative; }
        .cta-section .store-badge {
          background: var(--parchment);
          color: var(--crimson);
        }
        .cta-section .store-badge:hover { background: var(--ivory); }

        @media (max-width: 600px) {
          .cta-section { padding: 60px 24px; }
          .form-section { padding: 60px 24px; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <a href="/" className="nav-logo">
          <TaMark />
          Tasteologist
        </a>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#origins" onClick={() => setMenuOpen(false)}>The Story</a></li>
          <li><a href="#theory" onClick={() => setMenuOpen(false)}>The Theory</a></li>
          <li><a href="#the-app" onClick={() => setMenuOpen(false)}>The App</a></li>
          <li><a href="#events" onClick={() => setMenuOpen(false)}>Hosting</a></li>
          <li><a href="#get-it" onClick={() => setMenuOpen(false)}>Get It</a></li>
          <li><a href={WEB_APP_URL} onClick={() => setMenuOpen(false)}>Web App</a></li>
        </ul>
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <div className="nav-toggle-line" />
          <div className="nav-toggle-line" />
          <div className="nav-toggle-line" />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <img className="plate-bg" src={plate('bitter-orange-kohler')} alt="" aria-hidden="true" />
        <div className="hero-ornament">
          <div className="ornament-line" />
          <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,0 12,6 6,12 0,6" fill="rgb(197,152,62)" /></svg>
          <div className="ornament-line" />
        </div>
        <TaMark size={84} />
        <h1>Tasteologist</h1>
        <p className="hero-sub">Taste, not just flavour.</p>
        <p className="hero-desc">
          The knowledge of high-end bartending, brought home. An app that measures what you like
          — then builds, balances and plans every drink around it.
        </p>
        <StoreBadges />
        <p className="hero-weblink">
          <a className="text-link" href={WEB_APP_URL}>or open the web app</a>
        </p>
        <p className="hero-heritage">
          It began as MyTinni — <a className="text-link" href="#origins">this is how the journey began</a>.
        </p>
      </section>

      <div className="section-divider">
        <div className="divider-line" />
        <div className="divider-diamond" />
        <div className="divider-line" />
      </div>

      {/* CHAPTER I — ORIGINS */}
      <section className="section" id="origins">
        <img className="plate-bg" src={plate('apricot-poiteau')} alt="" aria-hidden="true" />
        <div className="fade-in" ref={addRef}>
          <p className="chapter-label">Chapter I · Origins</p>
          <h2 className="section-title">It started in a can.</h2>
          <div className="gold-rule"><span className="line" /><span className="diamond" /></div>
          <p className="section-body">
            Tasteologist began behind the bar — years spent building drinks and menus in some of
            the world's best cocktail bars, watching the same gap refuse to close: the drinks
            people loved when they went out, and the drinks they could make at home.
          </p>
          <p className="section-body">
            The first answer was MyTinni — cocktails in a can, made the way the bar makes them.
            Fresh ingredients, bar-strength, no shortcuts. It proved the thirst was real, and it
            taught the real lesson: the gap was never equipment or ingredients. It's knowing
            <em> why</em> a drink tastes the way it does.
          </p>
          <p className="section-body">
            So we stopped putting drinks in cans, and started putting the knowledge in your hands.
          </p>
          <div className="quote-block">
            <p className="quote-text">"Better to learn how to think than to follow a guide."</p>
            <p className="quote-attr">The house philosophy</p>
          </div>
        </div>
      </section>

      <div className="section-divider">
        <div className="divider-line" />
        <div className="divider-diamond" />
        <div className="divider-line" />
      </div>

      {/* CHAPTER II — THE THEORY */}
      <section className="section" id="theory">
        <div className="fade-in" ref={addRef}>
          <p className="chapter-label">Chapter II · The Theory</p>
          <h2 className="section-title">Taste has a grammar.<br />We wrote it down.</h2>
          <div className="gold-rule"><span className="line" /><span className="diamond" /></div>
          <p className="section-body">
            Five primary tastes — and they are not a list, they are a cycle. Each taste has an
            opposite, and the opposites close into a loop: sweet against bitter, sour against
            sweet, umami against sour, spice against umami, bitter against spice. Balance a drink
            on that wheel and you understand it; follow a recipe and you only repeat it.
          </p>
          <p className="section-body">
            Every ingredient in Tasteologist carries a measured value on all five axes. Every
            cocktail is computed from them — a weighted composition, not a list of parts.
          </p>
        </div>

        <div className="fade-in axis-grid" ref={addRef}>
          {[
            { name: 'Sweet', opp: 'against bitter', desc: 'Sugars, syrups, liqueurs' },
            { name: 'Sour', opp: 'against sweet', desc: 'Citrus, acid, ferment' },
            { name: 'Bitter', opp: 'against spice', desc: 'Botanicals, tannins, peel' },
            { name: 'Umami', opp: 'against sour', desc: 'Depth, salinity, savour' },
            { name: 'Spice', opp: 'against umami', desc: 'Heat, pepper, warmth' },
          ].map((axis) => (
            <div className="specimen-card axis-card" key={axis.name}>
              <div className="specimen-card-inner">
                <p className="axis-name">{axis.name}</p>
                <span className="axis-opposite">{axis.opp}</span>
                <p className="axis-desc">{axis.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pentagon-section" style={{ marginTop: 72 }}>
          <div className="fade-in" ref={addRef}>
            <h3 className="function-title">Your palate is the primary data.</h3>
            <p className="section-body">
              A short tasting quiz draws your profile onto the wheel. From there, every drink you
              make, rate and adjust sharpens it — because one rule sits above everything else in
              the engine: <em>your recorded experience outranks our curated values.</em> The
              starting numbers are ours. The profile it learns is yours.
            </p>
          </div>
          <div className="fade-in pentagon-wrap" ref={addRef}>
            <Radar />
          </div>
        </div>
      </section>

      <div className="section-divider">
        <div className="divider-line" />
        <div className="divider-diamond" />
        <div className="divider-line" />
      </div>

      {/* CHAPTER III — THE APP */}
      <section className="section" id="the-app" style={{ paddingBottom: 24 }}>
        <div className="fade-in" ref={addRef}>
          <p className="chapter-label">Chapter III · The App</p>
          <h2 className="section-title">One theory, four rooms.</h2>
          <div className="gold-rule"><span className="line" /><span className="diamond" /></div>
          <p className="section-body">
            Everything in Tasteologist is a way to work on your ideas — from the first reading of
            your palate to the last drink of a hosted night.
          </p>
        </div>

        {/* MY TASTES */}
        <div className="function-block">
          <div className="function-copy fade-in" ref={addRef}>
            <p className="section-label">01 · My Tastes</p>
            <h3 className="function-title">A palate you can see.</h3>
            <p className="section-body">
              Your taste profile, drawn as a living radar. It starts with the quiz and never stops
              learning.
            </p>
            <ul className="feature-list">
              <li><span className="feature-bullet" /><span>Your five-axis profile, refined by every drink you log</span></li>
              <li><span className="feature-bullet" /><span>A flavour profile of the emergent tags you love — mint, smoke, blossom</span></li>
              <li><span className="feature-bullet" /><span>Surprise Me — suggestions laid over your own radar, matched to you</span></li>
            </ul>
          </div>
          <div className="function-art fade-in" ref={addRef}>
            <div className="specimen-card">
              <div className="specimen-card-inner">
                <img src={plate('lemon-kohler')} alt="Botanical plate — lemon" loading="lazy" />
              </div>
            </div>
            <p className="plate-credit">Köhler's Medizinal-Pflanzen (1887–98) · public domain</p>
          </div>
        </div>

        {/* INVENTORY */}
        <div className="function-block flip">
          <div className="function-copy fade-in" ref={addRef}>
            <p className="section-label">02 · Inventory</p>
            <h3 className="function-title">Your bar, measured.</h3>
            <p className="section-body">
              Every bottle on your shelf becomes a data point the engine can reason with.
            </p>
            <ul className="feature-list">
              <li><span className="feature-bullet" /><span>Scan a label to shelve it — the vector comes attached</span></li>
              <li><span className="feature-bullet" /><span>See every drink you can make tonight, with what's in the room</span></li>
              <li><span className="feature-bullet" /><span>Add your own ingredients — homemade syrups included — and teach the engine their taste</span></li>
            </ul>
          </div>
          <div className="function-art fade-in" ref={addRef}>
            <div className="specimen-card">
              <div className="specimen-card-inner">
                <img src={plate('olive-kohler')} alt="Botanical plate — olive" loading="lazy" />
              </div>
            </div>
            <p className="plate-credit">Köhler's Medizinal-Pflanzen (1887–98) · public domain</p>
          </div>
        </div>

        {/* BARBOOK */}
        <div className="function-block">
          <div className="function-copy fade-in" ref={addRef}>
            <p className="section-label">03 · Barbook</p>
            <h3 className="function-title">Recipes that listen.</h3>
            <p className="section-body">
              A catalogue of classics held as compositions, not instructions — which means they
              can be tailored without being broken.
            </p>
            <ul className="feature-list">
              <li><span className="feature-bullet" /><span>Want it less sweet? One tap moves the axis; the engine rebalances the recipe, millilitre by millilitre, inside the drink's limits</span></li>
              <li><span className="feature-bullet" /><span>Substitutions ranked by sensory proximity, not alphabet</span></li>
              <li><span className="feature-bullet" /><span>Build twists and custom drinks, and watch the vector shift as you pour</span></li>
            </ul>
          </div>
          <div className="function-art fade-in" ref={addRef}>
            <div className="specimen-card">
              <div className="specimen-card-inner">
                <img src={plate('sour-cherry-kohler')} alt="Botanical plate — sour cherry" loading="lazy" />
              </div>
            </div>
            <p className="plate-credit">Köhler's Medizinal-Pflanzen (1887–98) · public domain</p>
          </div>
        </div>
      </section>

      {/* CHAPTER IV — EVENTS */}
      <section className="section" id="events" style={{ paddingTop: 24 }}>
        <img className="plate-bg" src={plate('grape-kohler')} alt="" aria-hidden="true" />
        <div className="function-block flip">
          <div className="function-copy fade-in" ref={addRef}>
            <p className="section-label">04 · Events</p>
            <h3 className="function-title">From first idea to last orders.</h3>
            <p className="section-body">
              The whole night, run from one place — the same engine that balances a single drink,
              scaled to a room full of guests.
            </p>
            <ul className="feature-list">
              <li><span className="feature-bullet" /><span>Set the menu and the covers; batch quantities are planned per cocktail</span></li>
              <li><span className="feature-bullet" /><span>A shopping list that confirms itself into a budget — with a printable list and menu on the house letterhead</span></li>
              <li><span className="feature-bullet" /><span>Count guests at the door, tally drinks as they're served</span></li>
              <li><span className="feature-bullet" /><span>End the night with a stock report — what was used, what's left, what it cost per head — and the leftovers go back on your shelf</span></li>
            </ul>
          </div>
          <div className="function-art fade-in" ref={addRef}>
            <div className="specimen-card">
              <div className="specimen-card-inner">
                <img src={plate('grape-kohler')} alt="Botanical plate — grape vine" loading="lazy" />
              </div>
            </div>
            <p className="plate-credit">Köhler's Medizinal-Pflanzen (1887–98) · public domain</p>
          </div>
        </div>
      </section>

      <div className="section-divider">
        <div className="divider-line" />
        <div className="divider-diamond" />
        <div className="divider-line" />
      </div>

      {/* CHAPTER V — THE NAME */}
      <section className="section name-section">
        <div className="fade-in" ref={addRef}>
          <p className="chapter-label">Chapter V · The Name</p>
          <h2 className="section-title">Why "Tasteologist"?</h2>
          <div className="gold-rule" style={{ justifyContent: 'center' }}><span className="line" /><span className="diamond" /></div>
          <p className="section-body">
            Two things at once: a childhood nickname, and a wink at "mixologist" — a title the
            trade has never quite taken seriously. We take taste seriously. Ourselves, a little
            less.
          </p>
          <div className="name-lineage">
            <div className="lineage-item">
              <p className="lineage-name">MyTinni</p>
              <p className="lineage-role">The origin · cocktails in a can</p>
            </div>
            <div className="lineage-item">
              <p className="lineage-name">Tasteologist</p>
              <p className="lineage-role">The app · taste, not just flavour</p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <div className="form-section" id="get-it">
        <div className="form-inner">
          <p className="section-label" style={{ textAlign: 'center', marginBottom: 8 }}>Chapter VI · Yours</p>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 12, fontSize: 'clamp(30px, 4vw, 44px)' }}>Pour yourself in.</h2>
          <p style={{ textAlign: 'center', fontSize: 15, lineHeight: 1.7, opacity: 0.8, marginBottom: 28 }}>
            Tasteologist is live on both stores.
          </p>
          <div style={{ marginBottom: 48 }}>
            <StoreBadges />
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
              <a className="text-link" href={WEB_APP_URL}>or open the web app</a>
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: 15, lineHeight: 1.7, opacity: 0.75, marginBottom: 32 }}>
            In the trade, building something, or simply curious — tell us about yourself. We're
            evolving constantly and we'd like to hear from you.
          </p>

          {formState === 'success' ? (
            <div className="form-success">
              <h3 className="form-success-title">Message received.</h3>
              <p className="form-success-text">Sit tight — we'll be in touch shortly.</p>
            </div>
          ) : (
            <>
              <div className="form-field">
                <label className="form-label">Name <span style={{ color: 'var(--crimson)' }}>*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="form-input"
                  disabled={formState === 'submitting'}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Email <span style={{ color: 'var(--crimson)' }}>*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setEstablishment(e.target.value)}
                  placeholder="Bar, freelance, investor…"
                  className="form-input"
                  disabled={formState === 'submitting'}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Notes <span className="form-optional">(optional)</span></label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us what you hope to see…"
                  className="form-input form-textarea"
                  disabled={formState === 'submitting'}
                />
              </div>

              {formState === 'error' && <p className="form-error">{errorMsg}</p>}

              <button
                onClick={handleSubmit}
                disabled={formState === 'submitting'}
                className="form-submit"
              >
                {formState === 'submitting' ? 'Sending…' : 'Send'}
              </button>

              <p className="form-consent">
                By submitting, you agree to us storing your details to contact you about Tasteologist.
              </p>
            </>
          )}
        </div>
      </div>

      {/* CLOSING BAND */}
      <div className="cta-section">
        <h2>Built behind the bar.<br />Engineered for taste.</h2>
        <p>
          Twenty years of professional palate, encoded. Tasteologist is not a guide — it's a
          thinking tool.
        </p>
        <StoreBadges />
      </div>

      {/* FOOTER */}
      <footer>
        <span className="footer-logo">Tasteologist</span>
        <ul className="footer-links">
          <li><a href="/terms">Terms &amp; Conditions</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/support">Support</a></li>
          <li><a href="/delete-account">Delete Account</a></li>
          <li><a href="mailto:hello@hello.mytinni.com">Contact</a></li>
        </ul>
        <p className="footer-copy">
          © {new Date().getFullYear()} Tasteologist. All rights reserved. MyTinni is where it began.
          <br />
          Botanical plates from Köhler's Medizinal-Pflanzen (1887–98) and Risso &amp; Poiteau's
          Histoire naturelle des orangers (1818–22), via the Biodiversity Heritage Library and the
          New York Public Library. Public domain.
        </p>
      </footer>
    </>
  );
}

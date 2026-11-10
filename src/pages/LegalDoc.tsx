import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Lang = 'en' | 'fr';
type Section = { heading: string | null; body: string };
type Doc = { title: string; version: string; published_at: string; sections: Section[] };

const MSG = {
  en: { loading: 'Loading…', error: "We couldn't load this document. Please try again.", version: (v: string, d: string) => `Version ${v} · Published ${d}`, label: 'Legal' },
  fr: { loading: 'Chargement…', error: 'Impossible de charger ce document. Veuillez réessayer.', version: (v: string, d: string) => `Version ${v} · Publiée le ${d}`, label: 'Mentions' },
};

export default function LegalDoc({ docKey }: { docKey: 'terms' | 'privacy' }) {
  const initialLang: Lang =
    new URLSearchParams(window.location.search).get('lang') === 'fr' ||
    (new URLSearchParams(window.location.search).get('lang') !== 'en' &&
      (navigator.language || 'en').toLowerCase().startsWith('fr'))
      ? 'fr'
      : 'en';
  const [lang, setLang] = useState<Lang>(initialLang);
  const [doc, setDoc] = useState<Doc | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    (async () => {
      try {
        const { data: docs, error } = await supabase
          .from('legal_documents')
          .select('id,title,version,published_at')
          .eq('doc_key', docKey)
          .eq('locale', lang)
          .not('published_at', 'is', null)
          .order('published_at', { ascending: false })
          .limit(1);
        if (error || !docs || docs.length === 0) throw error ?? new Error('none');
        const d = docs[0];
        const { data: sections, error: sErr } = await supabase
          .from('legal_document_sections')
          .select('heading,body')
          .eq('document_id', d.id)
          .order('sort_order', { ascending: true });
        if (sErr || !sections) throw sErr ?? new Error('none');
        if (!cancelled) {
          setDoc({ title: d.title, version: d.version, published_at: d.published_at, sections });
          setState('ready');
        }
      } catch {
        if (!cancelled) setState('error');
      }
    })();
    return () => { cancelled = true; };
  }, [docKey, lang]);

  const m = MSG[lang];
  const date = doc
    ? new Date(doc.published_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mate+SC&family=Mate:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --red: rgb(139, 26, 26);
          --accent: rgb(238, 139, 96);
          --cream: rgb(232, 213, 181);
          --text: rgb(60, 20, 20);
        }
        body { background-color: var(--cream); color: var(--text); font-family: 'Mate', serif; }
        body::before {
          content: ''; position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0; opacity: 0.4;
        }
        nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 48px;
          background: rgba(232, 213, 181, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(139, 26, 26, 0.15);
        }
        .nav-logo { font-family: 'Mate SC', serif; font-size: 20px; color: var(--red); text-decoration: none; }
        .lang-toggle button {
          background: none; border: none; cursor: pointer; font-family: 'Mate', serif;
          font-size: 13px; color: var(--red); opacity: 0.5; padding: 4px 8px;
          letter-spacing: 0.05em; text-decoration: underline; text-underline-offset: 3px;
        }
        .lang-toggle button.active { opacity: 1; text-decoration: none; cursor: default; font-family: 'Mate SC', serif; }
        .page-wrap { max-width: 780px; margin: 0 auto; padding: 64px 48px 100px; position: relative; z-index: 1; }
        .page-label { font-family: 'Mate SC', serif; font-size: 11px; letter-spacing: 0.2em; color: var(--accent); margin-bottom: 12px; text-transform: uppercase; }
        h1 { font-family: 'Mate SC', serif; font-size: 42px; color: var(--red); margin-bottom: 8px; line-height: 1.1; }
        .last-updated { font-size: 13px; opacity: 0.5; margin-bottom: 40px; font-style: italic; }
        .ornament { display: flex; align-items: center; gap: 16px; margin-bottom: 40px; }
        .ornament-line { flex: 1; height: 1px; background: rgba(139,26,26,0.2); }
        .ornament-diamond { width: 7px; height: 7px; background: var(--accent); transform: rotate(45deg); flex-shrink: 0; }
        h2 { font-family: 'Mate SC', serif; font-size: 20px; color: var(--red); margin: 40px 0 12px; letter-spacing: 0.03em; }
        .doc-body { font-size: 15px; line-height: 1.85; opacity: 0.82; margin-bottom: 14px; white-space: pre-line; }
        .doc-state { font-size: 15px; opacity: 0.6; font-style: italic; margin-top: 24px; }
        @media (max-width: 640px) {
          nav { padding: 14px 20px; }
          .page-wrap { padding: 48px 20px 80px; }
          h1 { font-size: 30px; }
        }
      `}</style>
      <nav>
        <a className="nav-logo" href="/">MyTinni</a>
        <div className="lang-toggle" aria-label="Language">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>English</button>
          <button className={lang === 'fr' ? 'active' : ''} onClick={() => setLang('fr')} aria-pressed={lang === 'fr'}>Français</button>
        </div>
      </nav>
      <div className="page-wrap">
        <div className="page-label">{m.label}</div>
        {state === 'loading' && <p className="doc-state">{m.loading}</p>}
        {state === 'error' && <p className="doc-state">{m.error}</p>}
        {state === 'ready' && doc && (
          <>
            <h1>{doc.title}</h1>
            <p className="last-updated">{m.version(doc.version, date)}</p>
            <div className="ornament"><div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line" /></div>
            {doc.sections.map((s, i) => (
              <div key={i}>
                {s.heading && <h2>{s.heading}</h2>}
                <div className="doc-body">{s.body}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

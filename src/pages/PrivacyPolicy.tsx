import LegalDoc from './LegalDoc';

// The policy text now lives in the database (legal_documents / legal_document_sections)
// and is rendered live — the same single source the app's tc-gate and /privacy route use.
// Publishing a new version in the DB updates this page with no site deploy.
export default function Privacy() {
  return <LegalDoc docKey="privacy" />;
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RegistrationForm from '../components/RegistrationForm'
import { LuCircleCheck, LuBan } from 'react-icons/lu'

const PORTAL_LAUNCH_DATE = new Date('2026-02-19')
const DEADLINE = new Date(PORTAL_LAUNCH_DATE)
DEADLINE.setDate(DEADLINE.getDate() + 21)

export default function RegistrationPage() {
  const navigate = useNavigate()
  const [isPortalClosed, setIsPortalClosed] = useState(false)
  const [successData, setSuccessData] = useState(null)

  useEffect(() => {
    setIsPortalClosed(Date.now() > DEADLINE)
  }, [])

  const handleSuccess = (formNo) => {
    setSuccessData({ formNo })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={s.page}>

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logoWrap}>
            <img
              src="/OyoLogo.png"
              alt="Oyo State"
              style={s.logo}
            />
          </div>
          <div style={s.headerCenter}>
            <p style={s.headerSupra}>GOVERNMENT OF OYO STATE</p>
            <h1 style={s.headerTitle}>AMOTEKUN CORPS RECRUITMENT</h1>
            <p style={s.headerSub}>Online Registration Portal | 2026</p>
          </div>
          <div style={s.logoWrap}>
            <img
              src="/amo.jpg"
              alt="Amotekun"
              style={s.logo}
            />
          </div>
        </div>
        <div style={s.headerStripe} />
      </header>

      {/* ── BREADCRUMB ── */}
      <div style={s.breadcrumb}>
        <span style={s.breadcrumbLink} onClick={() => navigate('/')}>Home</span>
        <span style={s.breadcrumbSep}> › </span>
        <span>Registration Form</span>
      </div>

      {/* ── SUCCESS BANNER ── */}
      {successData && (
        <div style={s.successBanner}>
          <div style={s.successIcon}><LuCircleCheck size={28} color="#fff" /></div>
          <div style={s.successBody}>
            <h2 style={s.successTitle}>Registration Submitted | Form No: {successData.formNo}</h2>
            <p style={s.successText}>
              Your registration slip has been downloaded automatically. Please <strong>print it</strong> and bring it
              to the official Amotekun screening exercise venue.
            </p>
            <p style={s.successText}>
              <strong>Keep your form number safe:</strong> {successData.formNo}
            </p>
          </div>
        </div>
      )}

      {/* ── PORTAL CLOSED BANNER ── */}
      {isPortalClosed && (
        <div style={s.closedBanner}>
          <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <LuBan size={18} /> REGISTRATION PORTAL CLOSED
          </strong>
          <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
            The registration period has ended. No new applications are being accepted.
          </p>
        </div>
      )}

      {/* ── FORM AREA ── */}
      <div style={s.formWrap}>
        <div style={s.formCard}>
          {!successData && (
            <div style={s.formCardHeader}>
              <h2 style={s.formCardTitle}>Application Form</h2>
              <p style={s.formCardNote}>
                Fields marked <span style={{ color: '#c0392b' }}>*</span> are required.
                Ensure all information is accurate before submitting.
              </p>
            </div>
          )}
          <RegistrationForm
            onSuccess={handleSuccess}
            isPortalClosed={isPortalClosed}
            submitted={!!successData}
          />
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <p style={s.footerLine}>Oyo State Security Network | Operation Amotekun</p>
          <p style={s.footerLine}>
            © {new Date().getFullYear()} Government of Oyo State. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

const s = {
  page: {
    fontFamily: 'var(--font-body, Inter, sans-serif)',
    backgroundColor: '#f4f6f4',
    color: '#1a1a1a',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },

  /* Header — same as LandingPage */
  header: {
    backgroundColor: '#0f4c0f',
    color: '#fff',
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 40px',
    maxWidth: '1100px',
    margin: '0 auto',
    gap: '20px',
  },
  headerCenter: { textAlign: 'center', flex: 1 },
  headerSupra: {
    fontSize: '11px', letterSpacing: '0.15em', fontWeight: '600',
    color: '#c8960c', margin: '0 0 4px 0', textTransform: 'uppercase',
  },
  headerTitle: {
    fontFamily: 'var(--font-heading, Merriweather, Georgia, serif)',
    fontSize: '22px', fontWeight: '900', margin: '0 0 4px 0', lineHeight: '1.2',
  },
  headerSub: {
    fontSize: '13px', letterSpacing: '0.08em', color: '#ffc107',
    margin: 0, fontWeight: '500',
  },
  logoWrap: {
    width: '70px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  },
  logo: { maxWidth: '70px', maxHeight: '70px', objectFit: 'contain' },
  headerStripe: {
    height: '4px',
    background: 'linear-gradient(90deg, #c8960c 0%, #ffc107 50%, #c8960c 100%)',
  },

  /* Breadcrumb */
  breadcrumb: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    padding: '10px 24px',
    fontSize: '13px',
    color: '#555',
    maxWidth: '100%',
  },
  breadcrumbLink: {
    color: '#1a6b1a',
    cursor: 'pointer',
    fontWeight: '600',
    textDecoration: 'underline',
  },
  breadcrumbSep: { margin: '0 6px', color: '#aaa' },

  /* Success */
  successBanner: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    backgroundColor: '#f0faf0',
    border: '2px solid #1a6b1a',
    borderRadius: '8px',
    padding: '24px 28px',
    margin: '24px auto',
    maxWidth: '860px',
    animation: 'slideDown 0.3s ease-out',
  },
  successIcon: {
    width: '48px', height: '48px', flexShrink: 0,
    backgroundColor: '#1a6b1a', color: '#fff',
    borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '24px', fontWeight: '700',
  },
  successBody: { flex: 1 },
  successTitle: {
    fontFamily: 'var(--font-heading, Merriweather, Georgia, serif)',
    fontSize: '18px', fontWeight: '700', color: '#0f4c0f',
    margin: '0 0 10px 0',
  },
  successText: { fontSize: '14px', color: '#333', margin: '6px 0' },

  /* Closed banner */
  closedBanner: {
    backgroundColor: '#7f1d1d',
    color: '#fff',
    padding: '18px 24px',
    textAlign: 'center',
    fontSize: '15px',
  },

  /* Form wrap */
  formWrap: {
    flex: 1,
    maxWidth: '880px',
    width: '100%',
    margin: '0 auto',
    padding: '24px 24px 60px',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  formCardHeader: {
    backgroundColor: '#f9faf9',
    borderBottom: '1px solid #e8e8e8',
    padding: '24px 32px',
  },
  formCardTitle: {
    fontFamily: 'var(--font-heading, Merriweather, Georgia, serif)',
    fontSize: '20px', fontWeight: '700', color: '#0f4c0f', margin: '0 0 8px 0',
  },
  formCardNote: { fontSize: '13.5px', color: '#666', margin: 0 },

  /* Footer */
  footer: {
    backgroundColor: '#0f4c0f',
    borderTop: '4px solid #c8960c',
    marginTop: 'auto',
  },
  footerInner: {
    maxWidth: '1100px', margin: '0 auto',
    padding: '20px 24px', textAlign: 'center',
  },
  footerLine: { color: '#ccc', fontSize: '13px', margin: '4px 0' },
}

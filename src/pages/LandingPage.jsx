import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CountdownBanner from '../components/CountdownBanner'
import { LuHouse, LuCalendar, LuFileText, LuShield, LuCheck, LuTriangleAlert, LuArrowRight } from 'react-icons/lu'

const PORTAL_LAUNCH_DATE = new Date('2026-02-19')
const DEADLINE = new Date(PORTAL_LAUNCH_DATE)
DEADLINE.setDate(DEADLINE.getDate() + 21)

const DEADLINE_DISPLAY = DEADLINE.toLocaleDateString('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric',
})

export default function LandingPage() {
  const navigate = useNavigate()
  const [isPortalClosed, setIsPortalClosed] = useState(false)

  useEffect(() => {
    setIsPortalClosed(Date.now() > DEADLINE)
  }, [])

  return (
    <div style={s.page}>
      <CountdownBanner />

      {/* ── OFFICIAL HEADER ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logoWrap}>
            <img
              src="/oyo-state-logo.png"
              alt="Oyo State Seal"
              style={s.logo}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>

          <div style={s.headerCenter}>
            <p style={s.headerSupra}>GOVERNMENT OF OYO STATE</p>
            <h1 style={s.headerTitle}>OYO STATE SECURITY NETWORK</h1>
            <p style={s.headerSub}>OPERATION AMOTEKUN</p>
          </div>

          <div style={s.logoWrap}>
            <img
              src="/amotekun-logo.png"
              alt="Amotekun Corps"
              style={s.logo}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        </div>
        <div style={s.headerStripe} />
      </header>

      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <p style={s.heroEyebrow}>OFFICIAL NOTICE | 2026 RECRUITMENT EXERCISE</p>
          <h2 style={s.heroTitle}>AMOTEKUN CORPS<br />RECRUITMENT EXERCISE</h2>
          <p style={s.heroDesc}>
            The Oyo State Government invites applications from qualified indigenes to serve in
            the Oyo State Security Network, Operation Amotekun.
          </p>
          <button
            style={{
              ...s.ctaBtn,
              ...(isPortalClosed ? s.ctaBtnClosed : {}),
            }}
            onClick={() => !isPortalClosed && navigate('/register')}
            disabled={isPortalClosed}
          >
            {isPortalClosed ? 'REGISTRATION CLOSED' : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                PROCEED TO REGISTER <LuArrowRight size={18} />
              </span>
            )}
          </button>
        </div>
      </section>

      {/* ── NOTICE BAND ── */}
      <div style={s.noticeBand}>
        <span style={s.noticeBandText}>
          <LuTriangleAlert size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          This recruitment is <strong>FREE AND NOT FOR SALE</strong>. Do not pay money to anyone.
          &nbsp;|&nbsp; Portal closes: <strong>{DEADLINE_DISPLAY}</strong>
        </span>
      </div>

      <main style={s.main}>

        {/* ── ABOUT ── */}
        <Section title="About the Amotekun Corps">
          <p style={s.bodyText}>
            The Amotekun Corps is a community-driven, state-based security network established by
            the Oyo State Government to complement the efforts of the Nigerian Police Force and other
            federal security agencies. It represents a proactive approach to community safety by
            mobilising local resources and personnel to address emerging security challenges.
          </p>
          <p style={s.bodyText}>
            Amotekun operatives work in collaboration with traditional rulers, community leaders, and
            law enforcement agencies to maintain peace, order, and the safety of residents across
            all 33 local government areas of Oyo State.
          </p>
          <p style={s.bodyText}>
            This recruitment exercise is an opportunity for qualified Oyo State indigenes to contribute
            to the security and development of their state. We seek committed, disciplined, and
            patriotic individuals ready to serve with integrity.
          </p>
        </Section>

        {/* ── ELIGIBILITY ── */}
        <Section title="Eligibility Requirements">
          <div style={s.eligGrid}>
            {[
              { Icon: LuHouse,    text: 'Must be an Oyo State indigene' },
              { Icon: LuCalendar, text: 'Must be between 18 and 45 years of age' },
              { Icon: LuFileText, text: 'Minimum academic qualification: FSLC' },
              { Icon: LuShield,   text: 'Must be physically and medically fit' },
              { Icon: LuCheck,    text: 'Must be of good character and conduct' },
            ].map(({ Icon, text }) => (
              <div key={text} style={s.eligCard}>
                <span style={s.eligIcon}><Icon size={20} color="#1a6b1a" /></span>
                <span style={s.eligText}>{text}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── HOW IT WORKS ── */}
        <Section title="How It Works">
          <div style={s.stepsRow}>
            {[
              { n: '01', title: 'Complete the Form', desc: 'Fill in all required personal and background information accurately online.' },
              { n: '02', title: 'Download Your Slip', desc: 'A personalised PDF registration slip is generated automatically for you.' },
              { n: '03', title: 'Print & Present', desc: 'Print your slip and bring it to the official screening exercise venue.' },
              { n: '04', title: 'Undergo Screening', desc: 'Attend physical, medical, and background assessment at the venue.' },
            ].map(step => (
              <div key={step.n} style={s.step}>
                <div style={s.stepBadge}>{step.n}</div>
                <h4 style={s.stepTitle}>{step.title}</h4>
                <p style={s.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── IMPORTANT NOTICE ── */}
        <div style={s.notice}>
          <div style={s.noticeHeader}>
            <LuTriangleAlert size={22} color="#c0392b" />
            <h3 style={s.noticeTitle}>IMPORTANT NOTICE</h3>
          </div>
          <ul style={s.noticeList}>
            <li>This registration portal will close on <strong>{DEADLINE_DISPLAY}</strong>. Applications submitted after this date will <strong>NOT</strong> be accepted.</li>
            <li>This recruitment exercise is <strong>FREE OF CHARGE</strong> and is <strong>NOT FOR SALE</strong>.</li>
            <li>Do <strong>NOT</strong> pay money to any individual or agent claiming to process your application.</li>
            <li>Providing false information will lead to immediate disqualification and possible prosecution.</li>
          </ul>
        </div>

        {/* ── CTA ── */}
        <div style={s.ctaSection}>
          <button
            style={{
              ...s.ctaBtn,
              fontSize: '18px',
              padding: '18px 56px',
              ...(isPortalClosed ? s.ctaBtnClosed : {}),
            }}
            onClick={() => !isPortalClosed && navigate('/register')}
            disabled={isPortalClosed}
          >
            {isPortalClosed ? 'REGISTRATION CLOSED' : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                PROCEED TO REGISTER <LuArrowRight size={18} />
              </span>
            )}
          </button>
          {!isPortalClosed && (
            <p style={s.ctaNote}>
              Registration closes on {DEADLINE_DISPLAY}. Complete your application before the deadline.
            </p>
          )}
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <p style={s.footerLine}>Oyo State Security Network | Operation Amotekun</p>
          <p style={s.footerLine}>
            © {new Date().getFullYear()} Government of Oyo State. All rights reserved.
          </p>
          <p style={{ ...s.footerLine, color: '#aaa', marginTop: '8px', fontSize: '12px' }}>
            This is an official government portal. Unauthorised access or misuse is prohibited.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section style={s.section}>
      <div style={s.sectionHeader}>
        <h3 style={s.sectionTitle}>{title}</h3>
        <div style={s.sectionRule} />
      </div>
      {children}
    </section>
  )
}

/* ─── STYLES ─── */
const s = {
  page: {
    fontFamily: 'var(--font-body, Inter, sans-serif)',
    color: '#1a1a1a',
    backgroundColor: '#f4f6f4',
    lineHeight: '1.7',
  },

  /* Header */
  header: {
    backgroundColor: '#0f4c0f',
    color: '#fff',
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 40px',
    maxWidth: '1100px',
    margin: '0 auto',
    gap: '20px',
  },
  headerCenter: {
    textAlign: 'center',
    flex: 1,
  },
  headerSupra: {
    fontSize: '11px',
    letterSpacing: '0.15em',
    fontWeight: '600',
    color: '#c8960c',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontFamily: 'var(--font-heading, Merriweather, Georgia, serif)',
    fontSize: '26px',
    fontWeight: '900',
    margin: '0 0 4px 0',
    lineHeight: '1.2',
    letterSpacing: '0.02em',
  },
  headerSub: {
    fontSize: '13px',
    letterSpacing: '0.12em',
    color: '#ffc107',
    margin: 0,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  logoWrap: {
    width: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logo: {
    maxWidth: '80px',
    maxHeight: '80px',
    objectFit: 'contain',
  },
  headerStripe: {
    height: '5px',
    background: 'linear-gradient(90deg, #c8960c 0%, #ffc107 50%, #c8960c 100%)',
  },

  /* Hero */
  hero: {
    position: 'relative',
    background: 'linear-gradient(135deg, #0f4c0f 0%, #1a6b1a 55%, #246b24 100%)',
    padding: '80px 24px',
    textAlign: 'center',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(200,150,12,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    maxWidth: '760px',
    margin: '0 auto',
  },
  heroEyebrow: {
    fontSize: '11px',
    letterSpacing: '0.2em',
    color: '#ffc107',
    fontWeight: '700',
    margin: '0 0 18px 0',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: 'var(--font-heading, Merriweather, Georgia, serif)',
    fontSize: 'clamp(28px, 5vw, 48px)',
    fontWeight: '900',
    color: '#fff',
    margin: '0 0 22px 0',
    lineHeight: '1.15',
    letterSpacing: '0.02em',
  },
  heroDesc: {
    fontSize: '17px',
    color: 'rgba(255,255,255,0.85)',
    margin: '0 auto 36px',
    maxWidth: '600px',
    lineHeight: '1.7',
  },

  /* Notice Band */
  noticeBand: {
    backgroundColor: '#7f1d1d',
    padding: '10px 20px',
    textAlign: 'center',
  },
  noticeBandText: {
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.02em',
  },

  /* Main content */
  main: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 24px 60px',
  },

  /* Sections */
  section: {
    marginTop: '56px',
  },
  sectionHeader: {
    marginBottom: '28px',
  },
  sectionTitle: {
    fontFamily: 'var(--font-heading, Merriweather, Georgia, serif)',
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f4c0f',
    margin: '0 0 10px 0',
  },
  sectionRule: {
    height: '3px',
    width: '60px',
    backgroundColor: '#c8960c',
    borderRadius: '2px',
  },
  bodyText: {
    fontSize: '15.5px',
    color: '#333',
    marginBottom: '14px',
    lineHeight: '1.8',
  },

  /* Eligibility */
  eligGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '12px',
  },
  eligCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    backgroundColor: '#fff',
    border: '1px solid #d6e8d6',
    borderLeft: '4px solid #1a6b1a',
    borderRadius: '6px',
    padding: '16px 18px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  eligIcon: {
    fontSize: '20px',
    flexShrink: 0,
    marginTop: '1px',
  },
  eligText: {
    fontSize: '15px',
    color: '#1a1a1a',
    fontWeight: '500',
  },

  /* Steps */
  stepsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  step: {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '24px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  stepBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    backgroundColor: '#0f4c0f',
    color: '#ffc107',
    fontSize: '15px',
    fontWeight: '800',
    borderRadius: '50%',
    marginBottom: '14px',
    fontFamily: 'var(--font-heading, Merriweather, Georgia, serif)',
  },
  stepTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f4c0f',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  stepDesc: {
    fontSize: '13.5px',
    color: '#555',
    lineHeight: '1.6',
    margin: 0,
  },

  /* Important Notice */
  notice: {
    marginTop: '48px',
    backgroundColor: '#fff5f5',
    border: '2px solid #c0392b',
    borderRadius: '8px',
    padding: '24px 28px',
    boxShadow: '0 2px 8px rgba(192,57,43,0.12)',
  },
  noticeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  noticeIcon: {
    fontSize: '22px',
    color: '#c0392b',
  },
  noticeTitle: {
    fontFamily: 'var(--font-heading, Merriweather, Georgia, serif)',
    fontSize: '18px',
    fontWeight: '700',
    color: '#c0392b',
    margin: 0,
  },
  noticeList: {
    paddingLeft: '20px',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  /* CTA */
  ctaSection: {
    marginTop: '56px',
    textAlign: 'center',
    padding: '48px 0',
    borderTop: '1px solid #ddd',
  },
  ctaBtn: {
    display: 'inline-block',
    padding: '16px 48px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#1a6b1a',
    border: '2px solid #1a6b1a',
    borderRadius: '4px',
    cursor: 'pointer',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    transition: 'background-color 0.2s, transform 0.1s',
    boxShadow: '0 4px 16px rgba(26,107,26,0.35)',
    fontFamily: 'var(--font-body, Inter, sans-serif)',
  },
  ctaBtnClosed: {
    backgroundColor: '#888',
    borderColor: '#888',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  ctaNote: {
    marginTop: '14px',
    fontSize: '13px',
    color: '#666',
  },

  /* Footer */
  footer: {
    backgroundColor: '#0f4c0f',
    borderTop: '4px solid #c8960c',
  },
  footerInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '28px 24px',
    textAlign: 'center',
  },
  footerLine: {
    color: '#ccc',
    fontSize: '13px',
    margin: '4px 0',
  },
}

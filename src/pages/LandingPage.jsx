import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CountdownBanner from '../components/CountdownBanner'
import { LuHouse, LuCalendar, LuShield, LuCheck, LuTriangleAlert, LuArrowRight } from 'react-icons/lu'

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
    <div className="font-sans text-gray-900 bg-[#f4f6f4] leading-[1.7]">
      <CountdownBanner />

      {/* ── OFFICIAL HEADER ── */}
      <header className="bg-brand border-b-[5px] border-gold">
        <div className="flex items-center w-full px-6 md:px-10 py-4 md:py-5 flex-wrap md:flex-nowrap justify-between gap-2">

          {/* Col 1: Oyo Logo */}
          <div className="flex-none md:flex-1 flex justify-start items-center">
            <img src="/OyoLogo.png" alt="Oyo State Seal" className="w-14 h-14 md:w-20 md:h-20 object-contain" />
          </div>

          {/* Col 2: Center text — perfectly centered on full page width */}
          <div className="order-last md:order-none w-full md:flex-1 flex flex-col items-center text-center py-1 md:py-0">
            <p className="text-[10px] md:text-[11px] tracking-[0.15em] font-semibold text-white/70 uppercase mb-1">
              GOVERNMENT OF OYO STATE
            </p>
            <h1 className="font-display text-sm md:text-2xl lg:text-[26px] font-black leading-tight tracking-[0.02em] text-white">
              OYO STATE SECURITY NETWORK AGENCY
            </h1>
            <p className="text-[11px] md:text-[13px] tracking-[0.12em] text-white/80 font-semibold uppercase mt-1">
              and ÀMỌ̀TẸ́KÙN CORPS
            </p>
          </div>

          {/* Col 3: ÀMỌ̀TẸ́KÙN Logo */}
          <div className="flex-none md:flex-1 flex justify-end items-center">
            <img src="/amo.jpg" alt="ÀMỌ̀TẸ́KÙN Corps" className="w-14 h-14 md:w-20 md:h-20 object-contain" />
          </div>

        </div>
      </header>

      {/* ── HERO ── */}
      <section
        className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0d2b0d 0%, #0f4c0f 50%, #1a6b1a 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, rgba(201,168,76,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-[760px] mx-auto">
          <p className="text-[11px] tracking-[0.2em] text-gold-bright font-bold mb-4 uppercase">
            OFFICIAL NOTICE | 2026 RECRUITMENT EXERCISE
          </p>
          <h2 className="font-display text-[clamp(28px,5vw,52px)] font-black text-white mb-5 leading-[1.1] tracking-[0.02em]">
            ÀMỌ̀TẸ́KÙN CORPS<br />RECRUITMENT EXERCISE
          </h2>
          <p className="text-[17px] text-white/85 mb-9 max-w-[560px] mx-auto leading-[1.8]">
            Join the frontline of community security across all 33 local government areas of Oyo State.
            Applications are open to qualified indigenes aged 18–50.
          </p>
          <button
            className={`inline-flex items-center gap-2 px-12 py-4 text-base font-bold uppercase tracking-[0.06em] rounded border-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
              isPortalClosed
                ? 'bg-gray-500 border-gray-500 text-white cursor-not-allowed shadow-none'
                : 'bg-gold-bright border-gold-bright text-gray-900 shadow-[0_4px_20px_rgba(255,193,7,0.45)] hover:shadow-[0_8px_28px_rgba(255,193,7,0.6)] cursor-pointer'
            }`}
            onClick={() => !isPortalClosed && navigate('/register')}
            disabled={isPortalClosed}
          >
            {isPortalClosed ? 'REGISTRATION CLOSED' : (
              <><span>PROCEED TO REGISTER</span><LuArrowRight size={18} /></>
            )}
          </button>
        </div>
      </section>

      {/* ── NOTICE BAND ── */}
      <div className="bg-[#7f1d1d] py-2.5 px-5 text-center">
        <span className="text-white text-[13px] font-medium tracking-[0.02em]">
          <LuTriangleAlert size={14} className="inline align-middle mr-1.5" />
          This recruitment is <strong>FREE AND NOT FOR SALE</strong>. Do not pay money to anyone.
          &nbsp;|&nbsp; Portal closes: <strong>{DEADLINE_DISPLAY}</strong>
        </span>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-5xl mx-auto px-6 pb-16">

        {/* ── ABOUT ── */}
        <Section title="About the ÀMỌ̀TẸ́KÙN Corps">
          <p className="text-[15.5px] text-gray-700 mb-4 leading-[1.8]">
            The ÀMỌ̀TẸ́KÙN Corps is a community-driven, state-based security outfit established by
            the Oyo State Government to complement the efforts of the Nigerian Police Force and other
            federal security agencies. It represents a proactive approach to community safety by
            mobilising local resources and personnel to address emerging security challenges.
          </p>
          <p className="text-[15.5px] text-gray-700 mb-4 leading-[1.8]">
            ÀMỌ̀TẸ́KÙN operatives work in collaboration with traditional rulers, community leaders, and
            law enforcement agencies to maintain peace, order, and the safety of residents across
            all 33 local government areas of Oyo State.
          </p>
          <p className="text-[15.5px] text-gray-700 mb-4 leading-[1.8]">
            This recruitment exercise is an opportunity for qualified Oyo State indigenes to contribute
            to the security and development of their state. We seek committed, disciplined, and
            patriotic individuals ready to serve with integrity.
          </p>
        </Section>

        {/* ── ELIGIBILITY ── */}
        <Section title="Eligibility Requirements">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { Icon: LuHouse,    text: 'Must be an Oyo State indigene' },
              { Icon: LuCalendar, text: 'Must be between 18 and 50 years of age' },
              { Icon: LuShield,   text: 'Must be physically and medically fit' },
              { Icon: LuCheck,    text: 'Must be of good character and conduct' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-start gap-3.5 bg-white border border-[#d6e8d6] border-l-4 border-l-brand-mid rounded-md px-4 py-4 shadow-sm">
                <span className="shrink-0 mt-0.5"><Icon size={20} color="#1a6b1a" /></span>
                <span className="text-[15px] text-gray-900 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── HOW IT WORKS ── */}
        <Section title="How It Works">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { n: '01', title: 'Fill the Form',        desc: 'Fill in all required fields on the registration form.' },
              { n: '02', title: 'Complete Application', desc: 'Once done, click the "COMPLETE APPLICATION" button.' },
              { n: '03', title: 'Review Your Details',  desc: 'A popup will appear — review all your details carefully.' },
              { n: '04', title: 'Generate Your Form',   desc: 'Click "SUBMIT & GENERATE FORM" to download your Registration Form.' },
              { n: '05', title: 'Print & Attend',       desc: 'Print the downloaded form and bring it to the screening exercise.' },
            ].map(step => (
              <div key={step.n} className="bg-white border border-gray-200 rounded-lg px-5 py-6 shadow-sm">
                <div className="inline-flex items-center justify-center w-11 h-11 bg-brand text-gold-bright text-[15px] font-extrabold rounded-full mb-3.5 font-display">
                  {step.n}
                </div>
                <h4 className="font-display text-[15px] font-bold text-brand mb-2">{step.title}</h4>
                <p className="text-[13.5px] text-gray-500 leading-[1.6] m-0">{step.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── IMPORTANT NOTICE ── */}
        <div className="mt-12 bg-[#fff5f5] border-2 border-danger rounded-lg px-7 py-6 shadow-[0_2px_8px_rgba(192,57,43,0.12)]">
          <div className="flex items-center gap-2.5 mb-4">
            <LuTriangleAlert size={22} color="#c0392b" />
            <h3 className="font-display text-lg font-bold text-danger m-0">IMPORTANT NOTICE</h3>
          </div>
          <ul className="pl-5 m-0 flex flex-col gap-2.5 text-[15px] text-gray-800 leading-[1.7]">
            <li>This registration portal will close on <strong>{DEADLINE_DISPLAY}</strong>. Applications submitted after this date will <strong>NOT</strong> be accepted.</li>
            <li>This recruitment exercise is <strong>FREE OF CHARGE</strong> and is <strong>NOT FOR SALE</strong>.</li>
            <li>Do <strong>NOT</strong> pay money to any individual or agent claiming to process your application.</li>
            <li>Providing false information will lead to immediate disqualification and possible prosecution.</li>
          </ul>
        </div>

        {/* ── CTA ── */}
        <div className="mt-14 text-center py-12 border-t border-gray-300">
          <button
            className={`inline-flex items-center gap-2 px-14 py-5 text-lg font-bold uppercase tracking-[0.06em] rounded border-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
              isPortalClosed
                ? 'bg-gray-500 border-gray-500 text-white cursor-not-allowed shadow-none'
                : 'bg-brand-mid border-brand-mid text-white shadow-[0_4px_16px_rgba(26,107,26,0.35)] hover:shadow-[0_8px_28px_rgba(26,107,26,0.45)] cursor-pointer'
            }`}
            onClick={() => !isPortalClosed && navigate('/register')}
            disabled={isPortalClosed}
          >
            {isPortalClosed ? 'REGISTRATION CLOSED' : (
              <><span>PROCEED TO REGISTER</span><LuArrowRight size={18} /></>
            )}
          </button>
          {!isPortalClosed && (
            <p className="mt-3.5 text-[13px] text-gray-500">
              Registration closes on {DEADLINE_DISPLAY}. Complete your application before the deadline.
            </p>
          )}
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-brand border-t-4 border-gold">
        <div className="max-w-[1100px] mx-auto px-6 py-7 text-center">
          <p className="text-[#ccc] text-[13px] my-1">
            Oyo State Security Network Agency and ÀMỌ̀TẸ́KÙN Corps
          </p>
          <p className="text-[#ccc] text-[13px] my-1">
            © {new Date().getFullYear()} Government of Oyo State. All rights reserved.
          </p>
          <p className="text-[#aaa] text-[12px] mt-2">
            This is an official government portal. Unauthorised access or misuse is prohibited.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mt-14 md:mt-20">
      <div className="mb-7">
        <h3 className="font-display text-[22px] font-bold text-brand mb-2.5">{title}</h3>
        <div className="h-[3px] w-[60px] bg-gold rounded-sm" />
      </div>
      {children}
    </section>
  )
}

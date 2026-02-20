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
    <div className="font-sans bg-[#f4f6f4] text-gray-900 min-h-screen flex flex-col">

      {/* ── HEADER ── */}
      <header className="bg-brand border-b-[5px] border-gold">
        <div className="flex items-center w-full px-6 md:px-10 py-4 md:py-5 flex-wrap md:flex-nowrap justify-between gap-2">

          {/* Col 1: Oyo Logo */}
          <div className="flex-none md:flex-1 flex justify-start items-center">
            <img src="/OyoLogo.png" alt="Oyo State" className="w-14 h-14 md:w-[70px] md:h-[70px] object-contain" />
          </div>

          {/* Col 2: Center text */}
          <div className="order-last md:order-none w-full md:flex-1 flex flex-col items-center text-center py-1 md:py-0">
            <p className="text-[10px] md:text-[11px] tracking-[0.15em] font-semibold text-white/70 uppercase mb-1">
              GOVERNMENT OF OYO STATE
            </p>
            <h1 className="font-display text-sm md:text-[22px] font-black leading-tight tracking-[0.02em] text-white">
              OYO STATE SECURITY NETWORK AGENCY
            </h1>
            <p className="text-[11px] md:text-[13px] tracking-[0.08em] text-white/80 font-medium mt-1">
              Online Registration Portal | 2026
            </p>
          </div>

          {/* Col 3: Amotekun Logo */}
          <div className="flex-none md:flex-1 flex justify-end items-center">
            <img src="/amo.jpg" alt="Amotekun Corps" className="w-14 h-14 md:w-[70px] md:h-[70px] object-contain" />
          </div>

        </div>
      </header>

      {/* ── BREADCRUMB ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-2.5 text-[13px] text-gray-500">
        <span
          className="text-brand-mid cursor-pointer font-semibold underline hover:text-brand transition-colors"
          onClick={() => navigate('/')}
        >
          Home
        </span>
        <span className="mx-1.5 text-gray-400"> › </span>
        <span>Registration Form</span>
      </div>

      {/* ── SUCCESS BANNER ── */}
      {successData && (
        <div
          className="flex gap-5 items-start bg-[#f0faf0] border-2 border-brand-mid rounded-lg px-7 py-6 mx-auto my-6 max-w-[860px] w-full"
          style={{ animation: 'slideDown 0.3s ease-out' }}
        >
          <div className="w-12 h-12 shrink-0 bg-brand-mid text-white rounded-full flex items-center justify-center">
            <LuCircleCheck size={28} color="#fff" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-bold text-brand mb-2.5">
              Registration Submitted | Form No: {successData.formNo}
            </h2>
            <p className="text-sm text-gray-700 my-1.5">
              Your Registration Form has been downloaded automatically. Please <strong>print it</strong> and bring it
              to the official Amotekun Corps screening exercise venue.
            </p>
            <p className="text-sm text-gray-700 my-1.5">
              <strong>Keep your form number safe:</strong> {successData.formNo}
            </p>
          </div>
        </div>
      )}

      {/* ── PORTAL CLOSED BANNER ── */}
      {isPortalClosed && (
        <div className="bg-[#7f1d1d] text-white px-6 py-4 text-center text-[15px]">
          <strong className="inline-flex items-center gap-2">
            <LuBan size={18} /> REGISTRATION PORTAL CLOSED
          </strong>
          <p className="mt-2 text-sm">
            The registration period has ended. No new applications are being accepted.
          </p>
        </div>
      )}

      {/* ── FORM AREA ── */}
      <div className="flex-1 max-w-[880px] w-full mx-auto px-4 md:px-6 pt-6 pb-16">
        <div className="bg-white rounded-lg shadow-[0_2px_16px_rgba(0,0,0,0.08)] overflow-hidden">
          {!successData && (
            <div className="bg-[#f9faf9] border-b border-gray-200 px-6 md:px-8 py-6">
              <h2 className="font-display text-xl font-bold text-brand mb-2">Application Form</h2>
              <p className="text-[13.5px] text-gray-500 m-0">
                Fields marked <span className="text-danger">*</span> are required.
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
      <footer className="bg-brand border-t-4 border-gold mt-auto">
        <div className="max-w-[1100px] mx-auto px-6 py-5 text-center">
          <p className="text-[#ccc] text-[13px] my-1">
            Oyo State Security Network Agency and Amotekun Corps
          </p>
          <p className="text-[#ccc] text-[13px] my-1">
            © {new Date().getFullYear()} Government of Oyo State. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}

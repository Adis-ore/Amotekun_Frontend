import { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'
import { LuCamera, LuUser, LuCircleX, LuCircleCheck } from 'react-icons/lu'

/* ─── Constants ─── */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const OYO_LGAS = [
  'Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda',
  'Ibadan North', 'Ibadan North-East', 'Ibadan North-West',
  'Ibadan South-East', 'Ibadan South-West', 'Ibarapa Central',
  'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 'Iseyin',
  'Itesiwaju', 'Iwajowa', 'Kajola', 'Lagelu', 'Ogbomosho North',
  'Ogbomosho South', 'Ogo Oluwa', 'Olorunsogo', 'Oluyole', 'Ona Ara',
  'Orelope', 'Ori Ire', 'Oyo East', 'Oyo West', 'Saki East',
  'Saki West', 'Surulere',
]

/* Age: 18 – 50 years, computed dynamically */
function getDateLimits() {
  const today = new Date()
  const max = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  const min = new Date(today.getFullYear() - 50, today.getMonth(), today.getDate())
  return {
    max: max.toISOString().split('T')[0],
    min: min.toISOString().split('T')[0],
  }
}
const DATE_LIMITS = getDateLimits()

/* Shared input class — changes border/bg on error */
function inputCls(error) {
  return `w-full px-3 py-2.5 border-[1.5px] rounded text-[14.5px] text-gray-900 outline-none transition-colors duration-150 ${
    error ? 'border-danger bg-red-50' : 'border-gray-300 bg-white'
  }`
}

/* ─── Component ─── */
export default function RegistrationForm({ onSuccess, isPortalClosed, submitted }) {
  const [formData, setFormData] = useState({
    fullName: '', phoneNumber: '', dateOfBirth: '', gender: '',
    lga: '', homeAddress: '', qualification: '', hasSecurityExp: '',
    organizationName: '', membershipDuration: '', specialSkill: '',
    otherInfo: '', passportPhoto: '', declaration: false,
  })
  const [errors, setErrors]             = useState({})
  const [photoPreview, setPhotoPreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError]   = useState('')
  const [showConfirm, setShowConfirm]   = useState(false)
  const [pdfBlobUrl, setPdfBlobUrl]     = useState(null)
  const [showErrBanner, setShowErrBanner] = useState(false)
  const errBannerRef = useRef(null)

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked
      : name === 'fullName' ? value.toUpperCase()
      : value
    setFormData(prev => ({ ...prev, [name]: val }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handlePhoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true,
      })
      const reader = new FileReader()
      reader.onload = () => {
        setFormData(prev => ({ ...prev, passportPhoto: reader.result }))
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(compressed)
    } catch {
      alert('Failed to process photo. Please try a different image.')
    }
  }

  const validate = () => {
    const e = {}
    if (!formData.fullName.trim())       e.fullName       = 'Full Name is required'
    if (!formData.phoneNumber.trim())    e.phoneNumber    = 'Phone Number is required'
    else if (!/^(\+234|0)[0-9]{10}$/.test(formData.phoneNumber))
                                         e.phoneNumber    = 'Enter a valid Nigerian phone number (e.g. 08012345678)'
    if (!formData.dateOfBirth)           e.dateOfBirth    = 'Date of Birth is required'
    if (!formData.gender)                e.gender         = 'Gender is required'
    if (!formData.lga)                   e.lga            = 'Local Government Area (LGA) is required'
    if (!formData.homeAddress.trim())    e.homeAddress    = 'Permanent Home Address is required'
    if (!formData.hasSecurityExp)        e.hasSecurityExp = 'Security experience question must be answered'
    if (!formData.declaration)           e.declaration    = 'You must accept the declaration to proceed'
    setErrors(e)
    const hasErrors = Object.keys(e).length > 0
    setShowErrBanner(hasErrors)
    return !hasErrors
  }

  /* COMPLETE APPLICATION → validate → open review modal */
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) {
      setTimeout(() => {
        errBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 30)
      return
    }
    setShowErrBanner(false)
    setShowConfirm(true)
  }

  /* SUBMIT & GENERATE FORM → close modal → loading overlay → API → download */
  const handleConfirmedSubmit = async () => {
    setShowConfirm(false)
    setIsSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Registration failed. Please try again.')
      }

      const pdfBlob = await res.blob()
      const disposition = res.headers.get('Content-Disposition') || ''
      const match = disposition.match(/filename="Amotekun-(AMO-\d+)\.pdf"/)
      const formNo = match ? match[1] : 'AMO-XXXX'

      const blobUrl = URL.createObjectURL(pdfBlob)
      const safeName = formData.fullName.trim().replace(/\s+/g, '_')
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${formNo}_${safeName}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      setPdfBlobUrl(blobUrl)
      onSuccess(formNo)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── Portal closed ── */
  if (isPortalClosed) {
    return (
      <div className="text-center py-16 px-10 flex flex-col items-center gap-3.5">
        <LuCircleX size={48} color="#c0392b" />
        <h3 className="font-display text-[22px] text-[#7f1d1d] m-0">Registration Portal Closed</h3>
        <p className="text-[15px] text-gray-500 max-w-[420px] m-0">
          The registration period has ended. No new applications are being accepted.
        </p>
      </div>
    )
  }

  /* ── Submitted state ── */
  if (submitted) {
    return (
      <div className="px-8 py-10 text-center">
        <p className="text-[15px] text-gray-700">
          Your Registration Form has been downloaded. Print it and bring it to the screening exercise.
        </p>
        {pdfBlobUrl && (
          <button
            type="button"
            className="mt-5 px-8 py-3 bg-brand text-white border-none rounded text-sm font-bold cursor-pointer tracking-[0.04em] uppercase hover:bg-brand-dark transition-colors duration-200 shadow-[0_3px_10px_rgba(15,76,15,0.3)]"
            onClick={() => {
              const win = window.open(pdfBlobUrl, '_blank')
              if (win) win.addEventListener('load', () => win.print())
            }}
          >
            Print Registration Form
          </button>
        )}
      </div>
    )
  }

  /* ── Main form ── */
  return (
    <>
      <form onSubmit={handleSubmit} noValidate>

        {/* ── VALIDATION ERROR BANNER ── */}
        {showErrBanner && Object.keys(errors).length > 0 && (
          <div
            ref={errBannerRef}
            className="mx-6 md:mx-8 mt-6 mb-2 rounded-lg border-[1.5px] border-danger bg-red-50 px-5 py-4"
          >
            <p className="text-danger font-bold text-[13.5px] mb-2.5 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-danger text-white text-[11px] font-extrabold shrink-0">
                {Object.keys(errors).length}
              </span>
              Please fill in the following required {Object.keys(errors).length === 1 ? 'field' : 'fields'} before proceeding:
            </p>
            <ul className="flex flex-col gap-1.5 pl-1">
              {Object.values(errors).map((msg, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-danger">
                  <span className="mt-[3px] shrink-0">•</span>
                  <span>{msg}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 1. PERSONAL INFORMATION */}
        <FormSection title="1. Personal Information">

          <Field label="Full Name" required error={errors.fullName}>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={inputCls(errors.fullName)}
              placeholder="e.g. ADEBAYO JOHN OLUWASEUN"
              disabled={isSubmitting}
              autoCapitalize="characters"
            />
            <small className="block text-[12px] text-gray-500 mt-1">
              Name will appear in UPPERCASE on your Registration Form.
            </small>
          </Field>

          <Field label="Phone Number" required error={errors.phoneNumber}>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={inputCls(errors.phoneNumber)}
              placeholder="e.g. 08012345678 or +2348012345678"
              disabled={isSubmitting}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Date of Birth" required error={errors.dateOfBirth}>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={inputCls(errors.dateOfBirth)}
                min={DATE_LIMITS.min}
                max={DATE_LIMITS.max}
                disabled={isSubmitting}
              />
              <small className="block text-[12px] text-gray-500 mt-1">
                Applicant must be between 18 and 50 years old.
              </small>
            </Field>

            <Field label="Gender" required error={errors.gender}>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputCls(errors.gender)}
                disabled={isSubmitting}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </Field>
          </div>

          <Field label="Local Government Area (LGA)" required error={errors.lga}>
            <select
              name="lga"
              value={formData.lga}
              onChange={handleChange}
              className={inputCls(errors.lga)}
              disabled={isSubmitting}
            >
              <option value="">Select your LGA</option>
              {OYO_LGAS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>

          <Field label="Permanent Home Address" required error={errors.homeAddress}>
            <textarea
              name="homeAddress"
              value={formData.homeAddress}
              onChange={handleChange}
              className={`${inputCls(errors.homeAddress)} resize-y min-h-[90px]`}
              placeholder="Enter your full permanent home address including town/city"
              disabled={isSubmitting}
              rows={3}
            />
          </Field>

          <Field label="Academic Qualification (optional)">
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className={inputCls()}
              placeholder="Enter your qualification (optional)"
              disabled={isSubmitting}
            />
            <small className="block text-[12px] text-gray-500 mt-1">
              Optional. If left blank, NIL will appear on your Registration Form.
            </small>
          </Field>

        </FormSection>

        {/* 2. SECURITY BACKGROUND */}
        <FormSection title="2. Security Background">

          <Field label="Do you have security-related work experience?" required error={errors.hasSecurityExp}>
            <div className="flex gap-6 mt-2 flex-wrap">
              {['Yes', 'No'].map(opt => (
                <label key={opt} className="flex items-center gap-2.5 cursor-pointer text-[15px] font-medium text-gray-800 select-none">
                  <input
                    type="radio"
                    name="hasSecurityExp"
                    value={opt}
                    checked={formData.hasSecurityExp === opt}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-[18px] h-[18px] accent-brand-mid cursor-pointer"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </Field>

          {formData.hasSecurityExp === 'Yes' && (
            <div className="bg-[#f5faf5] border border-[#c3dfc3] rounded-md px-5 py-5 mt-1 flex flex-col gap-4">
              <Field label="Name of Organisation / Security Agency">
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className={inputCls()}
                  placeholder="e.g. Nigeria Police Force, Civil Defence"
                  disabled={isSubmitting}
                />
              </Field>
              <Field label="Duration of Service / Membership">
                <input
                  type="text"
                  name="membershipDuration"
                  value={formData.membershipDuration}
                  onChange={handleChange}
                  className={inputCls()}
                  placeholder="e.g. 3 years 2 months"
                  disabled={isSubmitting}
                />
              </Field>
            </div>
          )}

        </FormSection>

        {/* 3. ADDITIONAL INFORMATION */}
        <FormSection title="3. Additional Information">

          <Field label="Special Skills or Trade">
            <textarea
              name="specialSkill"
              value={formData.specialSkill}
              onChange={handleChange}
              className={`${inputCls()} resize-y min-h-[80px]`}
              placeholder="e.g. First Aid, Driving, Marksmanship, Carpentry"
              disabled={isSubmitting}
              rows={3}
            />
            <small className="block text-[12px] text-gray-500 mt-1">Optional. If left blank, NIL will appear on your Registration Form.</small>
          </Field>

          <Field label="Other Relevant Information">
            <textarea
              name="otherInfo"
              value={formData.otherInfo}
              onChange={handleChange}
              className={`${inputCls()} resize-y min-h-[80px]`}
              placeholder="Any other information relevant to your application"
              disabled={isSubmitting}
              rows={3}
            />
            <small className="block text-[12px] text-gray-500 mt-1">Optional. If left blank, NIL will appear on your Registration Form.</small>
          </Field>

        </FormSection>

        {/* 4. PASSPORT PHOTOGRAPH */}
        <FormSection title="4. Passport Photograph">
          <div className="flex gap-6 items-start flex-wrap">
            <div className="flex-1 min-w-[220px]">
              <label
                className="inline-block px-5 py-2.5 bg-brand-mid text-white rounded cursor-pointer text-sm font-semibold tracking-[0.03em] mb-2.5 hover:bg-brand transition-colors duration-200"
                htmlFor="passportPhotoInput"
              >
                <LuCamera size={15} className="inline align-middle mr-1.5" />
                {photoPreview ? 'Change Photo' : 'Upload Passport Photo'}
              </label>
              <input
                id="passportPhotoInput"
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                disabled={isSubmitting}
                className="hidden"
              />
              <p className="text-[12px] text-gray-500">
                Accepted: JPG, PNG &nbsp;|&nbsp; Max size: 200KB (auto-compressed)<br />
                Recommended: clear, recent passport-style photo on white background.
              </p>
            </div>
            <div className="shrink-0">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Passport preview"
                  className="w-[120px] h-[150px] object-cover border-2 border-gray-300 rounded"
                />
              ) : (
                <div className="w-[120px] h-[150px] border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center bg-gray-50">
                  <LuUser size={32} color="#bbb" />
                  <span className="text-[12px] text-gray-400 mt-1.5">4 x 4 Photo</span>
                </div>
              )}
            </div>
          </div>
        </FormSection>

        {/* 5. DECLARATION */}
        <FormSection title="5. Declaration">
          <label
            className={`flex gap-3.5 items-start cursor-pointer p-4 bg-[#f9faf9] border rounded-lg transition-colors ${
              errors.declaration ? 'border-danger' : 'border-[#d6e8d6]'
            }`}
            data-error={!!errors.declaration}
          >
            <input
              type="checkbox"
              name="declaration"
              checked={formData.declaration}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-5 h-5 shrink-0 mt-0.5 accent-brand-mid cursor-pointer"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              I solemnly declare that all information provided in this form is true, complete, and accurate
              to the best of my knowledge. I understand that any false declaration will lead to immediate
              disqualification and may result in prosecution under applicable laws.
            </span>
          </label>
          {errors.declaration && (
            <p className="text-danger text-[12.5px] mt-1.5" data-error="true">{errors.declaration}</p>
          )}
        </FormSection>

        {/* Submission error */}
        {submitError && (
          <div className="mx-6 md:mx-8 mb-6 px-4 py-3.5 bg-red-50 border-[1.5px] border-danger rounded text-danger text-sm">
            <strong>Submission Error:</strong> {submitError}
          </div>
        )}

        {/* ── COMPLETE APPLICATION BUTTON ── */}
        <div className="px-6 md:px-8 py-8 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-brand text-white border-none rounded text-[15px] font-bold cursor-pointer tracking-[0.05em] uppercase transition-all duration-200 hover:bg-brand-dark hover:-translate-y-0.5 shadow-[0_3px_12px_rgba(15,76,15,0.3)] hover:shadow-[0_6px_20px_rgba(15,76,15,0.4)] active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            COMPLETE APPLICATION
          </button>
          <p className="text-[12.5px] text-gray-500 text-center mt-3">
            Click to review your details before your Registration Form is generated and downloaded.
          </p>
        </div>

        {/* ── REVIEW MODAL ── */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-[1000] p-4 md:p-5">
            <div className="bg-white rounded-xl px-6 md:px-8 py-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)]">

              {/* Green checkmark */}
              <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-5">
                <LuCircleCheck size={36} color="#fff" />
              </div>

              <h3 className="font-display text-xl font-bold text-brand text-center mb-2">
                Review Your Application
              </h3>
              <p className="text-[13.5px] text-gray-500 text-center mb-5">
                Please review all your details carefully before submitting.
              </p>

              {/* Two-column review grid */}
              <div className="flex flex-col border border-[#e0e8e0] rounded-lg overflow-hidden mb-5">
                <ReviewRow label="Full Name"           value={formData.fullName} />
                <ReviewRow label="Phone Number"        value={formData.phoneNumber} />
                <ReviewRow label="Date of Birth"       value={formData.dateOfBirth} />
                <ReviewRow label="Gender"              value={formData.gender} />
                <ReviewRow label="LGA"                 value={formData.lga} />
                <ReviewRow label="Home Address"        value={formData.homeAddress} />
                <ReviewRow label="Qualification"       value={formData.qualification || 'NIL'} />
                <ReviewRow label="Security Experience" value={formData.hasSecurityExp} />
                {formData.hasSecurityExp === 'Yes' && formData.organizationName && (
                  <ReviewRow label="Organisation" value={formData.organizationName} />
                )}
                {formData.hasSecurityExp === 'Yes' && formData.membershipDuration && (
                  <ReviewRow label="Duration" value={formData.membershipDuration} />
                )}
                {formData.specialSkill && (
                  <ReviewRow label="Special Skills" value={formData.specialSkill} />
                )}
              </div>

              <p className="text-[12.5px] text-[#7a5000] bg-[#fffbeb] border border-[#f0d080] rounded px-3.5 py-2.5 mb-6">
                By confirming, you declare that all information provided is true and accurate.
              </p>

              <div className="flex gap-3 justify-end flex-wrap">
                <button
                  type="button"
                  className="px-5 py-2.5 bg-white text-gray-600 border-[1.5px] border-gray-300 rounded text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors min-h-[44px]"
                  onClick={() => setShowConfirm(false)}
                >
                  GO BACK &amp; EDIT
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 bg-brand text-white border-none rounded text-sm font-bold cursor-pointer tracking-[0.03em] hover:bg-brand-dark transition-colors shadow-[0_3px_10px_rgba(15,76,15,0.3)] min-h-[44px]"
                  onClick={handleConfirmedSubmit}
                >
                  SUBMIT &amp; GENERATE FORM
                </button>
              </div>

            </div>
          </div>
        )}

      </form>

      {/* ── FULL-SCREEN LOADING OVERLAY ── */}
      {isSubmitting && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center z-[2000]"
          style={{ backgroundColor: 'rgba(13,43,13,0.93)' }}
        >
          <div className="bg-white rounded-2xl px-10 py-10 flex flex-col items-center gap-5 shadow-2xl max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin" />
            <p className="font-display text-xl font-bold text-brand">Please wait...</p>
            <p className="text-gray-600 leading-relaxed text-sm">Generating your Registration Form</p>
          </div>
        </div>
      )}
    </>
  )
}

/* ─── Sub-components ─── */

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-3 px-3.5 py-2.5 bg-white border-b border-[#e8f0e8] last:border-b-0">
      <span className="text-[12.5px] font-semibold text-gray-500 shrink-0 min-w-[130px]">{label}</span>
      <span className="text-[13px] text-gray-900 text-right break-words font-medium">{value || '—'}</span>
    </div>
  )
}

function FormSection({ title, children }) {
  return (
    <div className="border-b border-gray-200">
      <div className="bg-[#f3f7f3] border-b border-[#e0e8e0] px-6 md:px-8 py-3.5">
        <h3 className="font-display text-[13px] font-bold text-brand uppercase tracking-[0.04em] m-0">
          {title}
        </h3>
      </div>
      <div className="px-6 md:px-8 py-6 flex flex-col gap-5">
        {children}
      </div>
    </div>
  )
}

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5" data-error={!!error}>
      <label className="text-[13.5px] font-semibold text-gray-700 tracking-[0.01em]">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {error && <p className="text-danger text-[12.5px] m-0" data-error="true">{error}</p>}
    </div>
  )
}

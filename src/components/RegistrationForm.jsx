import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import { LuCamera, LuUser, LuCircleX } from 'react-icons/lu'

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

// Age boundaries: must be 18–45 as of today
function getDateLimits() {
  const today = new Date()
  const maxDob = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  const minDob = new Date(today.getFullYear() - 45, today.getMonth(), today.getDate())
  return {
    max: maxDob.toISOString().split('T')[0],
    min: minDob.toISOString().split('T')[0],
  }
}

const DATE_LIMITS = getDateLimits()

/* ─── Component ─── */
export default function RegistrationForm({ onSuccess, isPortalClosed, submitted }) {
  const [formData, setFormData] = useState({
    fullName: '', phoneNumber: '', dateOfBirth: '', gender: '',
    lga: '', homeAddress: '', qualification: '', hasSecurityExp: '',
    organizationName: '', membershipDuration: '', specialSkill: '',
    otherInfo: '', passportPhoto: '', declaration: false,
  })
  const [errors, setErrors] = useState({})
  const [photoPreview, setPhotoPreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)

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
    if (!formData.fullName.trim())        e.fullName        = 'Full name is required'
    if (!formData.phoneNumber.trim())     e.phoneNumber     = 'Phone number is required'
    else if (!/^(\+234|0)[0-9]{10}$/.test(formData.phoneNumber))
                                          e.phoneNumber     = 'Enter a valid Nigerian phone number (e.g. 08012345678)'
    if (!formData.dateOfBirth)            e.dateOfBirth     = 'Date of birth is required'
    if (!formData.gender)                 e.gender          = 'Gender is required'
    if (!formData.lga)                    e.lga             = 'LGA is required'
    if (!formData.homeAddress.trim())     e.homeAddress     = 'Home address is required'
    if (!formData.hasSecurityExp)         e.hasSecurityExp  = 'Please answer this question'
    if (!formData.declaration)            e.declaration     = 'You must accept the declaration to proceed'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* Show confirm dialog when form is valid — actual submit happens on confirm */
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) {
      const firstErr = document.querySelector('[data-error="true"]')
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setShowConfirm(true)
  }

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

      // Extract form number from Content-Disposition header
      const disposition = res.headers.get('Content-Disposition') || ''
      const match = disposition.match(/filename="Amotekun-(AMO-\d+)\.pdf"/)
      const formNo = match ? match[1] : 'AMO-XXXX'

      // Trigger automatic PDF download and keep blob URL for print button
      const blobUrl = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `Amotekun-Registration-${formNo}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Keep blob URL alive so the Print button can use it
      setPdfBlobUrl(blobUrl)
      onSuccess(formNo)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── Closed state ── */
  if (isPortalClosed) {
    return (
      <div style={s.closedBox}>
        <LuCircleX size={48} color="#c0392b" />
        <h3 style={s.closedTitle}>Registration Portal Closed</h3>
        <p style={s.closedText}>The registration period has ended. No new applications are being accepted.</p>
      </div>
    )
  }

  /* ── Submitted state ── */
  if (submitted) {
    return (
      <div style={s.submittedBox}>
        <p style={s.submittedText}>
          Your registration slip has been downloaded. Print it and bring it to the screening venue.
        </p>
        {pdfBlobUrl && (
          <button
            type="button"
            style={s.printBtn}
            onClick={() => {
              const win = window.open(pdfBlobUrl, '_blank')
              if (win) win.addEventListener('load', () => win.print())
            }}
          >
            Print Registration Slip
          </button>
        )}
      </div>
    )
  }

  /* ── Form ── */
  return (
    <form onSubmit={handleSubmit} style={s.form} noValidate>

      {/* ── PERSONAL INFORMATION ── */}
      <FormSection title="1. Personal Information">

        <Field label="Full Name" required error={errors.fullName}>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={inputStyle(errors.fullName)}
            placeholder="e.g. ADEBAYO JOHN OLUWASEUN"
            disabled={isSubmitting}
            autoCapitalize="characters"
          />
          <small style={s.hint}>Name will appear in UPPERCASE on your registration slip.</small>
        </Field>

        <Field label="Phone Number" required error={errors.phoneNumber}>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            style={inputStyle(errors.phoneNumber)}
            placeholder="e.g. 08012345678 or +2348012345678"
            disabled={isSubmitting}
          />
        </Field>

        <div style={s.grid2}>
          <Field label="Date of Birth" required error={errors.dateOfBirth}>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              style={inputStyle(errors.dateOfBirth)}
              min={DATE_LIMITS.min}
              max={DATE_LIMITS.max}
              disabled={isSubmitting}
            />
            <small style={s.hint}>Must be 18–45 years old.</small>
          </Field>

          <Field label="Gender" required error={errors.gender}>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={inputStyle(errors.gender)}
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
            style={inputStyle(errors.lga)}
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
            style={{ ...inputStyle(errors.homeAddress), resize: 'vertical', minHeight: '90px' }}
            placeholder="Enter your full permanent home address including town/city"
            disabled={isSubmitting}
            rows={3}
          />
        </Field>

        <Field label="Highest Academic Qualification" error={errors.qualification}>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            style={inputStyle(errors.qualification)}
            placeholder="e.g. SSCE, OND, B.Sc — leave blank if none"
            disabled={isSubmitting}
          />
          <small style={s.hint}>Optional. If left blank, NIL will appear on your slip.</small>
        </Field>

      </FormSection>

      {/* ── SECURITY BACKGROUND ── */}
      <FormSection title="2. Security Background">

        <Field label="Do you have security-related work experience?" required error={errors.hasSecurityExp}>
          <div style={s.radioRow}>
            {['Yes', 'No'].map(opt => (
              <label key={opt} style={s.radioLabel}>
                <input
                  type="radio"
                  name="hasSecurityExp"
                  value={opt}
                  checked={formData.hasSecurityExp === opt}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={s.radioInput}
                />
                <span style={s.radioMark} />
                {opt}
              </label>
            ))}
          </div>
        </Field>

        {formData.hasSecurityExp === 'Yes' && (
          <div style={s.conditionalBlock}>
            <Field label="Name of Organisation / Security Agency">
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                style={inputStyle()}
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
                style={inputStyle()}
                placeholder="e.g. 3 years 2 months"
                disabled={isSubmitting}
              />
            </Field>
          </div>
        )}

      </FormSection>

      {/* ── ADDITIONAL INFORMATION ── */}
      <FormSection title="3. Additional Information">

        <Field label="Special Skills or Trade">
          <textarea
            name="specialSkill"
            value={formData.specialSkill}
            onChange={handleChange}
            style={{ ...inputStyle(), resize: 'vertical', minHeight: '80px' }}
            placeholder="e.g. First Aid, Driving, Marksmanship, Carpentry"
            disabled={isSubmitting}
            rows={3}
          />
          <small style={s.hint}>Optional. List any relevant skills.</small>
        </Field>

        <Field label="Other Relevant Information">
          <textarea
            name="otherInfo"
            value={formData.otherInfo}
            onChange={handleChange}
            style={{ ...inputStyle(), resize: 'vertical', minHeight: '80px' }}
            placeholder="Any other information relevant to your application"
            disabled={isSubmitting}
            rows={3}
          />
        </Field>

      </FormSection>

      {/* ── PASSPORT PHOTO ── */}
      <FormSection title="4. Passport Photograph">

        <div style={s.photoSection}>
          <div style={s.photoLeft}>
            <label style={s.fileLabel} htmlFor="passportPhotoInput">
              <LuCamera size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              {photoPreview ? 'Change Photo' : 'Upload Passport Photo'}
            </label>
            <input
              id="passportPhotoInput"
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              disabled={isSubmitting}
              style={{ display: 'none' }}
            />
            <p style={s.hint}>
              Accepted: JPG, PNG &nbsp;|&nbsp; Max size: 200KB (auto-compressed)<br />
              Recommended: clear, recent passport-style photo on white background.
            </p>
          </div>
          <div style={s.photoRight}>
            {photoPreview ? (
              <img src={photoPreview} alt="Passport preview" style={s.photoPreview} />
            ) : (
              <div style={s.photoPlaceholder}>
                <LuUser size={32} color="#bbb" />
                <span style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>4 x 4 Photo</span>
              </div>
            )}
          </div>
        </div>

      </FormSection>

      {/* ── DECLARATION ── */}
      <FormSection title="5. Declaration">

        <label style={s.checkboxLabel} data-error={!!errors.declaration}>
          <input
            type="checkbox"
            name="declaration"
            checked={formData.declaration}
            onChange={handleChange}
            disabled={isSubmitting}
            style={s.checkboxInput}
          />
          <span style={s.checkboxText}>
            I solemnly declare that all information provided in this form is true, complete, and accurate
            to the best of my knowledge. I understand that any false declaration will lead to immediate
            disqualification and may result in prosecution under applicable laws.
          </span>
        </label>
        {errors.declaration && (
          <p style={s.errorText} data-error="true">{errors.declaration}</p>
        )}

      </FormSection>

      {/* ── SUBMIT ERROR ── */}
      {submitError && (
        <div style={s.submitError}>
          <strong>Submission Error:</strong> {submitError}
        </div>
      )}

      {/* ── SUBMIT BUTTON ── */}
      <div style={s.submitWrap}>
        <button
          type="submit"
          style={{ ...s.submitBtn, opacity: isSubmitting ? 0.75 : 1 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span style={s.spinnerRow}>
              <span style={s.spinner} />
              Generating Registration Slip…
            </span>
          ) : (
            'SUBMIT & GENERATE REGISTRATION SLIP'
          )}
        </button>
        {!isSubmitting && (
          <p style={s.submitNote}>
            After submission your registration slip (PDF) will download automatically.
            Print it and bring it to the screening venue.
          </p>
        )}
      </div>

      {/* ── CONFIRM MODAL ── */}
      {showConfirm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3 style={s.modalTitle}>Confirm Your Submission</h3>
            <p style={s.modalSubtitle}>
              Please review your details before submitting. You cannot edit after submission.
            </p>

            <div style={s.reviewGrid}>
              <ReviewRow label="Full Name" value={formData.fullName} />
              <ReviewRow label="Phone Number" value={formData.phoneNumber} />
              <ReviewRow label="Date of Birth" value={formData.dateOfBirth} />
              <ReviewRow label="Gender" value={formData.gender} />
              <ReviewRow label="LGA" value={formData.lga} />
              <ReviewRow label="Qualification" value={formData.qualification} />
              <ReviewRow label="Security Experience" value={formData.hasSecurityExp} />
              {formData.hasSecurityExp === 'Yes' && formData.organizationName && (
                <ReviewRow label="Organisation" value={formData.organizationName} />
              )}
            </div>

            <p style={s.modalWarning}>
              By confirming, you declare that all information provided is true and accurate.
            </p>

            <div style={s.modalActions}>
              <button
                type="button"
                style={s.cancelBtn}
                onClick={() => setShowConfirm(false)}
              >
                Go Back &amp; Edit
              </button>
              <button
                type="button"
                style={s.confirmBtn}
                onClick={handleConfirmedSubmit}
              >
                Confirm &amp; Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </form>
  )
}

/* ─── Sub-components ─── */
function ReviewRow({ label, value }) {
  return (
    <div style={sr.row}>
      <span style={sr.rlabel}>{label}</span>
      <span style={sr.rvalue}>{value || '—'}</span>
    </div>
  )
}

function FormSection({ title, children }) {
  return (
    <div style={ss.section}>
      <div style={ss.sectionHeader}>
        <h3 style={ss.sectionTitle}>{title}</h3>
      </div>
      <div style={ss.sectionBody}>{children}</div>
    </div>
  )
}

function Field({ label, required, error, children }) {
  return (
    <div style={ss.field} data-error={!!error}>
      <label style={ss.label}>
        {label}
        {required && <span style={ss.required}> *</span>}
      </label>
      {children}
      {error && <p style={ss.error} data-error="true">{error}</p>}
    </div>
  )
}

/* ─── Style helpers ─── */
function inputStyle(error) {
  return {
    width: '100%',
    padding: '10px 13px',
    border: `1.5px solid ${error ? '#c0392b' : '#ccc'}`,
    borderRadius: '5px',
    fontSize: '14.5px',
    fontFamily: 'var(--font-body, Inter, sans-serif)',
    backgroundColor: error ? '#fff8f8' : '#fff',
    color: '#1a1a1a',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }
}

/* ─── Styles ─── */
const s = {
  form: {
    padding: '0',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  hint: {
    display: 'block',
    fontSize: '12px',
    color: '#777',
    marginTop: '5px',
  },
  radioRow: {
    display: 'flex',
    gap: '24px',
    marginTop: '8px',
    flexWrap: 'wrap',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#222',
    userSelect: 'none',
  },
  radioInput: {
    width: '18px',
    height: '18px',
    accentColor: '#1a6b1a',
    cursor: 'pointer',
  },
  radioMark: {},
  conditionalBlock: {
    backgroundColor: '#f5faf5',
    border: '1px solid #c3dfc3',
    borderRadius: '6px',
    padding: '20px',
    marginTop: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  photoSection: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  photoLeft: { flex: 1, minWidth: '220px' },
  photoRight: { flexShrink: 0 },
  fileLabel: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#1a6b1a',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.03em',
    marginBottom: '10px',
  },
  photoPreview: {
    width: '120px',
    height: '150px',
    objectFit: 'cover',
    border: '2px solid #ccc',
    borderRadius: '4px',
  },
  photoPlaceholder: {
    width: '120px',
    height: '150px',
    border: '2px dashed #bbb',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  checkboxLabel: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    cursor: 'pointer',
    padding: '16px',
    backgroundColor: '#f9faf9',
    border: '1px solid #d6e8d6',
    borderRadius: '6px',
  },
  checkboxInput: {
    width: '20px',
    height: '20px',
    flexShrink: 0,
    marginTop: '2px',
    accentColor: '#1a6b1a',
    cursor: 'pointer',
  },
  checkboxText: {
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.6',
  },
  errorText: {
    color: '#c0392b',
    fontSize: '12.5px',
    margin: '6px 0 0 0',
  },
  submitError: {
    margin: '0 32px 24px',
    padding: '14px 18px',
    backgroundColor: '#fff0f0',
    border: '1.5px solid #c0392b',
    borderRadius: '6px',
    color: '#c0392b',
    fontSize: '14px',
  },
  submitWrap: {
    padding: '24px 32px 32px',
    borderTop: '1px solid #eee',
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#0f4c0f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body, Inter, sans-serif)',
    transition: 'background-color 0.2s',
    boxShadow: '0 3px 12px rgba(15,76,15,0.3)',
  },
  spinnerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  spinner: {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  submitNote: {
    fontSize: '12.5px',
    color: '#666',
    textAlign: 'center',
    marginTop: '12px',
  },
  closedBox: {
    textAlign: 'center',
    padding: '60px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
  },
  closedTitle: {
    fontFamily: 'var(--font-heading, Merriweather, Georgia, serif)',
    fontSize: '22px',
    color: '#7f1d1d',
    margin: 0,
  },
  closedText: {
    fontSize: '15px',
    color: '#555',
    maxWidth: '420px',
    margin: 0,
  },
  submittedBox: {
    padding: '40px 32px',
    textAlign: 'center',
  },
  submittedText: {
    fontSize: '15px',
    color: '#333',
  },
  printBtn: {
    marginTop: '20px',
    padding: '12px 32px',
    backgroundColor: '#0f4c0f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body, Inter, sans-serif)',
    boxShadow: '0 3px 10px rgba(15,76,15,0.3)',
  },
  /* ── Modal overlay ── */
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '32px',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  modalTitle: {
    fontFamily: 'var(--font-heading, Merriweather, Georgia, serif)',
    fontSize: '20px',
    color: '#0f4c0f',
    margin: '0 0 8px 0',
  },
  modalSubtitle: {
    fontSize: '13.5px',
    color: '#555',
    margin: '0 0 20px 0',
  },
  reviewGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    marginBottom: '20px',
    border: '1px solid #e0e8e0',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  modalWarning: {
    fontSize: '12.5px',
    color: '#7a5000',
    backgroundColor: '#fffbeb',
    border: '1px solid #f0d080',
    borderRadius: '5px',
    padding: '10px 14px',
    margin: '0 0 24px 0',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '11px 22px',
    backgroundColor: '#fff',
    color: '#444',
    border: '1.5px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'var(--font-body, Inter, sans-serif)',
  },
  confirmBtn: {
    padding: '11px 22px',
    backgroundColor: '#0f4c0f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'var(--font-body, Inter, sans-serif)',
    letterSpacing: '0.03em',
    boxShadow: '0 3px 10px rgba(15,76,15,0.3)',
  },
}

const ss = {
  section: {
    borderBottom: '1px solid #eee',
  },
  sectionHeader: {
    backgroundColor: '#f3f7f3',
    borderBottom: '1px solid #e0e8e0',
    padding: '14px 32px',
  },
  sectionTitle: {
    fontFamily: 'var(--font-heading, Merriweather, Georgia, serif)',
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f4c0f',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  sectionBody: {
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13.5px',
    fontWeight: '600',
    color: '#333',
    letterSpacing: '0.01em',
  },
  required: {
    color: '#c0392b',
  },
  error: {
    color: '#c0392b',
    fontSize: '12.5px',
    margin: 0,
  },
}

/* ─── Review row styles ─── */
const sr = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '9px 14px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e8f0e8',
  },
  rlabel: {
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#555',
    flexShrink: 0,
    minWidth: '140px',
  },
  rvalue: {
    fontSize: '13px',
    color: '#111',
    textAlign: 'right',
    wordBreak: 'break-word',
  },
}

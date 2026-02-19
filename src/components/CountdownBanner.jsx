import { useState, useEffect } from 'react'
import { LuBan } from 'react-icons/lu'

const PORTAL_LAUNCH_DATE = new Date('2026-02-19')
const DEADLINE = new Date(PORTAL_LAUNCH_DATE)
DEADLINE.setDate(DEADLINE.getDate() + 21)

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState(null)
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    const update = () => {
      const diff = DEADLINE - Date.now()
      if (diff <= 0) {
        setIsClosed(true)
        setTimeLeft(null)
      } else {
        setIsClosed(false)
        setTimeLeft({
          days:    Math.floor(diff / 86400000),
          hours:   String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
          minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
          seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
        })
      }
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  if (!timeLeft && !isClosed) return null

  if (isClosed) {
    return (
      <div style={styles.closed}>
        <LuBan size={18} style={{ flexShrink: 0 }} />
        <span style={styles.closedText}>REGISTRATION IS NOW CLOSED</span>
      </div>
    )
  }

  return (
    <div style={styles.banner}>
      <span style={styles.bannerLabel}>Registration closes in:</span>
      <div style={styles.units}>
        <Unit value={timeLeft.days}    label="DAYS" />
        <Separator />
        <Unit value={timeLeft.hours}   label="HRS" />
        <Separator />
        <Unit value={timeLeft.minutes} label="MIN" />
        <Separator />
        <Unit value={timeLeft.seconds} label="SEC" />
      </div>
    </div>
  )
}

function Unit({ value, label }) {
  return (
    <div style={styles.unit}>
      <span style={styles.unitValue}>{value}</span>
      <span style={styles.unitLabel}>{label}</span>
    </div>
  )
}

function Separator() {
  return <span style={styles.separator}>:</span>
}

const styles = {
  banner: {
    backgroundColor: '#1a1a1a',
    color: '#ffc107',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    borderBottom: '2px solid #ffc107',
  },
  bannerLabel: {
    fontFamily: 'var(--font-body, Inter, sans-serif)',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.05em',
    color: '#fff',
    textTransform: 'uppercase',
  },
  units: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  unit: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    border: '1px solid #ffc107',
    borderRadius: '4px',
    padding: '4px 10px',
    minWidth: '48px',
  },
  unitValue: {
    fontSize: '20px',
    fontWeight: '700',
    fontFamily: 'var(--font-body, Inter, sans-serif)',
    lineHeight: 1,
    color: '#ffc107',
  },
  unitLabel: {
    fontSize: '9px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: '#aaa',
    marginTop: '2px',
  },
  separator: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffc107',
    lineHeight: 1,
    paddingBottom: '12px',
  },
  closed: {
    backgroundColor: '#7f1d1d',
    color: '#fff',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    borderBottom: '2px solid #c0392b',
  },
  closedText: {
    fontFamily: 'var(--font-body, Inter, sans-serif)',
    fontSize: '15px',
    fontWeight: '700',
    letterSpacing: '0.06em',
  },
}

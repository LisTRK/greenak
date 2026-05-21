import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { INITIAL_ANSWERS, SURVEY_STEPS } from '../../survey/surveySteps.js'
import { submitSurvey } from '../../services/submitSurvey.js'
import './SurveyModal.css'

function normalizePhone(value) {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 ? digits : ''
}

function SurveyModal({ open, onClose }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const step = SURVEY_STEPS[stepIndex]
  const totalSteps = SURVEY_STEPS.length
  const isContact = step?.type === 'contact'
  const isDone = status === 'success'

  const reset = useCallback(() => {
    setStepIndex(0)
    setAnswers(INITIAL_ANSWERS)
    setStatus('idle')
    setError('')
  }, [])

  const handleClose = useCallback(() => {
    onClose()
    reset()
  }, [onClose, reset])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    } else {
      dialog.close()
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    setError('')
  }

  const canProceed = () => {
    if (!step) return false
    if (isContact) {
      return answers.name.trim().length >= 2 && normalizePhone(answers.phone).length >= 10
    }
    if (step.type === 'consumption' || step.type === 'location') {
      return true
    }
    return Boolean(answers[step.id])
  }

  const goNext = async () => {
    if (isContact) {
      setStatus('submitting')
      setError('')
      try {
        await submitSurvey({
          ...answers,
          phone: answers.phone.trim(),
          name: answers.name.trim(),
        })
        setStatus('success')
      } catch (err) {
        setStatus('idle')
        setError(err.message || 'Помилка відправки')
      }
      return
    }

    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1)
    }
  }

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1)
      setError('')
    }
  }

  const renderStepContent = () => {
    if (isDone) {
      return (
        <div className="survey-modal__success">
          <p>
            <strong>Дякуємо!</strong> Менеджер зателефонує на номер{' '}
            {answers.phone} і повідомить результат розрахунку.
          </p>
        </div>
      )
    }

    if (step.type === 'choice') {
      return (
        <fieldset className="survey-modal__options">
          <legend className="survey-modal__legend">{step.title}</legend>
          {step.options.map((opt) => (
            <label key={opt.value} className="survey-modal__option">
              <input
                type="radio"
                name={step.id}
                value={opt.value}
                checked={answers[step.id] === opt.label}
                onChange={() => {
                  setAnswer(step.id, opt.label)
                  if (stepIndex < totalSteps - 1) {
                    setTimeout(() => setStepIndex((i) => i + 1), 180)
                  }
                }}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </fieldset>
      )
    }

    if (step.type === 'consumption') {
      return (
        <>
          <div className="survey-modal__field">
            <label htmlFor="survey-consumption">{step.inputLabel}</label>
            <input
              id="survey-consumption"
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="Наприклад: 350"
              value={
                answers.consumption &&
                !['Важко відповісти', 'Пропущено'].includes(answers.consumption)
                  ? answers.consumption
                  : ''
              }
              onChange={(e) => setAnswer('consumption', e.target.value)}
            />
          </div>
          <div className="survey-modal__skip-row">
            <button
              type="button"
              className="survey-modal__skip"
              onClick={() => {
                setAnswer('consumption', step.skipHard.label)
                setStepIndex((i) => i + 1)
              }}
            >
              {step.skipHard.label}
            </button>
            <button
              type="button"
              className="survey-modal__skip"
              onClick={() => {
                setAnswer('consumption', 'Пропущено')
                setStepIndex((i) => i + 1)
              }}
            >
              {step.skip.label}
            </button>
          </div>
        </>
      )
    }

    if (step.type === 'location') {
      return (
        <>
          <div className="survey-modal__field">
            <label htmlFor="survey-location">{step.inputLabel}</label>
            <input
              id="survey-location"
              type="text"
              autoComplete="address-level2"
              placeholder={step.placeholder}
              value={
                answers.location === 'Пропущено' ? '' : answers.location
              }
              onChange={(e) => setAnswer('location', e.target.value)}
            />
          </div>
          <div className="survey-modal__skip-row">
            <button
              type="button"
              className="survey-modal__skip"
              onClick={() => {
                setAnswer('location', 'Пропущено')
                setStepIndex((i) => i + 1)
              }}
            >
              {step.skip.label}
            </button>
          </div>
        </>
      )
    }

    if (step.type === 'contact') {
      return (
        <>
          {error ? <p className="survey-modal__error">{error}</p> : null}
          <div className="survey-modal__field">
            <label htmlFor="survey-name">Ваше ім&apos;я</label>
            <input
              id="survey-name"
              type="text"
              autoComplete="name"
              value={answers.name}
              onChange={(e) => setAnswer('name', e.target.value)}
            />
          </div>
          <div className="survey-modal__field">
            <label htmlFor="survey-phone">Контактний телефон</label>
            <input
              id="survey-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+380 XX XXX XX XX"
              value={answers.phone}
              onChange={(e) => setAnswer('phone', e.target.value)}
            />
          </div>
        </>
      )
    }

    return null
  }

  return (
    <dialog
      ref={dialogRef}
      className="survey-modal"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        handleClose()
      }}
      onClose={handleClose}
    >
      <div className="survey-modal__panel">
        <header className="survey-modal__header">
          <button
            type="button"
            className="survey-modal__close"
            aria-label="Закрити опитувальник"
            onClick={handleClose}
          >
            ×
          </button>
          {!isDone && (
            <>
              <span className="survey-modal__progress">
                Крок {stepIndex + 1} з {totalSteps}
              </span>
              <h2 id={titleId} className="survey-modal__title">
                {step.title}
              </h2>
              {step.subtitle ? (
                <p className="survey-modal__subtitle">{step.subtitle}</p>
              ) : null}
            </>
          )}
          {isDone && (
            <h2 id={titleId} className="survey-modal__title">
              Заявку надіслано
            </h2>
          )}
        </header>

        <div className="survey-modal__body">{renderStepContent()}</div>

        {!isDone && (
          <footer className="survey-modal__footer">
            {stepIndex > 0 && status !== 'submitting' ? (
              <button
                type="button"
                className="survey-modal__btn survey-modal__btn--back"
                onClick={goBack}
              >
                Назад
              </button>
            ) : null}
            {(step.type !== 'consumption' && step.type !== 'location') ||
            isContact ? (
              <button
                type="button"
                className="survey-modal__btn survey-modal__btn--next"
                disabled={!canProceed() || status === 'submitting'}
                onClick={goNext}
              >
                {status === 'submitting'
                  ? 'Надсилання…'
                  : isContact
                    ? 'Надіслати'
                    : 'Далі'}
              </button>
            ) : (
              <button
                type="button"
                className="survey-modal__btn survey-modal__btn--next"
                disabled={
                  !answers[step.id]?.trim() ||
                  ['Важко відповісти', 'Пропущено'].includes(answers[step.id])
                }
                onClick={goNext}
              >
                Далі
              </button>
            )}
          </footer>
        )}

        {isDone && (
          <footer className="survey-modal__footer">
            <button
              type="button"
              className="survey-modal__btn survey-modal__btn--next"
              onClick={handleClose}
            >
              Закрити
            </button>
          </footer>
        )}
      </div>
    </dialog>
  )
}

export default SurveyModal

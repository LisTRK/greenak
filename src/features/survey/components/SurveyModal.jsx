import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { submitSurvey } from '../api/submitSurvey.js'
import { INITIAL_ANSWERS, SURVEY_STEPS } from '../config/surveySteps.js'
import { canProceedStep } from '../lib/surveyValidation.js'
import SurveyModalHeader from './SurveyModalHeader.jsx'
import {
  SurveyStepChoice,
  SurveyStepConsumption,
  SurveyStepContact,
  SurveyStepLocation,
  SurveyStepSuccess,
} from './surveyStepContent.jsx'
import './SurveyModal.css'

function SurveyModal({ open, onClose }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const step = SURVEY_STEPS[stepIndex]
  const totalSteps = SURVEY_STEPS.length
  const isDone = status === 'success'
  const isContact = step?.type === 'contact'
  const isLastStep = stepIndex === totalSteps - 1
  const showNextButton = !isDone && step?.type !== 'choice'
  const canProceed = canProceedStep(step, answers)

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

    if (!open) {
      if (dialog.open) dialog.close()
      return
    }

    dialog.showModal()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    setError('')
  }

  const goToStep = (index) => {
    setStepIndex(index)
    setError('')
  }

  const goNext = async () => {
    if (isLastStep) {
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
      goToStep(stepIndex + 1)
    }
  }

  const goBack = () => {
    if (stepIndex > 0) goToStep(stepIndex - 1)
  }

  const handleChoiceSelect = (stepId, label) => {
    setAnswers((prev) => ({ ...prev, [stepId]: label }))
    setError('')
    setStepIndex((current) => {
      const currentStep = SURVEY_STEPS[current]
      if (currentStep?.id !== stepId) return current
      return current < totalSteps - 1 ? current + 1 : current
    })
  }

  const handleSkip = (fieldId, value) => {
    setAnswer(fieldId, value)
    if (stepIndex < totalSteps - 1) goToStep(stepIndex + 1)
  }

  const renderBody = () => {
    if (isDone) {
      return <SurveyStepSuccess phone={answers.phone} />
    }

    if (!step) return null

    switch (step.type) {
      case 'choice':
        return (
          <SurveyStepChoice
            step={step}
            value={answers[step.id]}
            onSelect={(label) => handleChoiceSelect(step.id, label)}
          />
        )
      case 'consumption':
        return (
          <SurveyStepConsumption
            step={step}
            value={answers.consumption}
            onChange={(v) => setAnswer('consumption', v)}
            onSkip={(v) => handleSkip('consumption', v)}
          />
        )
      case 'location':
        return (
          <SurveyStepLocation
            step={step}
            value={answers.location}
            onChange={(v) => setAnswer('location', v)}
            onSkip={(v) => handleSkip('location', v)}
          />
        )
      case 'contact':
        return (
          <SurveyStepContact
            error={error}
            name={answers.name}
            phone={answers.phone}
            onNameChange={(v) => setAnswer('name', v)}
            onPhoneChange={(v) => setAnswer('phone', v)}
          />
        )
      default:
        return null
    }
  }

  const getNextLabel = () => {
    if (status === 'submitting') return 'Надсилання…'
    if (isLastStep) return 'Надіслати'
    return 'Далі'
  }
  
  // 2. Умова блокування кнопки (якщо не валідно АБО йде відправка)
  const isNextDisabled = !canProceed || status === 'submitting'
  
  // 3. Чи взагалі потрібно показувати кнопку "Далі / Надіслати" на цьому кроці
  const shouldShowNext = showNextButton || isLastStep

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
        <SurveyModalHeader
          titleId={titleId}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          title={step?.title}
          subtitle={step?.subtitle}
          isDone={isDone}
          onClose={handleClose}
        />

        <div className="survey-modal__body">{renderBody()}</div>

        {!isDone && (
  <footer className="survey-modal__footer">
    {/* Кнопка "Назад" (ховається на 1-му кроці або під час відправки) */}
    {/* {stepIndex > 0 && status !== 'submitting' && (
      <button
        type="button"
        className="survey-modal__btn survey-modal__btn--back"
        onClick={goBack}
      >
        Назад
      </button>
    )} */}

    {/* Єдина, повністю динамічна головна кнопка */}
    {shouldShowNext && (
      <button
        type="button"
        className="survey-modal__btn survey-modal__btn--next"
        disabled={isNextDisabled}
        onClick={goNext}
      >
        {getNextLabel()}
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

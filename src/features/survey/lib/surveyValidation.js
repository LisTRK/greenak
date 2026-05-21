import { SKIP_VALUES } from './constants.js'

export function normalizePhone(value) {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 ? digits : ''
}

export function canProceedStep(step, answers) {
  if (!step) return false

  switch (step.type) {
    case 'contact':
      return (
        answers.name.trim().length >= 2 &&
        normalizePhone(answers.phone).length >= 10
      )
    case 'consumption': {
      const value = answers.consumption?.trim() ?? ''
      return Boolean(value) && !SKIP_VALUES.includes(value)
    }
    case 'location': {
      const value = answers.location?.trim() ?? ''
      return Boolean(value) && value !== 'Пропущено'
    }
    case 'choice':
      return Boolean(answers[step.id])
    default:
      return false
  }
}

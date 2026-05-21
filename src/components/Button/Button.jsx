import './Button.css'

function Button({ onClick }) {
  return (
    <button type="button" className="main-btn" onClick={onClick}>
      <span className="main-btn__label">
        Підібрати станцію
      </span>
    </button>
  )
}

export default Button

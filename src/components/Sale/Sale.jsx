import Button from '../Button/Button.jsx'
import './Sale.css'

function Sale() {
  return (
    <section className="sale" aria-label="Сонячна електростанція під ключ">
      <div className="sale__inner">
        <h1>Сонце — інвестиція в автономність вашого дому та бізнесу.</h1>
        <h2>
          Переходьте на власну генерацію під ключ: гарантована енергонезалежність та
          економія на десятиліття.
        </h2>
        <Button />
      </div>
    </section>
  )
}

export default Sale

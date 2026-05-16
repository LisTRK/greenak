import Button from '../Button/Button.jsx'
import './Sale.css'

function Sale() {
  return (
    <section className="sale" aria-label="Розрахунок вартості станції">
      <div className="sale__inner">
        <h1>
          Дайте відповідь на 8 запитань та{' '}
          <span>дізнайтесь вартість сонячної електростанції під ваші вимоги</span>{' '}
          прямо зараз
        </h1>
        <Button />
      </div>
    </section>
  )
}

export default Sale

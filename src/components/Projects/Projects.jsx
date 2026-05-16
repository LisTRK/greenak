import { useCallback, useState } from 'react'
import img2 from '../../images/FreeSolar2.png'
import img3 from '../../images/FreeSolar3.png'
import img4 from '../../images/FreeSolar4.png'
import './Projects.css'

const slides = [
  {
    src: img2,
    alt: 'Велика наземна сонячна електростанція під хмарним небом',
  },
  {
    src: img3,
    alt: 'Ряд сонячних панелей на відкритій ділянці',
  },
  {
    src: img4,
    alt: 'Сонячні панелі на червоному даху будинку',
  },
]

function Projects() {
  const [index, setIndex] = useState(0)
  const count = slides.length

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count)
  }, [count])

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % count)
  }, [count])

  return (
    <section className="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="projects__title">
        Наші реалізовані проекти
      </h2>
      <div
        className="projects__carousel"
        role="region"
        aria-roledescription="карусель"
        aria-label="Фото сонячних електростанцій"
      >
        <div className="projects__viewport">
          <ul
            className="projects__track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <li key={slide.src} className="projects__slide" aria-hidden={i !== index}>
                <img src={slide.src} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} />
              </li>
            ))}
          </ul>

          <div className="projects__controls">
            <button
              type="button"
              className="projects__nav projects__nav--prev"
              onClick={goPrev}
              aria-label="Попереднє фото"
            >
              ‹
            </button>
            <button
              type="button"
              className="projects__nav projects__nav--next"
              onClick={goNext}
              aria-label="Наступне фото"
            >
              ›
            </button>
          </div>
        </div>

        <div className="projects__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className="projects__dot"
              data-active={i === index}
              aria-current={i === index ? 'true' : undefined}
              aria-label={`Слайд ${i + 1} з ${count}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects

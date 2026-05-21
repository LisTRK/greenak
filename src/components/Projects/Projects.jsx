import { useCallback, useState } from 'react'
import img2Avif from '../../images/FreeSolar2.avif'
import img2Webp from '../../images/FreeSolar2.webp'
import img3Avif from '../../images/FreeSolar3.avif'
import img3Webp from '../../images/FreeSolar3.webp'
import img4Avif from '../../images/FreeSolar4.avif'
import img4Webp from '../../images/FreeSolar4.webp'
import meta from '../../image-meta.json'
import './Projects.css'

const slides = [
  {
    id: 'FreeSolar2',
    webp: img2Webp,
    avif: img2Avif,
    alt: 'Велика наземна сонячна електростанція під хмарним небом',
  },
  {
    id: 'FreeSolar3',
    webp: img3Webp,
    avif: img3Avif,
    alt: 'Ряд сонячних панелей на відкритій ділянці',
  },
  {
    id: 'FreeSolar4',
    webp: img4Webp,
    avif: img4Avif,
    alt: 'Сонячні панелі на червоному даху будинку',
  },
]

function SlideImage({ slide, eager }) {
  const { width, height } = meta[slide.id]
  return (
    <picture>
      <source type="image/avif" srcSet={slide.avif} />
      <source type="image/webp" srcSet={slide.webp} />
      <img
        src={slide.webp}
        alt={slide.alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  )
}

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
              <li key={slide.id} className="projects__slide" aria-hidden={i !== index}>
                <SlideImage slide={slide} eager={i === 0} />
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




import { useCallback, useState, useEffect } from 'react'
import meta from '@/assets/image-meta.json'
import './Projects.css'

const slidesData = [
  { id: 'FreeSolar2', alt: 'Велика наземна сонячна електростанція під хмарним небом' },
  { id: 'FreeSolar3', alt: 'Ряд сонячних панелей на відкритій ділянці' },
  { id: 'FreeSolar4', alt: 'Сонячні панелі на червоному даху будинку' },
]

function Projects() {
  const [index, setIndex] = useState(0)
  const count = slidesData.length

  // Зберігаємо завантажені шляхи до картинок у вигляді об'єкта: { 'FreeSolar2': { avif: '...', webp: '...' }, ... }
  const [loadedSrcs, setLoadedSrcs] = useState({})

  // Окремо відстежуємо поточний активний слайд для завантаження
  const currentSlide = slidesData[index]

  // Функція для динамічного завантаження картинок конкретного слайду
  const loadImagesForSlide = useCallback(async (slideId) => {
    // Якщо картинка вже завантажувалася раніше — нічого не робимо
    if (loadedSrcs[slideId]) return

    try {
      const [avifModule, webpModule] = await Promise.all([
        import(`@/images/${slideId}.avif`),
        import(`@/images/${slideId}.webp`),
      ])

      setLoadedSrcs((prev) => ({
        ...prev,
        [slideId]: {
          avif: avifModule.default,
          webp: webpModule.default,
        },
      }))
    } catch (error) {
      console.error(`Помилка завантаження картинок для ${slideId}:`, error)
    }
  }, [loadedSrcs])

  // 1. При першому запуску сайту миттєво вантажимо ТІЛЬКИ ПЕРШИЙ слайд (для LCP)
  useEffect(() => {
    loadImagesForSlide(slidesData[0].id)
  }, [])

  // 2. Коли користувач перемикає слайд, починаємо вантажити його картинки фоном
  useEffect(() => {
    loadImagesForSlide(currentSlide.id)
  }, [currentSlide.id, loadImagesForSlide])


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
            {slidesData.map((slide, i) => {
              const { width, height } = meta[slide.id]
              const srcs = loadedSrcs[slide.id]

              return (
                <li key={slide.id} className="projects__slide" aria-hidden={i !== index}>
                  
                 
                  {srcs ? (
                    <picture>
                      <source type="image/avif" srcSet={srcs.avif} />
                      <source type="image/webp" srcSet={srcs.webp} />
                      <img
                        src={srcs.webp}
                        alt={slide.alt}
                        width={width}
                        height={height}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </picture>
                  ) : (
                    // Створюємо невидимий каркас з правильними пропорціями, щоб не ламався макет треку
                    <div style={{ width: '100%', height: 'auto', aspectRatio: `${width}/${height}` }} />
                  )}
                </li>
              )
            })}
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
          {slidesData.map((_, i) => (
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


/*
import { useCallback, useState } from 'react'
import meta from '@/assets/image-meta.json'
import img2Avif from '@/images/FreeSolar2.avif'
import img2Webp from '@/images/FreeSolar2.webp'
import img3Avif from '@/images/FreeSolar3.avif'
import img3Webp from '@/images/FreeSolar3.webp'
import img4Avif from '@/images/FreeSolar4.avif'
import img4Webp from '@/images/FreeSolar4.webp'
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
*/
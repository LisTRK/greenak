import panelAvif from '../../images/solnechnyhPanel.avif'
import panelWebp from '../../images/solnechnyhPanel.webp'
import meta from '../../image-meta.json'
import './Banner.css'

const { width, height } = meta.solnechnyhPanel

function Banner() {
  return (
    <section className="banner" role="banner" aria-label="Промо банер">
      <div className="banner__inner">
        <div className="banner__headline">
          <span className="banner__title">СОНЯЧНА СТАНЦІЯ</span>
          <div className="banner__highlights">
            <span className="banner__accent">30 КВТ</span>
            <span className="banner__accent banner__price">ЗА 9 999 $</span>
            <span className="banner__sep" aria-hidden="true" />
          </div>
        </div>
        <p className="banner__sub">Окупність — меньше 2 років</p>
      </div>

      <div className="banner__hero-media">
        <picture>
          <source type="image/avif" srcSet={panelAvif} />
          <source type="image/webp" srcSet={panelWebp} />
          <img
            className="banner__photo"
            src={panelWebp}
            alt="Приватний будинок із сонячними панелями на даху"
            width={width}
            height={height}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <p className="banner__profit">6 480 євро прибутку на рік</p>
      </div>
    </section>
  )
}

export default Banner

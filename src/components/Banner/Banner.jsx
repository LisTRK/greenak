import panelImg from '../../images/solnechnyhPanel.jpg'
import './Banner.css'

function Banner() {
  return (
    <section className="banner" role="banner" aria-label="Промо банер">
      <div className="banner__inner">
        <p className="banner__headline">
          СОНЯЧНА СТАНЦІЯ <span className="banner__accent">30 КВТ</span>
        </p>
        <p className="banner__sub">
          <span className="banner__accent banner__price">ЗА 9 999 $</span>
          <span className="banner__sep" aria-hidden="true" />
          <span>Окупність — меньше 2 років</span>
        </p>
      </div>

      <div className="banner__hero-media">
        <img
          className="banner__photo"
          src={panelImg}
          alt="Приватний будинок із сонячними панелями на даху"
        />
        <p className="banner__profit">6 480 євро прибутку на рік</p>
      </div>
    </section>
  )
}

export default Banner

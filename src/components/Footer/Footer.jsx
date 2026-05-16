import logoImg from '../../images/FreeSolar.png'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer" aria-label="Партнерський бренд">
      <div className="footer__brand">
        <img
          className="footer__logo"
          src={logoImg}
          alt="Free Solar — вільна енергія для вас"
          loading="lazy"
        />
      </div>
    </footer>
  )
}

export default Footer

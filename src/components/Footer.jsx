import { footer, person } from '../content/site.js'

export default function Footer() {
  return (
    <footer className="site-footer grid-paper">
      <div className="shell site-footer__grid">
        <div>
          <p className="site-footer__note">{footer.note}</p>
        </div>
        <div className="site-footer__meta">
          {footer.meta.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span>
            {person.name} / {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  )
}
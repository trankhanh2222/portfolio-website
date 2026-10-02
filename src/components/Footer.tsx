import { useSite } from "../site-context";

export default function Footer() {
  const { t } = useSite();
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <p>{t.person.name}</p>
        <p>{t.footer.note}</p>
        <p>
          <a className="text-link" href="#top">
            {t.ui.backToTop}
          </a>
        </p>
      </div>
    </footer>
  );
}

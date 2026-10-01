import { footer, person } from "../content/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <p>{person.name}</p>
        <p>{footer.note}</p>
        <p>
          <a className="text-link" href="#top">
            Back to top
          </a>
        </p>
      </div>
    </footer>
  );
}

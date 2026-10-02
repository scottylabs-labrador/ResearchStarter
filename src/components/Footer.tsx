import { cx } from "./ui/cx";
import { linkUnderline } from "./ui/linkClass";

const Footer = () => (
  <footer className="border-t border-hairline px-8 py-6">
    <p className="text-small text-ink-muted">
      Designed, developed and maintained with <span aria-label="love">♥</span> by{" "}
      <a
        href="https://scottylabs.org"
        target="_blank"
        rel="noopener noreferrer"
        className={cx(linkUnderline, "font-medium text-accent-strong decoration-accent/35 transition-colors duration-150 hover:decoration-accent-strong/50")}
      >
        ScottyLabs
      </a>
      .
    </p>
  </footer>
);

export default Footer;

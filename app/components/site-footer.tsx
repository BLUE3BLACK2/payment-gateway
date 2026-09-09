import Link from "next/link";
import { Camera, Send, UsersRound } from "lucide-react";
import { BrandLogo } from "./brand-logo";

const footerLinks = ["About us", "Business and groups", "Support", "Responsibility", "Blog"];

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-shell">
        <div className="footer-main">
          <BrandLogo inverse />

          <nav className="footer-navigation" aria-label="Footer navigation">
            {footerLinks.map((label) => <Link key={label} href="#">{label}</Link>)}
          </nav>

          <div className="footer-preferences">
            <div>
              <p className="footer-label">Social</p>
              <div className="social-links">
                <a href="#" aria-label="Community"><UsersRound size={15} /></a>
                <a href="#" aria-label="Instagram"><Camera size={15} /></a>
                <a href="#" aria-label="Social updates"><Send size={15} /></a>
              </div>
            </div>
            <label className="language-picker">
              <span className="footer-label">Language</span>
              <select defaultValue="English" aria-label="Language">
                <option>English</option>
                <option>Bahasa Indonesia</option>
              </select>
            </label>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Kaia. All rights reserved</p>
          <div className="footer-legal"><Link href="#">Terms of Service</Link><Link href="#">Privacy Policy</Link></div>
          <a href="tel:+16655556454">+1 665-555-6454</a>
        </div>
      </div>
    </footer>
  );
}

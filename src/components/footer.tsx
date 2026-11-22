import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer({ auth = false }: { auth?: boolean }) {
  return <footer className="site-footer"><div className="footer-main">
    <div className="footer-brand-column"><Link href="/" className="brand footer-brand"><span className="brand-mark">S</span><span>SALONBOOK<small>THE BEAUTY SANCTUARY</small></span></Link><p>An elite sanctuary of bespoke aesthetic rituals<br/>and curated artisans. Bridging architectural<br/>stillness with tactile hospitality to honor timeless<br/>beauty traditions.</p><span className="footer-subhead">The Private Concierge</span><p>Dedicated itinerary planning &amp; bespoke treatments.</p></div>
    <div><b>Atelier</b><Link href="/">Home</Link><Link href="/services">Browse Services</Link><Link href="/services">Categories</Link><Link href="/#experience">Artisans</Link><Link href="/sign-up">Gift Cards &amp; Membership</Link></div>
    <div><b>Concierge &amp; Atelier</b><a href="mailto:concierge@salonbook.com">concierge@salonbook.com</a><a href="tel:+18004287690">+1 (800) 428-7690</a><span className="footer-subhead">Private Client Line</span><p>450 Madison Avenue, 9th Floor<br/>New York, NY 10022</p></div>
    <div><b>Hours &amp; Editorial</b><p>Mon – Sat: 9:00 AM – 9:00 PM<br/>Sun: 10:00 AM – 6:00 PM</p><span className="footer-subhead">Publications &amp; Social</span><p><a href="https://www.instagram.com/">Instagram</a> · <a href="https://www.pinterest.com/">Pinterest</a><br/>Editorial Journal · Vogue Directory</p></div>
  </div><div className="footer-bottom"><span>© 2025 SalonBook Inc. All rights reserved. Discreet luxury salon sanctuary.</span><span><Link href={auth ? "/sign-up#atelier-terms" : "/"}>Privacy Policy</Link> · <Link href={auth ? "/sign-up#atelier-terms" : "/"}>Terms of Service</Link> · <Link href={auth ? "/sign-up#atelier-terms" : "/"}>Atelier Etiquette</Link> <ArrowUpRight size={12}/></span></div></footer>;
}

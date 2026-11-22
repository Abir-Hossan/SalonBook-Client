import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, HeartHandshake, Scissors, ShieldCheck, Sparkles } from "lucide-react";
import { PublicHeader } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceCard } from "@/components/service-card";
import { Eyebrow } from "@/components/ui";
import { listServiceCategories, listServices } from "@/lib/services-api";
import "./home-reference.css";

const guarantees = [
  { title: "Curated Excellence", text: "Discover specialist treatments and the people behind them.", Icon: Sparkles },
  { title: "Time Reclaimed", text: "Browse each ritual with its duration and price clearly listed.", Icon: Clock3 },
  { title: "Tailored Hospitality", text: "Contact our concierge for help choosing a treatment.", Icon: HeartHandshake },
  { title: "Considered Changes", text: "Review the available options before requesting an appointment.", Icon: ShieldCheck },
];

export default async function HomePage() {
  const [featured, catalogue] = await Promise.allSettled([
    listServices(new URLSearchParams({ limit: "6" })),
    listServiceCategories(),
  ]);
  const services = featured.status === "fulfilled" ? featured.value.data : [];
  const categories = catalogue.status === "fulfilled" ? catalogue.value.data : [];
  return <div className="reference-home">
    <PublicHeader/>
    <main>
      <section className="home-ref-wrap home-ref-hero" aria-labelledby="home-title">
        <div>
          <Eyebrow>Discreet hospitality &amp; bespoke rituals</Eyebrow>
          <h1 id="home-title">Your Beauty.<br/><em>Your Moment.</em></h1>
          <p>Discover a sanctuary for thoughtful expertise, bespoke aesthetic rituals, and the quiet luxury of being beautifully you.</p>
          <div className="home-ref-actions">
            <Link className="button button-dark" href="/services">Explore Salon Services <ArrowUpRight size={15}/></Link>
            <Link className="button button-outline" href="#philosophy">Our philosophy</Link>
          </div>
        </div>
        <figure className="home-ref-photo">
          <Image src="/images/salon-interior-original.png" alt="Warm, sunlit salon interior" fill priority sizes="(max-width: 760px) 100vw, 46vw"/>
          <figcaption><strong>The SalonBook Sanctuary</strong><span>Considered spaces for bespoke beauty rituals.</span></figcaption>
        </figure>
      </section>
      <div className="home-ref-wrap home-ref-quick">
        <span><Scissors size={18}/> Explore treatments</span><span><CalendarDays size={18}/> Choose your appointment</span>
        <Link className="button button-dark" href="/services">Find appointments <ArrowUpRight size={15}/></Link>
      </div>
      <section className="home-ref-band" aria-labelledby="service-categories">
        <div className="home-ref-wrap">
          <Eyebrow>Discover the collection</Eyebrow>
          <div className="home-ref-section-head"><h2 id="service-categories">Explore by Specialty</h2><Link className="text-link" href="/services">Browse all services <ArrowUpRight size={15}/></Link></div>
          <p>Find the treatment that suits your needs.</p>
          {categories.length > 0 ? <div className="home-ref-categories">
            {categories.map((category) => <Link key={category} href={"/services?" + new URLSearchParams({ category })}><Scissors size={18}/><strong>{category}</strong><ArrowUpRight size={13}/></Link>)}
          </div> : <p>{catalogue.status === "rejected" ? "Categories are temporarily unavailable." : "No service categories are available yet."}</p>}
        </div>
      </section>
      <section className="home-ref-wrap home-ref-offerings" id="atelier">
        <Eyebrow>The SalonBook edit</Eyebrow><h2>Signature Offerings</h2>
        <p>Explore a collection of treatments from our atelier.</p>
        {services.length ? <div className="service-grid">{services.map((service, index) => <ServiceCard key={service.id} service={service} index={index}/>)}</div> :
          <p>{featured.status === "rejected" ? "Services are temporarily unavailable." : "There are no active services yet."}</p>}
      </section>
      <section className="home-ref-band" id="experience">
        <div className="home-ref-wrap home-ref-experience">
          <figure className="home-ref-photo"><Image src="/images/salon-reception.png" alt="SalonBook reception lounge" fill sizes="(max-width: 760px) 100vw, 45vw"/></figure>
          <div id="philosophy">
            <Eyebrow>Our philosophy</Eyebrow><h2>Crafted for Discerning Patrons</h2>
            <p>Every detail, every touch, and every conversation is considered so your experience feels entirely your own.</p>
            {guarantees.slice(0, 3).map(({ title, text, Icon }) => <div className="home-ref-feature" key={title}><Icon size={19}/><div><strong>{title}</strong><p>{text}</p></div></div>)}
          </div>
        </div>
      </section>
      <section className="home-ref-wrap home-ref-offerings">
        <Eyebrow>The atelier standard</Eyebrow><h2>The Sanctuary Guarantee</h2>
        <div className="home-ref-guarantees">{guarantees.map(({ title, text, Icon }) => <article key={title}><Icon size={20}/><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      <section className="home-ref-band home-ref-quote">
        <div className="home-ref-wrap"><Eyebrow>The SalonBook philosophy</Eyebrow><h2>Client Perspectives</h2><blockquote>“When you feel beautifully yourself, everything else follows.”</blockquote></div>
      </section>
      <section className="home-ref-book"><div className="home-ref-wrap"><h2>Step Into Your Sanctuary.</h2><div className="home-ref-actions">
        <Link className="button button-light" href="/services">Explore Appointments <ArrowUpRight size={15}/></Link>
        <a className="button button-outline" href="mailto:concierge@salonbook.com">Contact Private Concierge</a>
      </div></div></section>
    </main>
    <Footer/>
  </div>;
}

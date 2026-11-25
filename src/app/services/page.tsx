"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Clock3, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { PublicHeader } from "@/components/header";
import { Footer } from "@/components/footer";
import { listServiceCategories, listServices } from "@/lib/services-api";
import type { Service } from "@/types";

function CatalogCard({ service, index }: { service: Service; index: number }) {
  return (
    <article className="catalog-card">
      <Link href={`/services/${service.id}`} className="catalog-card-media" aria-label={`View ${service.serviceName}`}>
        <Image src={service.image} alt={service.serviceName} fill sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" priority={index < 3} />
        <div className="catalog-card-tags"><span>{service.category}</span></div>
      </Link>
      <div className="catalog-card-copy">
        <Link href={`/services/${service.id}`}><h2>{service.serviceName}</h2></Link>
        <p>{service.description}</p>
        <div className="catalog-card-facts"><span><Clock3 size={14} /> {service.duration} min</span><strong>${service.price}</strong></div>
        <Link className="catalog-card-cta" href={`/services/${service.id}`}>View details &amp; reserve <ArrowRight size={15} /></Link>
      </div>
    </article>
  );
}

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCategory(new URLSearchParams(window.location.search).get("category") || "");
    setReady(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    listServiceCategories(controller.signal)
      .then(({ data }) => setCategories(data))
      .catch(() => {});
    return () => controller.abort();
  }, [retry]);

  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const timer = window.setTimeout(async () => {
      const query = new URLSearchParams({ sort, page: String(page), limit: "12" });
      if (search.trim()) query.set("q", search.trim());
      if (category) query.set("category", category);
      try {
        const { data, meta } = await listServices(query, controller.signal);
        if (controller.signal.aborted) return;
        const lastPage = Math.max(1, meta?.totalPages ?? 1);
        if (page > lastPage) {
          setPage(lastPage);
          return;
        }
        setItems(data);
        setTotal(meta?.total ?? data.length);
        setTotalPages(lastPage);
        setLoading(false);
      } catch {
        if (controller.signal.aborted) return;
        setError("The service catalogue could not load. Please try again.");
        setLoading(false);
      }
    }, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [ready, search, category, sort, page, retry]);

  function clearFilters() {
    setSearch("");
    setCategory("");
    setSort("newest");
    setPage(1);
  }

  return <>
    <PublicHeader />
    <main className="catalog-page">

      <section className="catalog-hero">
        <div className="catalog-container">
          <div className="catalog-kicker"><span /> The Curated Collection · Bespoke Rituals</div>
          <h1>Browse Atelier Services <em>— Curated for Discerning Patrons</em></h1>
          <p>Explore bespoke beauty experiences, clinical esthetics, and holistic wellness therapies performed exclusively by vetted master colorists, licensed estheticians, and senior artisans across our global flagship sanctuaries.</p>
          <div className="catalog-stats">
            <article><span>Service categories</span><strong>{categories.length}</strong></article>
          </div>
        </div>
      </section>

      <section className="catalog-content">
        <div className="catalog-container">
          <div className="catalog-controls">
            <label className="catalog-search"><Search size={17} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} maxLength={100} placeholder="Search by treatment name..." />{search && <button type="button" onClick={() => { setSearch(""); setPage(1); }} aria-label="Clear search"><X size={14} /></button>}</label>
            <label className="catalog-sort"><SlidersHorizontal size={15} /><span>Sort by:</span><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}><option value="newest">Newest</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option></select><ChevronDown size={13} /></label>
            <button className="catalog-clear" type="button" onClick={clearFilters}> <X size={13} /> Clear filters</button>
          </div>

          <div className="catalog-category-row" role="group" aria-label="Filter by category">
            {["", ...categories].map((item) => <button key={item} type="button" aria-pressed={category === item} className={category === item ? "active" : ""} onClick={() => { setCategory(item); setPage(1); }}>{item || "All Categories"}</button>)}
          </div>
          <div className="catalog-quick-filters"><small aria-live="polite">{!loading && !error && `Showing ${items.length} of ${total} services`}</small></div>

          {loading ? <div className="catalog-grid">{Array.from({ length: 6 }).map((_, index) => <div className="catalog-skeleton" key={index}><span /><b /><i /><i /></div>)}</div> : error ? <div className="catalog-empty" role="alert"><h2>Catalogue unavailable</h2><p>{error}</p><button type="button" className="catalog-card-cta" onClick={() => setRetry((value) => value + 1)}>Try again</button></div> : items.length === 0 ? <div className="catalog-empty"><Sparkles size={25} /><h2>No matching rituals found</h2><p>Try another treatment name or clear your filters to explore the full curated collection.</p><button type="button" className="catalog-card-cta" onClick={clearFilters}>Clear all filters <ArrowRight size={15} /></button></div> : <div className="catalog-grid">{items.map((service, index) => <CatalogCard key={service.id} service={service} index={index} />)}</div>}

          {totalPages > 1 && !error && <nav className="catalog-pagination" aria-label="Service pages">
            <button type="button" disabled={loading || page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button type="button" disabled={loading || page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </nav>}

          <section className="catalog-concierge"><div><span>Private sanctuary buyouts</span><h2>Looking for a custom multi-artisan day<br />ritual or bridal suite buyout?</h2><p>Speak directly with our Private Client Concierge. Available 7 days a week to curate bespoke itineraries, private styling chambers, and off-menu artisan requests.</p></div><div><Link href="mailto:concierge@salonbook.com" className="concierge-button"> <Sparkles size={15} /> Connect with concierge</Link><a href="tel:+18004287690">Direct client line</a></div></section>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}

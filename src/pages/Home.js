import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FeaturesOrbit from '../components/FeaturesOrbit';
import heroBg from '../assests/hero-bg.jpg';
import testimonialsVideo from '../assests/testimonials-bg.mp4';
import { listings } from '../data/listings';
import { formatPrice } from '../utils/formatters';
import { useTranslation } from '../i18n/useTranslation';

const stats = [
  { value: `${listings.length}+`, label: 'Logements disponibles' },
  { value: '8', label: 'Villes universitaires' },
  { value: '500+', label: 'Étudiants inscrits' },
  { value: '98%', label: 'Taux de satisfaction' },
];

const testimonials = [
  {
    name: 'Mouna Ben Ali',
    role: 'Étudiante — Université de Tunis El Manar',
    quote: "J'ai trouvé un appartement proche de mon campus en moins d'une semaine, et la messagerie intégrée m'a permis d'échanger directement avec le propriétaire.",
    rating: 5,
  },
  {
    name: 'Khaled Trabelsi',
    role: 'Propriétaire — Tunis',
    quote: "Publier mes annonces est très simple, et je reçois des demandes de réservation claires avec les profils des étudiants avant de répondre.",
    rating: 5,
  },
  {
    name: 'Sami Khalfi',
    role: 'Propriétaire — Sousse',
    quote: "La vérification des comptes me donne confiance pour louer à des étudiants sérieux, sans mauvaises surprises.",
    rating: 4,
  },
];

function parseStatValue(value) {
  const match = value.match(/\d+/);
  if (!match) return { prefix: value, target: 0, suffix: '' };
  const target = parseInt(match[0], 10);
  return {
    prefix: value.slice(0, match.index),
    target,
    suffix: value.slice(match.index + match[0].length),
  };
}

function StatCounter({ value, label }) {
  const { prefix, target, suffix } = parseStatValue(value);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame;
    let timeout;
    const duration = 1200;

    const animate = () => {
      const start = performance.now();
      const step = now => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) {
          frame = requestAnimationFrame(step);
        } else {
          timeout = setTimeout(() => {
            setCount(0);
            frame = requestAnimationFrame(step2);
          }, 2000);
        }
      };
      const step2 = () => animate();
      frame = requestAnimationFrame(step);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [target]);

  return (
    <div className="text-center">
      <p className="text-3xl font-extrabold text-amber-500 sm:text-4xl">{prefix}{count}{suffix}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={index < rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 2.8 5.9 6.4.7-4.7 4.5 1.2 6.4L12 17.9l-5.7 2.6 1.2-6.4-4.7-4.5 6.4-.7L12 3Z" />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const featuredListings = [...listings].slice(-3).reverse();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/85 via-[#0f172a]/80 to-[#020617]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.2),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020617] to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6 text-center lg:text-left">
              <span className="inline-flex rounded-full bg-amber-300/20 px-4 py-1 text-sm font-semibold text-amber-200 ring-1 ring-amber-200/20">{t.home.heroBadge}</span>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{t.home.heroTitle}</h1>
              <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-300 lg:mx-0">{t.home.heroDescription}</p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link to="/logements" className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-300">{t.home.exploreListings}</Link>
              </div>
            </div>
            <div className="hidden lg:block" aria-hidden="true" />
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="pointer-events-auto">
            <FeaturesOrbit />
          </div>
        </div>
      </section>

      {/* 1. CHIFFRES CLÉS */}
      <section className="bg-white py-14 dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map(stat => (
            <StatCounter key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </section>

      {/* 3. LOGEMENTS À LA UNE */}
      <section className="bg-slate-50 py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-500">{t.home.featuredLabel}</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-slate-100">{t.home.featuredTitle}</h2>
            </div>
            <Link to="/logements" className="text-sm font-semibold text-amber-500 hover:text-amber-600">{t.home.viewAllListings}</Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredListings.map(listing => (
              <Link
                key={listing.id}
                to={`/logements/${listing.id}`}
                className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-300/10 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={listing.photos[0]} alt={listing.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">{listing.rating} ★</span>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-500">{listing.city} • {listing.type}</p>
                  <h3 className="mt-2 font-semibold text-slate-950 dark:text-slate-100">{listing.title}</h3>
                  <p className="mt-3 font-semibold text-amber-500">{formatPrice(listing.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DOUBLE CTA ÉTUDIANT / PROPRIÉTAIRE */}
      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="rounded-[2rem] bg-gradient-to-br from-sky-500 to-sky-600 p-10 text-white shadow-xl">
            <h3 className="text-2xl font-bold">Vous cherchez un logement ?</h3>
            <p className="mt-3 text-sky-100">Parcourez des centaines d'annonces vérifiées près de votre université, et trouvez des colocataires compatibles avec votre style de vie.</p>
            <Link to="/logements" className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50">Explorer les logements</Link>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-amber-400 to-orange-400 p-10 text-slate-950 shadow-xl">
            <h3 className="text-2xl font-bold">Vous êtes propriétaire ?</h3>
            <p className="mt-3 text-slate-900/80">Publiez votre annonce en quelques minutes et recevez des demandes de réservation d'étudiants vérifiés.</p>
            <Link to="/register" className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Publier une annonce</Link>
          </div>
        </div>
      </section>

      {/* 5. TÉMOIGNAGES */}
      <section className="relative overflow-hidden py-20">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={testimonialsVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-500">{t.home.testimonials}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-slate-100">{t.home.communityTitle}</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map(item => (
              <div key={item.name} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/10 dark:border-slate-700 dark:bg-slate-800">
                <StarRating rating={item.rating} />
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">"{item.quote}"</p>
                <p className="mt-5 font-semibold text-slate-950 dark:text-slate-100">{item.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BANNIÈRE CTA FINALE */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black py-20">
        <div className="pointer-events-none absolute left-1/4 top-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.home.finalCtaTitle}</h2>
          <p className="mt-4 text-slate-300">{t.home.finalCtaText}</p>
          <div className="mt-8 flex justify-center">
            <Link to="/register" className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-300">{t.home.createAccount}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
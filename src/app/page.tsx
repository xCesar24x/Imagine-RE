"use client";

import Image from "next/image";
import { useState, useMemo, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROPERTIES, Property } from "@/constants/properties";
import PropertyCard from "@/components/PropertyCard";
import Three360Viewer from "@/components/Three360Viewer";
import { 
  Heart, 
  Send, 
  X, 
  ChevronRight, 
  Camera, 
  Share2, 
  Mail, 
  MessageCircle, 
  Sparkles, 
  Compass,
  Menu,
  ChevronDown,
  Trash2,
  Globe
} from "lucide-react";
import { TRANSLATIONS } from "@/constants/translations";
import { getAssetPath } from "@/utils/paths";

export default function Home() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const t = TRANSLATIONS[lang];

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [qualification, setQualification] = useState({
    budget: "",
    origin: "",
    horizon: "",
    financing: "",
  });
  const [formError, setFormError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const wishlistCount = wishlistedIds.length;

  const toggleWishlist = (property: Property) => {
    setWishlistedIds(prev =>
      prev.includes(property.id) ? prev.filter(id => id !== property.id) : [...prev, property.id]
    );
  };

  const removeFromWishlist = (id: string) => {
    setWishlistedIds(prev => prev.filter(item => item !== id));
  };

  const wishlistedProperties = useMemo(() => {
    return PROPERTIES.filter(p => wishlistedIds.includes(p.id));
  }, [wishlistedIds]);

  const handleQualificationChange = (field: keyof typeof qualification, value: string) => {
    setQualification(prev => ({ ...prev, [field]: value }));
  };

  const handleQualificationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (wishlistCount === 0) {
      setFormError(t.wishlist.validationEmptyWishlist);
      return;
    }
    if (!qualification.budget || !qualification.origin || !qualification.horizon || !qualification.financing) {
      setFormError(t.wishlist.validationMissingFields);
      return;
    }
    setFormError("");
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setQualification({ budget: "", origin: "", horizon: "", financing: "" });
    }, 4000);
  };

  // Filtering state
  const [priceFilter, setPriceFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const locations = useMemo(() => {
    const setLocations = new Set<string>();
    PROPERTIES.forEach(p => setLocations.add(p.location));
    return Array.from(setLocations).sort();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    PROPERTIES.forEach(p => p.vibeTags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const SERVICE_CARDS = useMemo(() => [
    {
      title: t.services.cards[0].title,
      description: t.services.cards[0].description,
      icon: Sparkles,
    },
    {
      title: t.services.cards[1].title,
      description: t.services.cards[1].description,
      icon: Compass,
    },
    {
      title: t.services.cards[2].title,
      description: t.services.cards[2].description,
      icon: Mail,
    },
  ], [t]);

  const CONTACT_CHANNELS = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/imaginere.cr?utm_source=qr&igsh=aWV1anFiaHoxNXdz",
      icon: Camera,
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/share/1HXeL5UUnj/",
      icon: Share2,
    },
    {
      label: "Whatsapp",
      href: "https://wa.me/message/4EBZCHNEZWC2A1",
      icon: MessageCircle,
    },
    {
      label: "Email",
      href: "mailto:Imaginerepm@gmail.com",
      icon: Mail,
    },
  ];

  // Filter properties
  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter(p => {
      if (priceFilter === "under-5" && p.price >= 5000000) return false;
      if (priceFilter === "5-10" && (p.price < 5000000 || p.price > 10000000)) return false;
      if (priceFilter === "over-10" && p.price <= 10000000) return false;

      if (sizeFilter === "under-5k" && p.sqft >= 5000) return false;
      if (sizeFilter === "5k-10k" && (p.sqft < 5000 || p.sqft > 10000)) return false;
      if (sizeFilter === "over-10k" && p.sqft <= 10000) return false;

      if (locationFilter !== "all" && p.location !== locationFilter) return false;

      if (selectedTags.length > 0) {
        const hasTag = selectedTags.some(tag => p.vibeTags.includes(tag));
        if (!hasTag) return false;
      }

      return true;
    });
  }, [priceFilter, sizeFilter, locationFilter, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <main className="min-h-screen bg-[#020f0a] text-pearl selection:bg-sunset selection:text-jungle relative">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 px-6 md:px-12 py-5 flex items-center justify-between bg-black/45 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm">
            <Image src={getAssetPath("/images/imagine-logo.jpg")} alt="Imagine logo" fill className="object-contain" />
          </div>
          <div>
            <div className="font-serif text-2xl font-semibold tracking-[0.18em] uppercase">Imagine</div>
            <div className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gray-300/80">Property Management & Real Estate</div>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-10 text-xs font-sans uppercase tracking-[0.32em] text-white/80">
          <a href="#collection" className="transition hover:text-sunset">{t.nav.collection}</a>
          <a href="#services" className="transition hover:text-sunset">{t.nav.services}</a>
          <a href="#contact" className="transition hover:text-sunset">{t.nav.contact}</a>
        </div>

        {/* Controls: Language and Hamburger */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(prev => prev === "en" ? "es" : "en")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-sunset/50 transition text-xs font-sans uppercase tracking-widest text-sunset font-semibold cursor-pointer"
          >
            <Globe size={13} />
            <span>{lang === "en" ? "ES" : "EN"}</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="xl:hidden inline-flex items-center justify-center p-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition text-white cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-[88px] bg-black/60 backdrop-blur-sm z-30 xl:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 top-[88px] z-30 xl:hidden p-6 bg-[#041c16] border-b border-white/10 flex flex-col gap-4 text-center font-sans uppercase tracking-[0.25em] text-xs shadow-2xl"
            >
              <a 
                href="#collection" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 hover:text-sunset transition border-b border-white/5"
              >
                {t.nav.collection}
              </a>
              <a 
                href="#services" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 hover:text-sunset transition border-b border-white/5"
              >
                {t.nav.services}
              </a>
              <a 
                href="#contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 hover:text-sunset transition"
              >
                {t.nav.contact}
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden py-24 mt-[88px]">
        <div className="absolute inset-0">
          <Image
            src={getAssetPath("/images/hero-cover.jpg")}
            alt="Imagine luxury property cover"
            fill
            className="object-cover opacity-95"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020f0a] via-[#02140f]/35 to-transparent" />
          <div className="absolute left-1/2 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#d4af37]/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative z-10 grid gap-8 px-6 py-10 md:px-12 md:py-14 max-w-5xl mx-4 rounded-[2.5rem] border border-white/10 bg-black/45 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
        >
          <div className="mx-auto w-fit rounded-full border border-white/10 bg-white/5 p-1 shadow-inner shadow-black/30">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border border-sunset/40">
              <Image
                src={getAssetPath("/images/bryan-headshot.jpg")}
                alt="Bryan Viquez"
                fill
                className="object-cover grayscale hover:grayscale-0 transition duration-500"
                priority
              />
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-3 rounded-full border border-sunset/20 bg-[#e5c777]/10 px-5 py-2 text-[10px] md:text-xs uppercase tracking-[0.36em] text-sunset/90 shadow-sm shadow-sunset/10">
              {t.hero.badge}
            </div>
            <h1 className="mt-8 text-4xl md:text-6xl xl:text-7xl font-serif uppercase tracking-[-0.03em] leading-tight text-pearl">
              {t.hero.title1} <span className="text-sunset">{t.hero.title2}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-sm md:text-base leading-relaxed text-gray-300/90">
              {t.hero.description}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
                <div className="text-[10px] uppercase tracking-[0.32em] text-gray-400">{t.hero.stats.investment}</div>
                <div className="mt-3 text-4xl font-serif text-pearl">15+</div>
                <div className="mt-2 text-xs text-gray-300 leading-relaxed">{t.hero.stats.investmentDesc}</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
                <div className="text-[10px] uppercase tracking-[0.32em] text-gray-400">{t.hero.stats.concierge}</div>
                <div className="mt-3 text-4xl font-serif text-pearl">24/7</div>
                <div className="mt-2 text-xs text-gray-300 leading-relaxed">{t.hero.stats.conciergeDesc}</div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20 h-full flex flex-col justify-center">
              <div className="text-[10px] uppercase tracking-[0.32em] text-gray-400">{t.hero.stats.signature}</div>
              <div className="mt-3 text-3xl font-serif text-pearl">Bespoke</div>
              <div className="mt-2 text-xs text-gray-300 leading-relaxed">{t.hero.stats.signatureDesc}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#collection" className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-sunset px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-jungle shadow-[0_15px_40px_rgba(212,175,55,0.18)] transition hover:bg-white cursor-pointer">
              {t.hero.viewCollection}
            </a>
            <a href="#services" className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:border-sunset hover:text-sunset cursor-pointer">
              {t.hero.exploreServices}
            </a>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto scroll-mt-24">
        <div className="mb-16 flex flex-col items-center text-center gap-4">
          <div className="text-xs uppercase tracking-[0.36em] text-sunset font-semibold">{t.services.subtitle}</div>
          <h2 className="text-3xl md:text-5xl font-serif">{t.services.title}</h2>
          <p className="max-w-3xl text-sm md:text-base text-gray-300/90 leading-relaxed">
            {t.services.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {SERVICE_CARDS.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:border-sunset/20 transition-all duration-300">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-sunset/10 text-sunset shadow-sm shadow-sunset/10 mb-6">
                <Icon size={24} />
              </div>
              <h3 className="text-xl md:text-2xl font-serif mb-4">{title}</h3>
              <p className="text-xs md:text-sm leading-relaxed text-gray-300/90">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Property Engine (Catalog) */}
      <section id="collection" className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto scroll-mt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div>
            <h2 className="text-xs font-sans text-sunset uppercase tracking-[0.3em] mb-3 font-semibold">{t.catalog.subtitle}</h2>
            <h3 className="text-3xl md:text-5xl font-serif">{t.catalog.title}</h3>
          </div>
          <p className="font-sans text-gray-400 max-w-md text-xs md:text-sm leading-relaxed">
            {t.catalog.description}
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="mb-16 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Price filter */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-md">
              <div className="text-[10px] uppercase tracking-[0.34em] text-gray-400 mb-4">{t.catalog.filters.priceTitle}</div>
              <label className="block text-[10px] font-sans text-gray-400 uppercase tracking-widest mb-2">{t.catalog.filters.priceLabel}</label>
              <div className="relative">
                <select 
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full bg-[#041b15] border border-white/10 text-pearl text-xs font-sans px-4 py-3.5 rounded-2xl appearance-none focus:outline-none focus:border-sunset/50 cursor-pointer pr-10"
                >
                  <option value="all">{t.catalog.filters.all}</option>
                  <option value="under-5">{t.catalog.filters.under5}</option>
                  <option value="5-10">{t.catalog.filters.between5and10}</option>
                  <option value="over-10">{t.catalog.filters.over10}</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sunset" size={14} />
              </div>
            </div>

            {/* Size filter */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-md">
              <div className="text-[10px] uppercase tracking-[0.34em] text-gray-400 mb-4">{t.catalog.filters.sizeTitle}</div>
              <label className="block text-[10px] font-sans text-gray-400 uppercase tracking-widest mb-2">{t.catalog.filters.sizeLabel}</label>
              <div className="relative">
                <select 
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="w-full bg-[#041b15] border border-white/10 text-pearl text-xs font-sans px-4 py-3.5 rounded-2xl appearance-none focus:outline-none focus:border-sunset/50 cursor-pointer pr-10"
                >
                  <option value="all">{t.catalog.filters.all}</option>
                  <option value="under-5k">{t.catalog.filters.under5k}</option>
                  <option value="5k-10k">{t.catalog.filters.between5kand10k}</option>
                  <option value="over-10k">{t.catalog.filters.over10k}</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sunset" size={14} />
              </div>
            </div>

            {/* Location filter */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-md">
              <div className="text-[10px] uppercase tracking-[0.34em] text-gray-400 mb-4">{t.catalog.filters.locTitle}</div>
              <label className="block text-[10px] font-sans text-gray-400 uppercase tracking-widest mb-2">{t.catalog.filters.locLabel}</label>
              <div className="relative">
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full bg-[#041b15] border border-white/10 text-pearl text-xs font-sans px-4 py-3.5 rounded-2xl appearance-none focus:outline-none focus:border-sunset/50 cursor-pointer pr-10"
                >
                  <option value="all">{t.catalog.filters.allLocs}</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sunset" size={14} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-sans text-gray-400 uppercase tracking-widest mb-3">{t.catalog.filters.tagsLabel}</label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`w-full rounded-[2rem] border px-5 py-3 text-[10px] font-sans uppercase tracking-[0.28em] transition duration-300 cursor-pointer ${
                    selectedTags.includes(tag)
                      ? "bg-sunset border-sunset text-jungle font-semibold shadow-[0_10px_40px_rgba(212,175,55,0.18)]"
                      : "bg-white/5 border-white/10 text-gray-300 hover:border-sunset/40 hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Property Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProperties.map((property) => (
              <motion.div
                key={property.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <PropertyCard
                  property={property}
                  onClick={setSelectedProperty}
                  wishlisted={wishlistedIds.includes(property.id)}
                  onToggleWishlist={toggleWishlist}
                  lang={lang}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredProperties.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400 font-sans text-xs md:text-sm">
              {t.catalog.empty}
            </div>
          )}
        </div>
      </section>

      {/* Floating Wishlist Button */}
      <button
        onClick={() => setIsWishlistOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center justify-center gap-2.5 h-14 px-6 rounded-full bg-sunset text-jungle font-sans font-bold uppercase tracking-widest shadow-[0_15px_40px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 transition-transform duration-300 group cursor-pointer"
      >
        <Heart size={18} className="fill-jungle group-hover:animate-pulse" />
        <span className="text-[10px] md:text-xs">{t.wishlist.floatingBtnLabel}</span>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-jungle px-1.5 text-[9px] font-bold text-sunset">
          {wishlistCount}
        </span>
      </button>

      {/* Wishlist Drawer Panel */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md h-full bg-[#021c15] border-l border-white/10 shadow-2xl flex flex-col z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-serif text-xl text-pearl flex items-center gap-2.5">
                  <Heart size={20} className="text-sunset fill-sunset" />
                  {t.wishlist.drawerTitle}
                </h3>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-2 rounded-full border border-white/15 text-white hover:bg-white hover:text-jungle transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable contents */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h4 className="text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-3">
                    {t.wishlist.intelItems} ({wishlistCount})
                  </h4>
                  {wishlistedProperties.length === 0 ? (
                    <div className="text-xs text-gray-400 py-10 text-center italic leading-relaxed">
                      {t.wishlist.emptyState}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {wishlistedProperties.map(property => (
                        <div 
                          key={property.id}
                          className="flex items-center gap-3.5 p-3 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition"
                        >
                          <div className="relative w-14 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                            <Image
                              src={getAssetPath(property.image)}
                              alt={property.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-serif text-sm text-pearl truncate leading-tight">{property.name}</h5>
                            <p className="text-[10px] text-sunset font-sans truncate mt-0.5">{property.location}</p>
                            <p className="text-xs text-white font-sans mt-1 font-medium">${property.price.toLocaleString("en-US")}</p>
                          </div>
                          <button
                            onClick={() => removeFromWishlist(property.id)}
                            className="p-2 rounded-xl border border-white/10 hover:border-rose-400 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 transition cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {wishlistCount > 0 && (
                  <div className="border-t border-white/10 pt-6 space-y-6">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-sunset font-semibold">{t.wishlist.funnelSubtitle}</span>
                      <h4 className="font-serif text-lg text-pearl mt-1 leading-snug">{t.wishlist.funnelTitle}</h4>
                      <p className="text-xs text-gray-300 leading-relaxed mt-2">{t.wishlist.funnelDesc}</p>
                    </div>

                    <form onSubmit={handleQualificationSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{t.wishlist.budgetLabel}</label>
                        <input
                          value={qualification.budget}
                          onChange={(e) => handleQualificationChange("budget", e.target.value)}
                          placeholder={t.wishlist.budgetPlaceholder}
                          className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3.5 text-xs text-pearl outline-none focus:border-sunset"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{t.wishlist.originLabel}</label>
                        <input
                          value={qualification.origin}
                          onChange={(e) => handleQualificationChange("origin", e.target.value)}
                          placeholder={t.wishlist.originPlaceholder}
                          className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3.5 text-xs text-pearl outline-none focus:border-sunset"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{t.wishlist.horizonLabel}</label>
                        <input
                          value={qualification.horizon}
                          onChange={(e) => handleQualificationChange("horizon", e.target.value)}
                          placeholder={t.wishlist.horizonPlaceholder}
                          className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3.5 text-xs text-pearl outline-none focus:border-sunset"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{t.wishlist.financingLabel}</label>
                        <input
                          value={qualification.financing}
                          onChange={(e) => handleQualificationChange("financing", e.target.value)}
                          placeholder={t.wishlist.financingPlaceholder}
                          className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3.5 text-xs text-pearl outline-none focus:border-sunset"
                        />
                      </div>

                      {formError && <div className="text-xs text-rose-300 font-sans">{formError}</div>}
                      {formSubmitted && <div className="text-xs text-emerald-300 font-sans">{t.wishlist.successMessage}</div>}

                      <button className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-sunset px-5 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-jungle shadow-md hover:bg-white transition-colors duration-250 cursor-pointer mt-2">
                        <Send size={13} /> {t.wishlist.submitButton}
                      </button>
                    </form>

                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-[11px] text-gray-300 space-y-3 shadow-inner">
                      <div className="uppercase tracking-[0.2em] text-sunset font-semibold mb-1">{t.wishlist.intelligenceTitle}</div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-gray-400">{t.wishlist.intelAccess}</span>
                        <span className="text-white font-medium text-right">{t.wishlist.intelAccessVal}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5">
                        <span className="text-gray-400">{t.wishlist.intelReadiness}</span>
                        <span className="text-white font-medium text-right">{t.wishlist.intelReadinessVal}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic 360° Detail View Modal (Bilingual & Responsive) */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col lg:flex-row"
          >
            {/* 360 Viewer Area */}
            <div className="relative w-full h-[55vh] lg:h-full lg:w-2/3 bg-black">
              <Three360Viewer panoramaUrl={selectedProperty.panorama} />
              
              {/* Virtual Badge */}
              <div className="absolute top-4 left-4 lg:top-8 lg:left-8 z-10">
                <div className="text-white/50 text-[10px] font-sans tracking-[0.2em] uppercase mb-1">{t.modal.virtualExp}</div>
                <div className="text-white text-xs font-sans tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sunset animate-pulse" /> {t.modal.live360}
                </div>
              </div>

              {/* Close Button on Mobile (placed top-right relative to 360 area) */}
              <button 
                onClick={() => setSelectedProperty(null)}
                className="lg:hidden absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Details Panel: slides in from right/bottom */}
            <motion.div 
              initial={{ opacity: 0, y: 60, x: 0 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="w-full lg:w-1/3 h-[45vh] lg:h-full bg-[#02221a] flex flex-col overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/10 shadow-2xl"
            >
              <div className="p-6 lg:p-12 flex-1">
                {/* Close Button on Desktop */}
                <button 
                  onClick={() => setSelectedProperty(null)}
                  className="hidden lg:flex mb-12 w-12 h-12 rounded-full border border-white/20 items-center justify-center text-white hover:bg-white hover:text-jungle transition-colors group cursor-pointer"
                >
                  <X className="group-hover:rotate-90 transition-transform duration-300" size={18} />
                </button>

                <div className="text-sunset text-[10px] md:text-xs font-sans uppercase tracking-[0.3em] mb-3">
                  {selectedProperty.location}
                </div>
                <h2 className="text-2xl lg:text-4xl font-serif mb-6 leading-tight text-pearl">
                  {selectedProperty.name}
                </h2>
                
                <div className="text-xl lg:text-2xl font-sans font-light mb-8 border-b border-white/10 pb-6 text-white">
                  ${selectedProperty.price.toLocaleString("en-US")}
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="text-[10px] font-sans uppercase tracking-widest text-gray-400 mb-2">{t.modal.archSoul}</h4>
                    <p className="font-sans text-xs md:text-sm text-gray-300 leading-relaxed font-light">
                      {selectedProperty.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div>
                      <div className="text-sunset text-[10px] mb-1 font-sans uppercase tracking-wider">{t.modal.interiorSpace}</div>
                      <div className="text-sm lg:text-base font-serif text-pearl">
                        {selectedProperty.sqft.toLocaleString("en-US")} sqft
                        <span className="block text-[10px] font-sans text-gray-400">
                          ({Math.round(selectedProperty.sqft * 0.092903).toLocaleString("en-US")} m²)
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sunset text-[10px] mb-1 font-sans uppercase tracking-wider">{t.modal.accommodations}</div>
                      <div className="text-sm lg:text-base font-serif text-pearl">{selectedProperty.suites} {t.modal.suitesSuffix}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedProperty.vibeTags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 border border-white/15 text-[9px] font-sans uppercase tracking-widest rounded-full text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sticky CTA */}
              <div className="p-6 bg-[#011a14] border-t border-white/10 mt-auto">
                <button className="w-full bg-sunset text-jungle py-4 font-sans uppercase tracking-[0.2em] text-xs font-bold flex items-center justify-center gap-3 hover:bg-white transition-colors duration-250 cursor-pointer">
                  {t.modal.bookTour} <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer id="contact" className="relative mt-16 border-t border-white/10 bg-black/35 py-12 px-6 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.36em] text-sunset mb-3 font-semibold">{t.footer.subtitle}</div>
            <p className="max-w-lg text-xs md:text-sm text-gray-300/80 leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {CONTACT_CHANNELS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex h-14 min-w-[150px] items-center gap-3.5 rounded-3xl border border-white/10 bg-white/5 px-4 text-[10px] md:text-xs uppercase tracking-[0.28em] text-white transition hover:border-sunset/40 hover:bg-sunset/10"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sunset transition group-hover:bg-sunset/15">
                  <Icon size={16} />
                </span>
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}


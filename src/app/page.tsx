"use client";

import Image from "next/image";
import { useState, useMemo, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROPERTIES, Property } from "@/constants/properties";
import PropertyCard from "@/components/PropertyCard";
import Three360Viewer from "@/components/Three360Viewer";
import { Heart, Send, X, ChevronRight, Camera, Share2, Mail, MessageCircle, Sparkles, Compass } from "lucide-react";

export default function Home() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
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

  const handleQualificationChange = (field: keyof typeof qualification, value: string) => {
    setQualification(prev => ({ ...prev, [field]: value }));
  };

  const handleQualificationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (wishlistCount === 0) {
      setFormError("Please add at least one property to your wishlist before submitting.");
      return;
    }
    if (!qualification.budget || !qualification.origin || !qualification.horizon || !qualification.financing) {
      setFormError("Complete all qualification fields to proceed.");
      return;
    }
    setFormError("");
    setFormSubmitted(true);
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

  const SERVICE_CARDS = [
    {
      title: "Tailored Portfolio Sourcing",
      description: "Exclusive access to off-market residences, private estates and bespoke luxury developments across Costa Rica.",
      icon: Sparkles,
    },
    {
      title: "Concierge Ownership Transition",
      description: "White-glove property management, residency facilitation, and lifestyle onboarding for affluent clients.",
      icon: Compass,
    },
    {
      title: "Lifestyle Matchmaking",
      description: "We align every property with your preferred wellness, entertainment, and investment narratives.",
      icon: Mail,
    },
  ];

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
    <main className="min-h-screen bg-jungle text-pearl selection:bg-sunset selection:text-jungle">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 px-8 py-6 flex flex-wrap items-center justify-between gap-4 bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm">
            <Image src="/images/imagine-logo.jpg" alt="Imagine logo" fill className="object-contain" />
          </div>
          <div>
            <div className="font-serif text-2xl font-semibold tracking-[0.18em] uppercase">Imagine</div>
            <div className="text-xs uppercase tracking-[0.4em] text-gray-300/80">Property Management & Real Estate</div>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-10 text-sm font-sans uppercase tracking-[0.32em] text-white/80">
          <a href="#collection" className="transition hover:text-sunset">Collection</a>
          <a href="#services" className="transition hover:text-sunset">Services</a>
          <a href="#contact" className="transition hover:text-sunset">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-8">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-cover.jpg"
            alt="Imagine luxury property cover"
            fill
            className="object-cover opacity-95"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-[#02140f]/20 to-transparent" />
          <div className="absolute left-1/2 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#d4af37]/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 grid gap-8 px-6 py-10 md:px-12 md:py-14 max-w-5xl rounded-[2.5rem] border border-white/10 bg-black/30 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <div className="mx-auto w-fit rounded-full border border-white/10 bg-white/5 p-1 shadow-inner shadow-black/30">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border border-sunset/40">
              <Image
                src="/images/bryan-headshot.jpg"
                alt="Bryan Viquez"
                fill
                className="object-cover grayscale hover:grayscale-0 transition duration-500"
                priority
              />
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-3 rounded-full border border-sunset/20 bg-[#e5c777]/10 px-5 py-2 text-xs uppercase tracking-[0.36em] text-sunset/90 shadow-sm shadow-sunset/10">
              Premium concierge for high-net-worth living
            </div>
            <h1 className="mt-8 text-5xl md:text-7xl xl:text-8xl font-serif uppercase tracking-[-0.04em] leading-tight text-pearl">
              Exclusivity redefined <span className="text-sunset">for Costa Rica</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-gray-300/90">
              We source exceptional residences, elevate ownership with dedicated concierge care, and make every acquisition feel like a private celebration.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
                <div className="text-xs uppercase tracking-[0.32em] text-gray-400">Investment</div>
                <div className="mt-3 text-4xl font-serif text-pearl">15+</div>
                <div className="mt-2 text-sm text-gray-300">Selected luxury properties live now.</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
                <div className="text-xs uppercase tracking-[0.32em] text-gray-400">Concierge</div>
                <div className="mt-3 text-4xl font-serif text-pearl">24/7</div>
                <div className="mt-2 text-sm text-gray-300">White-glove access from search to ownership.</div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
              <div className="text-xs uppercase tracking-[0.32em] text-gray-400">Signature</div>
              <div className="mt-3 text-4xl font-serif text-pearl">Bespoke</div>
              <div className="mt-2 text-sm text-gray-300">Tailored experiences aligned with your lifestyle.</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#collection" className="inline-flex items-center justify-center rounded-full bg-sunset px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-jungle shadow-[0_18px_45px_rgba(212,175,55,0.18)] transition hover:bg-white">
              View Collection
            </a>
            <a href="#services" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:border-sunset hover:text-sunset">
              Explore Services
            </a>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 rounded-[2rem] border border-sunset/20 bg-[#081f1a]/80 px-6 py-5 text-sm text-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="inline-flex items-center gap-2 uppercase tracking-[0.3em] text-sunset text-xs font-semibold">Wishlist</div>
            <div className="flex items-center gap-3 text-3xl font-serif text-pearl">
              <Heart size={28} className="text-sunset" />
              {wishlistCount} {wishlistCount === 1 ? "property" : "properties"}
            </div>
            <div className="text-center text-sm text-gray-300 max-w-2xl">
              Save the most compelling residences, then complete the qualification form to turn your shortlist into a priority lead.
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 md:px-12 max-w-[1600px] mx-auto">
        <div className="mb-12 flex flex-col items-center text-center gap-4">
          <div className="text-sm uppercase tracking-[0.36em] text-sunset">Signature Services</div>
          <h2 className="text-4xl md:text-6xl font-serif">Imagine Services</h2>
          <p className="max-w-3xl text-sm md:text-base text-gray-300/90 leading-relaxed">
            A discreet advisory approach with bespoke property sourcing, dedicated acquisition strategy, and luxury lifestyle management.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {SERVICE_CARDS.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-sunset/10 text-sunset shadow-sm shadow-sunset/10 mb-6">
                <Icon size={24} />
              </div>
              <h3 className="text-2xl font-serif mb-4">{title}</h3>
              <p className="text-sm leading-7 text-gray-300/90">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Property Engine (Catalog) */}
      <section id="collection" className="py-32 px-4 md:px-12 max-w-[1600px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col md:flex-row justify-between items-end gap-8"
        >
          <div>
            <h2 className="text-sm font-sans text-sunset uppercase tracking-[0.3em] mb-4">Portfolio</h2>
            <h3 className="text-4xl md:text-6xl font-serif">The Reserve</h3>
          </div>
          <p className="font-sans text-gray-400 max-w-md text-sm leading-relaxed">
            A meticulously curated selection of 15 properties across Papagayo, Santa Teresa, Manuel Antonio, Nosara, and Escalante.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="mb-16 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
              <div className="text-xs uppercase tracking-[0.34em] text-gray-400 mb-4">Investment Profile</div>
              <label className="block text-xs font-sans text-gray-400 uppercase tracking-widest mb-2">Price range</label>
              <select 
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full bg-[#041b15] border border-white/10 text-pearl text-sm font-sans px-4 py-3 rounded-2xl appearance-none focus:outline-none focus:border-sunset/50"
              >
                <option value="all">All</option>
                <option value="under-5">Under $5,000,000</option>
                <option value="5-10">$5,000,000 - $10,000,000</option>
                <option value="over-10">Over $10,000,000</option>
              </select>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
              <div className="text-xs uppercase tracking-[0.34em] text-gray-400 mb-4">Scale & Presence</div>
              <label className="block text-xs font-sans text-gray-400 uppercase tracking-widest mb-2">Size range</label>
              <select 
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="w-full bg-[#041b15] border border-white/10 text-pearl text-sm font-sans px-4 py-3 rounded-2xl appearance-none focus:outline-none focus:border-sunset/50"
              >
                <option value="all">All</option>
                <option value="under-5k">Under 5,000 sqft</option>
                <option value="5k-10k">5,000 - 10,000 sqft</option>
                <option value="over-10k">Over 10,000 sqft</option>
              </select>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
              <div className="text-xs uppercase tracking-[0.34em] text-gray-400 mb-4">Preferred Location</div>
              <label className="block text-xs font-sans text-gray-400 uppercase tracking-widest mb-2">Region</label>
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-[#041b15] border border-white/10 text-pearl text-sm font-sans px-4 py-3 rounded-2xl appearance-none focus:outline-none focus:border-sunset/50"
              >
                <option value="all">All regions</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans text-gray-400 uppercase tracking-widest mb-3">Curated experiences</label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`w-full rounded-[2rem] border px-5 py-3 text-xs font-sans uppercase tracking-[0.28em] transition duration-300 ${
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

        {/* Results Info */}
        <div className="mb-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2.5rem] border border-white/10 bg-[#041c16]/95 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-xs uppercase tracking-[0.36em] text-sunset">Wishlist funnel</div>
                <h3 className="mt-3 text-3xl font-serif text-pearl">Your shortlist, qualified.</h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-3xl bg-sunset/10 px-4 py-3 text-sm uppercase tracking-[0.26em] text-sunset">
                <Heart size={18} /> {wishlistCount}
              </div>
            </div>

            <p className="mb-8 text-sm leading-7 text-gray-300/90">
              Build a private shortlist, then submit the qualification form so Imagine can prioritize your lead and deliver a bespoke response.
            </p>

            <form onSubmit={handleQualificationSubmit} className="grid gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.32em] text-gray-400 mb-2">Estimated budget</label>
                <input
                  value={qualification.budget}
                  onChange={(e) => handleQualificationChange("budget", e.target.value)}
                  placeholder="e.g. $5M - $10M"
                  className="w-full rounded-3xl border border-white/10 bg-[#02160f] px-4 py-3 text-sm text-pearl outline-none focus:border-sunset"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.32em] text-gray-400 mb-2">Buyer origin</label>
                <input
                  value={qualification.origin}
                  onChange={(e) => handleQualificationChange("origin", e.target.value)}
                  placeholder="Local / North America / Europe"
                  className="w-full rounded-3xl border border-white/10 bg-[#02160f] px-4 py-3 text-sm text-pearl outline-none focus:border-sunset"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.32em] text-gray-400 mb-2">Purchase horizon</label>
                <input
                  value={qualification.horizon}
                  onChange={(e) => handleQualificationChange("horizon", e.target.value)}
                  placeholder="Immediate / 3-6 months / 6-12 months"
                  className="w-full rounded-3xl border border-white/10 bg-[#02160f] px-4 py-3 text-sm text-pearl outline-none focus:border-sunset"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.32em] text-gray-400 mb-2">Financing status</label>
                <input
                  value={qualification.financing}
                  onChange={(e) => handleQualificationChange("financing", e.target.value)}
                  placeholder="Cash / Pre-approved / Needs financing"
                  className="w-full rounded-3xl border border-white/10 bg-[#02160f] px-4 py-3 text-sm text-pearl outline-none focus:border-sunset"
                />
              </div>

              {formError && <div className="text-sm text-rose-300">{formError}</div>}
              {formSubmitted && <div className="text-sm text-emerald-300">Qualification submitted. Expect priority follow-up from Imagine.</div>}

              <button className="inline-flex items-center justify-center gap-2 rounded-3xl bg-sunset px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-jungle transition hover:bg-white">
                <Send size={18} /> Submit wishlist
              </button>
            </form>
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-[#03140f]/95 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.18)]">
            <div className="text-xs uppercase tracking-[0.36em] text-sunset mb-4">Lead intelligence</div>
            <div className="grid gap-4 text-sm text-gray-300">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Wishlist items</div>
                <div className="mt-3 text-3xl font-serif text-pearl">{wishlistCount}</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Qualified access</div>
                <div className="mt-3 text-lg text-white">Priority outreach for ready buyers</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Team readiness</div>
                <div className="mt-3 text-lg text-white">Every submission receives concierge review.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          <AnimatePresence>
            {filteredProperties.map((property, index) => (
              <div key={property.id} className="break-inside-avoid">
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <PropertyCard
                    property={property}
                    onClick={setSelectedProperty}
                    wishlisted={wishlistedIds.includes(property.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                </motion.div>
              </div>
            ))}
          </AnimatePresence>
          
          {filteredProperties.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400 font-sans">
              No properties match your exact, exclusive criteria. <br/> Please adjust your filters.
            </div>
          )}
        </div>
      </section>

      {/* Dynamic 360° Detail View Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex"
          >
            {/* 360 Viewer Area */}
            <div className="relative w-full lg:w-2/3 h-full bg-black">
              <Three360Viewer panoramaUrl={selectedProperty.panorama} />
              <div className="absolute top-8 left-8 z-10">
                <div className="text-white/50 text-xs font-sans tracking-[0.2em] uppercase mb-2">Virtual Experience</div>
                <div className="text-white text-sm font-sans tracking-widest uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sunset animate-pulse" /> Live 360°
                </div>
              </div>
            </div>

            {/* Details Sidebar */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="hidden lg:flex w-1/3 h-full bg-[#02221a] flex-col overflow-y-auto border-l border-white/10"
            >
              <div className="p-12 flex-1">
                <button 
                  onClick={() => setSelectedProperty(null)}
                  className="mb-12 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-jungle transition-colors group"
                >
                  <X className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="text-sunset text-xs font-sans uppercase tracking-[0.3em] mb-4">
                  {selectedProperty.location}
                </div>
                <h2 className="text-5xl font-serif mb-8 leading-tight">
                  {selectedProperty.name}
                </h2>
                
                <div className="text-3xl font-sans font-light mb-12 border-b border-white/10 pb-12">
                  ${selectedProperty.price.toLocaleString("en-US")}
                </div>

                <div className="space-y-8 mb-12">
                  <div>
                    <h4 className="text-sm font-sans uppercase tracking-widest text-gray-400 mb-2">The Architectural Soul</h4>
                    <p className="font-sans text-gray-300 leading-relaxed font-light">
                      {selectedProperty.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                    <div>
                      <div className="text-sunset text-sm mb-1 font-sans">Interior Space</div>
                      <div className="text-xl font-serif">
                        {selectedProperty.sqft.toLocaleString("en-US")} sqft
                        <span className="text-sm font-sans text-gray-400 ml-2">
                          ({Math.round(selectedProperty.sqft * 0.092903).toLocaleString("en-US")} m²)
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sunset text-sm mb-1 font-sans">Accommodations</div>
                      <div className="text-xl font-serif">{selectedProperty.suites} Master Suites</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-16">
                  {selectedProperty.vibeTags.map(tag => (
                    <span key={tag} className="px-4 py-2 border border-white/20 text-xs font-sans uppercase tracking-widest rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sticky CTA */}
              <div className="p-8 bg-[#011a14] border-t border-white/10 mt-auto">
                <button className="w-full bg-sunset text-jungle py-5 font-sans uppercase tracking-[0.2em] text-sm font-bold flex items-center justify-center gap-4 hover:bg-white transition-colors">
                  Book Private Tour <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>

            {/* Mobile Close Button */}
            <button 
              onClick={() => setSelectedProperty(null)}
              className="lg:hidden absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
            >
              <X />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <footer id="contact" className="relative mt-16 border-t border-white/10 bg-black/30 py-10 px-6 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.36em] text-sunset mb-3">Contact & access</div>
            <p className="max-w-lg text-sm text-gray-300/80 leading-relaxed">
              Connect directly with Imagine through private WhatsApp, curated social channels, or secure email. Every icon is a direct gateway to our exclusive service.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {CONTACT_CHANNELS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex h-14 min-w-[160px] items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 text-sm uppercase tracking-[0.28em] text-white transition hover:border-sunset/40 hover:bg-sunset/10"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sunset transition group-hover:bg-sunset/15">
                  <Icon size={18} />
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

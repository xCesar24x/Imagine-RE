"use client";

// Imagine Luxury Real Estate & Property Management SPA
import Image from "next/image";
import { useState, useMemo, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROPERTIES, Property } from "@/constants/properties";
import PropertyCard from "@/components/PropertyCard";
import Three360Viewer from "@/components/Three360Viewer";
import AirbnbCalculator from "@/components/AirbnbCalculator";
import ToursCalendar from "@/components/ToursCalendar";
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
  Globe,
  MapPin,
  Play,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { TRANSLATIONS } from "@/constants/translations";
import { getAssetPath } from "@/utils/paths";

export default function Home() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const t = TRANSLATIONS[lang];

  // Dynamic Exchange Rates State (with static fallbacks)
  const [rates, setRates] = useState({
    CRC: 520,
    EUR: 0.92,
    JPY: 158,
    USD: 1
  });

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setRates({
            CRC: data.rates.CRC || 520,
            EUR: data.rates.EUR || 0.92,
            JPY: data.rates.JPY || 158,
            USD: 1
          });
        }
      })
      .catch(err => console.error("Error fetching rates, using defaults:", err));
  }, []);

  // Routing State
  const [activeTab, setActiveTab] = useState<"catalog" | "management" | "tours">("catalog");

  const handleCollectionClick = () => {
    if (activeTab !== "catalog") {
      setActiveTab("catalog");
      setTimeout(() => {
        document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Property Details State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [modalTab, setModalTab] = useState<"360" | "map" | "video">("360");

  // Wishlist State
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Currency Converter State
  const [currencyMode, setCurrencyMode] = useState<"USD" | "CRC" | "EUR" | "JPY">("USD");

  // Step-by-Step Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [qualification, setQualification] = useState({
    budget: "",
    financing: "",
    horizon: "",
    motivation: "",
  });
  const [formError, setFormError] = useState("");
  const [leadScore, setLeadScore] = useState<"READY" | "POTENTIAL" | "CURIOUS" | null>(null);

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

  // Lead Scoring Logic
  const calculateLeadScore = () => {
    const horizon = qualification.horizon.toLowerCase();
    const financing = qualification.financing.toLowerCase();

    // Green conditions: Immediate purchase + ready funds (Cash or Pre-approved) + 3+ wishlist items
    const isImmediate = horizon.includes("immediate") || horizon.includes("inmediato") || horizon.includes("1-3") || horizon.includes("3");
    const isFundsReady = financing.includes("cash") || financing.includes("efectivo") || financing.includes("pre-approved") || financing.includes("pre-aprobado");
    
    if (isImmediate && isFundsReady && wishlistCount >= 3) {
      return "READY"; // Green
    }
    
    // Red conditions: horizon more than 6 months or undefined
    const isLongTerm = horizon.includes("6+") || horizon.includes("6") || horizon.includes("later") || horizon.includes("tarde");
    if (isLongTerm) {
      return "CURIOUS"; // Red
    }

    return "POTENTIAL"; // Yellow
  };

  const handleQualificationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (wishlistCount === 0) {
      setFormError(t.wishlist.validationEmptyWishlist);
      return;
    }
    if (!clientName || !clientEmail || !clientPhone || !qualification.budget || !qualification.financing || !qualification.horizon || !qualification.motivation) {
      setFormError(t.wishlist.validationMissingFields);
      return;
    }
    setFormError("");
    const score = calculateLeadScore();
    setLeadScore(score);

    // Reset flow after showing result
    setTimeout(() => {
      setLeadScore(null);
      setWishlistedIds([]);
      setIsWishlistOpen(false);
      setCurrentStep(1);
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setQualification({ budget: "", financing: "", horizon: "", motivation: "" });
    }, 6000);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && (!clientName || !clientEmail || !clientPhone)) {
      setFormError(lang === "es" ? "Por favor complete sus datos de contacto." : "Please fill out your contact details.");
      return;
    }
    if (currentStep === 2 && (!qualification.budget || !qualification.financing)) {
      setFormError(lang === "es" ? "Por favor complete su información financiera." : "Please fill out your financial information.");
      return;
    }
    if (currentStep === 3 && !qualification.horizon) {
      setFormError(lang === "es" ? "Por favor indique su horizonte de compra." : "Please indicate your purchase horizon.");
      return;
    }
    setFormError("");
    setCurrentStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setFormError("");
    setCurrentStep(prev => prev - 1);
  };

  // Filtering state
  const [priceFilter, setPriceFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [lifestyleFilter, setLifestyleFilter] = useState("all");
  
  const [selectedAmenityGroups, setSelectedAmenityGroups] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const AMENITY_GROUPS = useMemo(() => ({
    ocean: {
      label: lang === "es" ? "Playa y Vista al Mar" : "Beach & Ocean View",
      tags: ["Oceanfront", "Ocean Sounds", "Infinity View", "Panoramic", "Private Beach", "Marina Views", "Yacht Mooring", "Cliffside", "Surf Access"]
    },
    nature: {
      label: lang === "es" ? "Naturaleza y Selva" : "Nature & Jungle Vibe",
      tags: ["Eco-Luxury", "Jungle Brutalism", "High Altitude", "Sustainable", "Glass House", "Creek-Side", "Canopy Walkway", "Organic Farm"]
    },
    vip: {
      label: lang === "es" ? "Amenidades VIP (Helipuerto/Yates/Piscina)" : "VIP Amenities (Helipad/Yacht/Pool)",
      tags: ["Helipad Access", "Yacht Mooring", "Golf Cart Access", "Infinity Pool", "Wine Cellar", "Smart Home", "Art Collector"]
    },
    design: {
      label: lang === "es" ? "Privacidad y Diseño Premium" : "Privacy & Premium Design",
      tags: ["Ultra-Luxury", "Minimalist", "Intimate", "Family Estate", "Industrial Chic", "Exclusive"]
    }
  }), [lang]);

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
      // Price Filter
      if (priceFilter === "under-5" && p.price >= 5000000) return false;
      if (priceFilter === "5-10" && (p.price < 5000000 || p.price > 10000000)) return false;
      if (priceFilter === "over-10" && p.price <= 10000000) return false;

      // Size Filter
      if (sizeFilter === "under-5k" && p.sqft >= 5000) return false;
      if (sizeFilter === "5k-10k" && (p.sqft < 5000 || p.sqft > 10000)) return false;
      if (sizeFilter === "over-10k" && p.sqft <= 10000) return false;

      // Location Filter
      if (locationFilter !== "all" && p.location !== locationFilter) return false;

      // Type Filter
      if (typeFilter !== "all" && p.type !== typeFilter) return false;

      // Lifestyle Filter
      if (lifestyleFilter !== "all" && p.lifestyle !== lifestyleFilter) return false;

      // Amenity Groups Filter
      if (selectedAmenityGroups.length > 0) {
        const matchesAllGroups = selectedAmenityGroups.every(groupKey => {
          const group = AMENITY_GROUPS[groupKey as keyof typeof AMENITY_GROUPS];
          return p.vibeTags.some(tag => group.tags.includes(tag));
        });
        if (!matchesAllGroups) return false;
      }

      return true;
    });
  }, [priceFilter, sizeFilter, locationFilter, typeFilter, lifestyleFilter, selectedAmenityGroups, AMENITY_GROUPS]);

  const toggleAmenityGroup = (groupKey: string) => {
    setSelectedAmenityGroups(prev =>
      prev.includes(groupKey) ? prev.filter(g => g !== groupKey) : [...prev, groupKey]
    );
  };

  return (
    <main className="min-h-screen bg-[#020f0a] text-pearl selection:bg-sunset selection:text-jungle relative">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-45 px-6 md:px-12 py-5 flex items-center justify-between bg-black/45 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setActiveTab("catalog"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <div className="relative w-12 h-12 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm">
            <Image src={getAssetPath("/images/imagine-logo.jpg")} alt="Imagine logo" fill className="object-contain" />
          </div>
          <div>
            <div className="font-serif text-2xl font-semibold tracking-[0.18em] uppercase">Imagine</div>
            <div className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gray-300/80">Real Estate & Property Management</div>
          </div>
        </div>

        {/* Desktop Routing Links */}
        <div className="hidden xl:flex items-center gap-6 text-xs font-sans uppercase tracking-[0.25em] text-white/80">
          <button 
            onClick={handleCollectionClick}
            className={`transition px-4 py-2 border rounded-md cursor-pointer ${activeTab === "catalog" ? "border-sunset text-sunset font-bold shadow-[0_0_15px_rgba(229,199,119,0.15)]" : "border-transparent hover:text-sunset"}`}
          >
            {t.nav.collection}
          </button>
          <button 
            onClick={() => { setActiveTab("management"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`transition px-4 py-2 border rounded-md cursor-pointer ${activeTab === "management" ? "border-sunset text-sunset font-bold shadow-[0_0_15px_rgba(229,199,119,0.15)]" : "border-transparent hover:text-sunset"}`}
          >
            {t.nav.management}
          </button>
          <button 
            onClick={() => { setActiveTab("tours"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`transition px-4 py-2 border rounded-md cursor-pointer ${activeTab === "tours" ? "border-sunset text-sunset font-bold shadow-[0_0_15px_rgba(229,199,119,0.15)]" : "border-transparent hover:text-sunset"}`}
          >
            {t.nav.tours}
          </button>
          <button 
            onClick={() => { document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            className="transition px-4 py-2 border border-transparent rounded-md cursor-pointer hover:text-sunset"
          >
            {t.nav.contact}
          </button>
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
              className="fixed inset-x-0 top-[88px] z-30 xl:hidden p-6 bg-[#041c16] border-b border-white/10 flex flex-col gap-4 text-center font-sans uppercase tracking-[0.25em] text-xs shadow-2xl animate-none"
            >
              <button 
                onClick={() => { setIsMobileMenuOpen(false); handleCollectionClick(); }}
                className={`py-3 transition border rounded-md cursor-pointer text-pearl/80 ${activeTab === "catalog" ? "border-sunset text-sunset font-bold shadow-[0_0_15px_rgba(229,199,119,0.15)]" : "border-transparent hover:text-sunset"}`}
              >
                {t.nav.collection}
              </button>
              <button 
                onClick={() => { setActiveTab("management"); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`py-3 transition border rounded-md cursor-pointer text-pearl/80 ${activeTab === "management" ? "border-sunset text-sunset font-bold shadow-[0_0_15px_rgba(229,199,119,0.15)]" : "border-transparent hover:text-sunset"}`}
              >
                {t.nav.management}
              </button>
              <button 
                onClick={() => { setActiveTab("tours"); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`py-3 transition border rounded-md cursor-pointer text-pearl/80 ${activeTab === "tours" ? "border-sunset text-sunset font-bold shadow-[0_0_15px_rgba(229,199,119,0.15)]" : "border-transparent hover:text-sunset"}`}
              >
                {t.nav.tours}
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setTimeout(() => { document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }, 150); }}
                className="py-3 transition border border-transparent rounded-md cursor-pointer text-pearl/80 hover:text-sunset"
              >
                {t.nav.contact}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Views Routing */}
      {activeTab === "catalog" && (
        <>
          {/* Hero Section with Looping Drone Video Background */}
          <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden py-24 mt-[88px]">
            <div className="absolute inset-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-60"
                poster={getAssetPath("/images/hero-cover.jpg")}
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-mysterious-misty-forest-from-above-4993-large.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#020f0a] via-[#02140f]/50 to-transparent" />
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

            {/* Advanced Filters */}
            <div className="mb-16 space-y-6">
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
                {/* Price range */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-sunset mb-2 font-semibold">{t.catalog.filters.priceTitle}</div>
                  <label className="block text-[9px] font-sans text-gray-400 uppercase tracking-widest mb-1.5">{t.catalog.filters.priceLabel}</label>
                  <div className="relative">
                    <select 
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className="w-full bg-[#041b15] border border-white/10 text-pearl text-xs font-sans px-3 py-2.5 rounded-xl appearance-none focus:outline-none focus:border-sunset/50 cursor-pointer pr-8 animate-none"
                    >
                      <option value="all">{t.catalog.filters.all}</option>
                      <option value="under-5">{t.catalog.filters.under5}</option>
                      <option value="5-10">{t.catalog.filters.between5and10}</option>
                      <option value="over-10">{t.catalog.filters.over10}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-sunset" size={13} />
                  </div>
                </div>

                {/* Property Type */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-sunset mb-2 font-semibold">{t.catalog.filters.typeLabel}</div>
                  <label className="block text-[9px] font-sans text-gray-400 uppercase tracking-widest mb-1.5">{lang === "es" ? "Filtrar por tipo" : "Filter by type"}</label>
                  <div className="relative">
                    <select 
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full bg-[#041b15] border border-white/10 text-pearl text-xs font-sans px-3 py-2.5 rounded-xl appearance-none focus:outline-none focus:border-sunset/50 cursor-pointer pr-8 animate-none"
                    >
                      <option value="all">{t.catalog.filters.allTypes}</option>
                      <option value="Casa">{lang === "es" ? "Casa" : "Home"}</option>
                      <option value="Cabaña">{lang === "es" ? "Cabaña" : "Cabin"}</option>
                      <option value="Quinta">{lang === "es" ? "Quinta" : "Estate"}</option>
                      <option value="Lote">{lang === "es" ? "Lote" : "Lot"}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-sunset" size={13} />
                  </div>
                </div>

                {/* Region */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-sunset mb-2 font-semibold">{t.catalog.filters.locTitle}</div>
                  <label className="block text-[9px] font-sans text-gray-400 uppercase tracking-widest mb-1.5">{t.catalog.filters.locLabel}</label>
                  <div className="relative">
                    <select 
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full bg-[#041b15] border border-white/10 text-pearl text-xs font-sans px-3 py-2.5 rounded-xl appearance-none focus:outline-none focus:border-sunset/50 cursor-pointer pr-8 animate-none"
                    >
                      <option value="all">{t.catalog.filters.allLocs}</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-sunset" size={13} />
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-sunset mb-2 font-semibold">{t.catalog.filters.lifestyleLabel}</div>
                  <label className="block text-[9px] font-sans text-gray-400 uppercase tracking-widest mb-1.5">{lang === "es" ? "Ambiente" : "Vibe"}</label>
                  <div className="relative">
                    <select 
                      value={lifestyleFilter}
                      onChange={(e) => setLifestyleFilter(e.target.value)}
                      className="w-full bg-[#041b15] border border-white/10 text-pearl text-xs font-sans px-3 py-2.5 rounded-xl appearance-none focus:outline-none focus:border-sunset/50 cursor-pointer pr-8 animate-none"
                    >
                      <option value="all">{t.catalog.filters.allLifestyles}</option>
                      <option value="Naturaleza">{lang === "es" ? "Naturaleza" : "Nature"}</option>
                      <option value="Ciudad">{lang === "es" ? "Ciudad" : "City"}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-sunset" size={13} />
                  </div>
                </div>

                {/* Currency Mode */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-sunset mb-2 font-semibold">{t.catalog.filters.currencyLabel}</div>
                  <label className="block text-[9px] font-sans text-gray-400 uppercase tracking-widest mb-1.5">{lang === "es" ? "Ver precios" : "Show price"}</label>
                  <div className="relative">
                    <select 
                      value={currencyMode}
                      onChange={(e) => setCurrencyMode(e.target.value as "USD" | "CRC" | "EUR" | "JPY")}
                      className="w-full bg-[#041b15] border border-white/10 text-pearl text-xs font-sans px-3 py-2.5 rounded-xl appearance-none focus:outline-none focus:border-sunset/50 cursor-pointer pr-8 animate-none"
                    >
                      <option value="USD">{t.catalog.filters.showUSD}</option>
                      <option value="CRC">{t.catalog.filters.showCRC}</option>
                      <option value="EUR">{t.catalog.filters.showEUR}</option>
                      <option value="JPY">{t.catalog.filters.showJPY}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-sunset" size={13} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters(prev => !prev)}
                  className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.25em] text-sunset font-semibold hover:text-white transition cursor-pointer"
                >
                  <span>{showAdvancedFilters ? "−" : "+"}</span>
                  <span>{lang === "es" ? "Filtrar por Amenidades y Estilo (Opcional)" : "Filter by Amenities & Style (Optional)"}</span>
                </button>

                <AnimatePresence>
                  {showAdvancedFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-6"
                    >
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {Object.entries(AMENITY_GROUPS).map(([key, group]) => {
                          const isSelected = selectedAmenityGroups.includes(key);
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => toggleAmenityGroup(key)}
                              className={`rounded-[2rem] border px-6 py-4 text-[10px] font-sans uppercase tracking-[0.2em] transition duration-250 cursor-pointer text-center leading-relaxed h-full flex items-center justify-center ${
                                isSelected
                                  ? "bg-sunset border-sunset text-jungle font-bold shadow-[0_8px_30px_rgba(212,175,55,0.2)]"
                                  : "bg-white/5 border-white/10 text-gray-300 hover:border-sunset/40 hover:text-white"
                              }`}
                            >
                              {group.label}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                      currencyMode={currencyMode}
                      rates={rates}
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
        </>
      )}

      {activeTab === "management" && (
        <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto mt-[88px] min-h-[70vh]">
          <div className="mb-16 flex flex-col items-center text-center gap-4">
            <div className="text-xs uppercase tracking-[0.36em] text-sunset font-semibold">{t.propertyManagement.subtitle}</div>
            <h2 className="text-3xl md:text-5xl font-serif">{t.propertyManagement.title}</h2>
            <p className="max-w-3xl text-sm md:text-base text-gray-300/90 leading-relaxed">
              {t.propertyManagement.description}
            </p>
          </div>
          <AirbnbCalculator lang={lang} />
        </section>
      )}

      {activeTab === "tours" && (
        <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto mt-[88px] min-h-[70vh]">
          <div className="mb-16 flex flex-col items-center text-center gap-4">
            <div className="text-xs uppercase tracking-[0.36em] text-sunset font-semibold">{t.discoveryTours.subtitle}</div>
            <h2 className="text-3xl md:text-5xl font-serif">{t.discoveryTours.title}</h2>
            <p className="max-w-3xl text-sm md:text-base text-gray-300/90 leading-relaxed">
              {t.discoveryTours.description}
            </p>
          </div>
          <ToursCalendar lang={lang} />
        </section>
      )}

      {/* Floating Wishlist Toggle Button */}
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

      {/* Step-by-Step Wishlist Drawer Panel */}
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

              {/* Scrollable Contents */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* List of saved properties */}
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
                            <p className="text-xs text-white font-sans mt-1 font-medium">${property.price.toLocaleString("en-US")} USD</p>
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

                {/* Multi-step Qualification Form Funnel */}
                {wishlistCount > 0 && !leadScore && (
                  <div className="border-t border-white/10 pt-6">
                    <div className="mb-6 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-sunset font-semibold">
                          {t.wishlist.steps.step} {currentStep} / 4
                        </span>
                        <h4 className="font-serif text-lg text-pearl mt-0.5">
                          {currentStep === 1 && t.wishlist.steps.step1}
                          {currentStep === 2 && t.wishlist.steps.step2}
                          {currentStep === 3 && t.wishlist.steps.step3}
                          {currentStep === 4 && t.wishlist.steps.step4}
                        </h4>
                      </div>
                      {/* Step Indicator dots */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(s => (
                          <div 
                            key={s} 
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${s === currentStep ? "bg-sunset w-3" : "bg-white/15"}`}
                          />
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleQualificationSubmit} className="space-y-4">
                      {/* Step 1: Identification */}
                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{t.wishlist.steps.nameLabel}</label>
                            <input
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder="e.g. Alexis Carter"
                              className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3.5 text-xs text-pearl outline-none focus:border-sunset"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{t.wishlist.steps.emailLabel}</label>
                            <input
                              type="email"
                              value={clientEmail}
                              onChange={(e) => setClientEmail(e.target.value)}
                              placeholder="alexis@gmail.com"
                              className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3.5 text-xs text-pearl outline-none focus:border-sunset"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{t.wishlist.steps.phoneLabel}</label>
                            <input
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              placeholder="+1 (555) 019-2834"
                              className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3.5 text-xs text-pearl outline-none focus:border-sunset"
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 2: Financial Profile */}
                      {currentStep === 2 && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{t.wishlist.steps.budgetLabel}</label>
                            <div className="relative">
                              <select 
                                value={qualification.budget}
                                onChange={(e) => handleQualificationChange("budget", e.target.value)}
                                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs font-sans px-4 py-3.5 rounded-2xl appearance-none focus:outline-none focus:border-sunset cursor-pointer pr-10 animate-none"
                              >
                                <option value="">{lang === "es" ? "-- Seleccionar rango --" : "-- Select budget --"}</option>
                                <option value="Under 5M">{lang === "es" ? "Menos de $5,000,000" : "Under $5,000,000"}</option>
                                <option value="5M - 10M">$5,000,000 - $10,000,000</option>
                                <option value="Over 10M">{lang === "es" ? "Más de $10,000,000" : "Over $10,000,000"}</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sunset" size={14} />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{t.wishlist.steps.financingLabel}</label>
                            <div className="relative">
                              <select 
                                value={qualification.financing}
                                onChange={(e) => handleQualificationChange("financing", e.target.value)}
                                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs font-sans px-4 py-3.5 rounded-2xl appearance-none focus:outline-none focus:border-sunset cursor-pointer pr-10 animate-none"
                              >
                                <option value="">{lang === "es" ? "-- Seleccionar estatus --" : "-- Select financing --"}</option>
                                <option value="Cash">{lang === "es" ? "Efectivo / Fondos Propios" : "Cash / Liquidity"}</option>
                                <option value="Pre-approved">{lang === "es" ? "Préstamo Pre-aprobado" : "Pre-approved Loan"}</option>
                                <option value="Needs financing">{lang === "es" ? "Buscando Financiamiento" : "Needs Financing"}</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sunset" size={14} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Purchase Horizon */}
                      {currentStep === 3 && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{t.wishlist.steps.horizonLabel}</label>
                            <div className="relative">
                              <select 
                                value={qualification.horizon}
                                onChange={(e) => handleQualificationChange("horizon", e.target.value)}
                                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs font-sans px-4 py-3.5 rounded-2xl appearance-none focus:outline-none focus:border-sunset cursor-pointer pr-10 animate-none"
                              >
                                <option value="">{lang === "es" ? "-- Seleccionar horizonte --" : "-- Select horizon --"}</option>
                                <option value="Immediate">{lang === "es" ? "Inmediato" : "Immediate / Ready"}</option>
                                <option value="1-3 months">{lang === "es" ? "1 a 3 meses" : "1 to 3 months"}</option>
                                <option value="6+ months">{lang === "es" ? "Más de 6 meses" : "6+ months"}</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sunset" size={14} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 4: Motivation */}
                      {currentStep === 4 && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{t.wishlist.steps.motivationLabel}</label>
                            <div className="relative">
                              <select 
                                value={qualification.motivation}
                                onChange={(e) => handleQualificationChange("motivation", e.target.value)}
                                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs font-sans px-4 py-3.5 rounded-2xl appearance-none focus:outline-none focus:border-sunset cursor-pointer pr-10 animate-none"
                              >
                                <option value="">{lang === "es" ? "-- Seleccionar motivación --" : "-- Select motivation --"}</option>
                                <option value="Relocation">{t.wishlist.steps.motivation1}</option>
                                <option value="Vacation">{t.wishlist.steps.motivation2}</option>
                                <option value="Airbnb">{t.wishlist.steps.motivation3}</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sunset" size={14} />
                            </div>
                          </div>
                        </div>
                      )}

                      {formError && <div className="text-xs text-rose-300 font-sans mt-2">{formError}</div>}

                      {/* Controls Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-white/5">
                        {currentStep > 1 && (
                          <button
                            type="button"
                            onClick={handleBackStep}
                            className="flex-1 py-3.5 rounded-2xl border border-white/10 hover:border-sunset text-xs uppercase tracking-widest text-pearl font-semibold flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                          >
                            <ArrowLeft size={13} /> {t.wishlist.steps.back}
                          </button>
                        )}
                        {currentStep < 4 ? (
                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="flex-1 py-3.5 rounded-2xl bg-white text-jungle hover:bg-sunset text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {t.wishlist.steps.next} <ArrowRight size={13} />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="flex-1 py-3.5 rounded-2xl bg-sunset text-jungle hover:bg-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-sunset/10"
                          >
                            <Send size={13} /> {t.wishlist.steps.submit}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                )}

                {/* Lead Scoring Output Overlay */}
                {leadScore && (
                  <div className="border-t border-white/10 pt-6 text-center space-y-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner border border-white/10 bg-white/5">
                      {leadScore === "READY" && "🟢"}
                      {leadScore === "POTENTIAL" && "🟡"}
                      {leadScore === "CURIOUS" && "🔴"}
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-sunset font-semibold">{t.wishlist.steps.scoreLabel}</span>
                      <h4 className="font-serif text-xl text-pearl mt-1">
                        {leadScore === "READY" && t.wishlist.steps.scoreReady}
                        {leadScore === "POTENTIAL" && t.wishlist.steps.scorePotential}
                        {leadScore === "CURIOUS" && t.wishlist.steps.scoreCurious}
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed mt-3 max-w-sm mx-auto font-light">
                        {leadScore === "READY" && t.wishlist.steps.scoreReadyDesc}
                        {leadScore === "POTENTIAL" && t.wishlist.steps.scorePotentialDesc}
                        {leadScore === "CURIOUS" && t.wishlist.steps.scoreCuriousDesc}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-white/5 bg-white/5 text-xs text-gray-400 font-light max-w-sm mx-auto">
                      {lang === "es" 
                        ? "¡Calificación completada! Redirigiendo y procesando solicitud..."
                        : "Qualification complete! Processing submission and logging prioritization score..."}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic 360° Detail View Modal (Bilingual & Responsive Upgrades) */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col lg:flex-row bg-black/90 backdrop-blur-md"
          >
            {/* 360/Map/Video Viewer Area */}
            <div className="relative w-full h-[50vh] lg:h-full lg:w-2/3 bg-black">
              {modalTab === "360" && <Three360Viewer panoramaUrl={selectedProperty.panorama} />}
              
              {modalTab === "map" && (
                <div className="w-full h-full bg-[#02120e] flex flex-col items-center justify-center p-8 text-center text-pearl relative overflow-hidden">
                  {/* Subtle Grid backdrop */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
                  <div className="relative z-10 space-y-4 max-w-md">
                    <div className="mx-auto w-16 h-16 rounded-full border border-sunset/20 bg-sunset/5 flex items-center justify-center text-sunset">
                      <MapPin size={28} className="animate-bounce" />
                    </div>
                    <h4 className="font-serif text-lg text-pearl">{t.modal.mapTitle}</h4>
                    <p className="text-xs text-sunset font-sans font-semibold tracking-wider bg-sunset/10 py-1.5 px-3 rounded-full inline-block">
                      {selectedProperty.approxLocation}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      {lang === "es"
                        ? "Por motivos de seguridad, privacidad y exclusividad de nuestros propietarios, la coordenada exacta se desbloquea tras la calificación telefónica con el concierge."
                        : "For security, privacy, and exclusivity of our property owners, exact coordinates are unlocked following direct qualification with our concierge team."}
                    </p>
                  </div>
                  {/* Circular radial glow */}
                  <div className="absolute w-[300px] h-[300px] rounded-full bg-sunset/5 blur-3xl" />
                </div>
              )}

              {modalTab === "video" && (
                <div className="w-full h-full bg-black flex flex-col items-center justify-center relative">
                  {/* Mock Premium Embedded Drone Video Player */}
                  <div className="absolute inset-0">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-60"
                      poster={getAssetPath(selectedProperty.image)}
                    >
                      <source src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-running-under-the-trees-4987-large.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  </div>
                  
                  <div className="relative z-10 text-center space-y-4 max-w-md px-6">
                    <div className="mx-auto w-14 h-14 rounded-full border border-white/20 bg-black/60 flex items-center justify-center text-sunset shadow-lg hover:scale-105 transition cursor-pointer">
                      <Play size={20} className="fill-sunset ml-1" />
                    </div>
                    <h4 className="font-serif text-base text-pearl">{t.modal.videoTitle}</h4>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-sans block bg-white/5 py-1 px-3 rounded-full border border-white/10 inline-block">
                      Cinematic 4K Drone Tour (Preview)
                    </span>
                  </div>
                </div>
              )}
              
              {/* Media Tab Selector buttons */}
              <div className="absolute top-4 left-4 lg:top-8 lg:left-8 z-10 flex gap-2">
                <button
                  onClick={() => setModalTab("360")}
                  className={`px-3 py-1.5 rounded-full border text-[9px] font-sans tracking-widest uppercase transition cursor-pointer ${
                    modalTab === "360"
                      ? "bg-sunset border-sunset text-jungle font-bold"
                      : "bg-black/60 border-white/15 text-pearl hover:bg-black/80"
                  }`}
                >
                  360° VR
                </button>
                <button
                  onClick={() => setModalTab("map")}
                  className={`px-3 py-1.5 rounded-full border text-[9px] font-sans tracking-widest uppercase transition cursor-pointer ${
                    modalTab === "map"
                      ? "bg-sunset border-sunset text-jungle font-bold"
                      : "bg-black/60 border-white/15 text-pearl hover:bg-black/80"
                  }`}
                >
                  {lang === "es" ? "Mapa Zona" : "Map Boundary"}
                </button>
                <button
                  onClick={() => setModalTab("video")}
                  className={`px-3 py-1.5 rounded-full border text-[9px] font-sans tracking-widest uppercase transition cursor-pointer ${
                    modalTab === "video"
                      ? "bg-sunset border-sunset text-jungle font-bold"
                      : "bg-black/60 border-white/15 text-pearl hover:bg-black/80"
                  }`}
                >
                  {lang === "es" ? "Video Drone" : "Drone Video"}
                </button>
              </div>

              {/* Close Button on Mobile */}
              <button 
                onClick={() => { setSelectedProperty(null); setModalTab("360"); }}
                className="lg:hidden absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Details Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 60, x: 0 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="w-full lg:w-1/3 h-[50vh] lg:h-full bg-[#02221a] flex flex-col overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/10 shadow-2xl"
            >
              <div className="p-6 lg:p-12 flex-1">
                {/* Close Button on Desktop */}
                <button 
                  onClick={() => { setSelectedProperty(null); setModalTab("360"); }}
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
                
                <div className="text-xl lg:text-2xl font-sans font-light mb-8 border-b border-white/10 pb-6 text-white flex justify-between items-baseline">
                  <span>
                    {currencyMode === "CRC" && `₡${(selectedProperty.price * rates.CRC).toLocaleString(lang === "es" ? "es-CR" : "en-US")}`}
                    {currencyMode === "EUR" && `€${(selectedProperty.price * rates.EUR).toLocaleString(lang === "es" ? "es-ES" : "en-US", { maximumFractionDigits: 0 })}`}
                    {currencyMode === "JPY" && `¥${(selectedProperty.price * rates.JPY).toLocaleString(lang === "es" ? "ja-JP" : "en-US", { maximumFractionDigits: 0 })}`}
                    {currencyMode === "USD" && `$${selectedProperty.price.toLocaleString("en-US")}`}
                  </span>
                  {currencyMode !== "USD" && (
                    <span className="text-xs text-gray-400 font-normal">(${(selectedProperty.price).toLocaleString("en-US")} USD)</span>
                  )}
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
                        {selectedProperty.sqft.toLocaleString("en-US")} {t.card.sqft}
                        <span className="block text-[10px] font-sans text-gray-400 font-normal mt-0.5">
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

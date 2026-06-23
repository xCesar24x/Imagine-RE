"use client";

// Imagine Luxury Real Estate & Property Management SPA
import Image from "next/image";
import { useState, useMemo, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROPERTIES, Property, PROVINCE_REGIONS } from "@/constants/properties";
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
  ArrowLeft,
  Shield,
  Home as HomeIcon,
  Building2
} from "lucide-react";
import { TRANSLATIONS } from "@/constants/translations";
import { getAssetPath } from "@/utils/paths";
import AdminDashboard from "@/components/AdminDashboard";
import { formatCognitivePrice } from "@/utils/price";

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

  // Dynamic Properties CRUD state
  const [properties, setProperties] = useState<Property[]>(PROPERTIES);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const storedProps = localStorage.getItem("imagine_properties");
    if (storedProps) {
      setProperties(JSON.parse(storedProps));
    }
  }, []);

  const handleAddProperty = (newProp: Property) => {
    const updated = [newProp, ...properties];
    setProperties(updated);
    localStorage.setItem("imagine_properties", JSON.stringify(updated));
  };

  const handleUpdateProperty = (updatedProp: Property) => {
    const updated = properties.map(p => p.id === updatedProp.id ? updatedProp : p);
    setProperties(updated);
    localStorage.setItem("imagine_properties", JSON.stringify(updated));
  };

  const handleDeleteProperty = (id: string) => {
    const updated = properties.filter(p => p.id !== id);
    setProperties(updated);
    localStorage.setItem("imagine_properties", JSON.stringify(updated));
  };

  // Routing State
  const [activeTab, setActiveTab] = useState<"catalog" | "management" | "tours">("catalog");
  const [activeSegment, setActiveSegment] = useState<"Luxury" | "Standard" | "Commercial">("Luxury");

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

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [modalTab, setModalTab] = useState<"gallery" | "360" | "map" | "video">("gallery");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (selectedProperty) {
      setCurrentImageIndex(0);
      setModalTab("gallery");
    }
  }, [selectedProperty]);

  // Wishlist State
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Currency Converter State
  const [currencyMode, setCurrencyMode] = useState<"USD" | "CRC" | "EUR" | "JPY">("USD");

  const catalogTheme = useMemo(() => {
    switch (activeSegment) {
      case "Standard":
        return {
          bg: "bg-[#031c16]",
          textAccent: "text-cyan-400",
          borderAccent: "border-cyan-500/20",
          selectBg: "bg-[#04241d]"
        };
      case "Commercial":
        return {
          bg: "bg-[#090f1e]",
          textAccent: "text-blue-400",
          borderAccent: "border-blue-500/20",
          selectBg: "bg-[#0c152b]"
        };
      case "Luxury":
      default:
        return {
          bg: "bg-[#020f0a]",
          textAccent: "text-sunset",
          borderAccent: "border-white/10",
          selectBg: "bg-[#041b15]"
        };
    }
  }, [activeSegment]);

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
    requestedService: "",
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
    return properties.filter(p => wishlistedIds.includes(p.id));
  }, [wishlistedIds, properties]);

  const galleryImages = useMemo(() => {
    if (selectedProperty?.gallery && selectedProperty.gallery.length > 0) {
      return selectedProperty.gallery;
    }
    // Fallback images to guarantee a high-res gallery on every property
    return selectedProperty 
      ? [
          selectedProperty.image,
          "/images/ocean.png",
          "/images/minimalist.png"
        ]
      : [];
  }, [selectedProperty]);

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
    if (!clientName || !clientEmail || !clientPhone || !qualification.budget || !qualification.financing || !qualification.horizon || !qualification.motivation || !qualification.requestedService) {
      setFormError(t.wishlist.validationMissingFields);
      return;
    }
    setFormError("");
    const score = calculateLeadScore();
    setLeadScore(score);

    // Save lead to local storage for Admin Dashboard CRM
    const newLead = {
      id: `lead-${Date.now()}`,
      name: clientName.trim(),
      email: clientEmail.trim().toLowerCase(),
      phone: clientPhone.trim(),
      budgetRange: qualification.budget,
      financing: qualification.financing,
      horizon: qualification.horizon,
      motivation: qualification.motivation,
      requestedService: qualification.requestedService,
      wishlistPropertyIds: [...wishlistedIds],
      status: "Lead Nuevo" as const,
      notes: [`Lead qualified from website wishlist. Priority Score: ${score}`],
      lastInteractionDate: new Date().toISOString()
    };

    const storedLeads = localStorage.getItem("imagine_leads");
    let currentLeads = [];
    if (storedLeads) {
      try {
        currentLeads = JSON.parse(storedLeads);
      } catch (e) {
        console.error("Error loading leads from storage:", e);
      }
    }
    currentLeads.push(newLead);
    localStorage.setItem("imagine_leads", JSON.stringify(currentLeads));
  };

  // Build personalized WhatsApp message based on service type
  const buildWhatsAppMessage = () => {
    const WHATSAPP_NUMBER = "50688621215";
    const wishlistNames = wishlistedIds
      .map(id => PROPERTIES.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    let message = "";
    const service = qualification.requestedService;

    if (service === "information") {
      message = lang === "es"
        ? `Hola Bryan, soy ${clientName}. Estoy interesado/a en recibir información detallada sobre la(s) siguiente(s) propiedad(es) de mi wishlist: ${wishlistNames}. Mi contacto es: ${clientEmail} / ${clientPhone}. Quedo atento/a a su respuesta. ¡Muchas gracias!`
        : `Hi Bryan, I'm ${clientName}. I'm interested in receiving detailed information about the following propert${wishlistNames.includes(",") ? "ies" : "y"} from my wishlist: ${wishlistNames}. You can reach me at: ${clientEmail} / ${clientPhone}. Looking forward to hearing from you!`;
    } else if (service === "visit") {
      message = lang === "es"
        ? `Hola Bryan, soy ${clientName}. Me gustaría coordinar una visita presencial a la(s) siguiente(s) propiedad(es): ${wishlistNames}. Mi disponibilidad es flexible y pueden contactarme en: ${clientEmail} / ${clientPhone}. ¡Gracias de antemano!`
        : `Hi Bryan, I'm ${clientName}. I'd like to coordinate a property visit to: ${wishlistNames}. I'm flexible on timing and you can reach me at: ${clientEmail} / ${clientPhone}. Thank you!`;
    } else if (service === "guided_tour") {
      message = lang === "es"
        ? `Hola Bryan, soy ${clientName}. Me interesa el tour guiado con transporte incluido para visitar: ${wishlistNames}. Por favor indíqueme fechas disponibles y cualquier detalle del recorrido. Mi contacto: ${clientEmail} / ${clientPhone}. ¡Con mucho gusto!`
        : `Hi Bryan, I'm ${clientName}. I'm interested in the guided tour with transportation included to visit: ${wishlistNames}. Please let me know available dates and any tour details. Contact me at: ${clientEmail} / ${clientPhone}. Thank you!`;
    }

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
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
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [lifestyleFilter, setLifestyleFilter] = useState("all");
  
  const [selectedAmenityGroups, setSelectedAmenityGroups] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const AMENITY_GROUPS = useMemo(() => ({
    ocean: {
      label: lang === "es" ? "Playa y Vista al Mar" : "Beach & Ocean View",
      tags: ["Oceanfront", "Ocean Sounds", "Infinity View", "Panoramic", "Private Beach", "Marina Views", "Yacht Mooring", "Cliffside", "Surf Access", "Surfer's Dream", "270° Views", "Peninsula Tip", "Sunset Facing"]
    },
    nature: {
      label: lang === "es" ? "Naturaleza y Selva" : "Nature & Jungle Vibe",
      tags: ["Eco-Luxury", "Jungle Brutalism", "High Altitude", "Sustainable", "Glass House", "Creek-side", "Canopy Walkway", "Rainforest", "Wildlife Integration", "Wellness", "Open Air", "Yoga Pavilion"]
    },
    vip: {
      label: lang === "es" ? "Amenidades VIP (Helipuerto/Funicular)" : "VIP Amenities (Helipad/Funicular)",
      tags: ["Helipad Access", "Yacht Mooring", "Private Funicular"]
    },
    design: {
      label: lang === "es" ? "Privacidad y Diseño Premium" : "Privacy & Premium Design",
      tags: ["Ultra-Luxury", "Minimalist", "Intimate", "Family Estate", "Industrial Chic", "Exclusive", "Secluded", "Tropical Modernism"]
    },
    airbnb: {
      label: lang === "es" ? "Listo para Alquiler (Airbnb Ready)" : "Rental Ready (Airbnb Approved)",
      tags: ["Resort Amenities", "Gastronomic Center", "Wellness", "Surf Access", "City Center", "Infinity Pool"]
    },
    road: {
      label: lang === "es" ? "Fácil Acceso (Calle Pavimentada)" : "Easy Access (Paved Roads)",
      tags: ["City Center", "Gastronomic Center", "Skyline View", "Smart Home", "Resort Amenities"]
    },
    sustainable: {
      label: lang === "es" ? "Autosostenible (Eco-Friendly)" : "Autosustainable (Eco-Friendly)",
      tags: ["Sustainable", "Eco-Luxury", "Rainforest", "Creek-side", "Wildlife Integration"]
    },
    sports: {
      label: lang === "es" ? "Campo de Golf y Marina" : "Golf & Marina Lifestyle",
      tags: ["Golf Cart Access", "Marina Views", "Yacht Mooring", "Resort Amenities"]
    }
  }), [lang]);

  const availableRegions = useMemo(() => {
    const baseRegions = provinceFilter !== "all"
      ? (PROVINCE_REGIONS[provinceFilter] || [])
      : Object.values(PROVINCE_REGIONS).flat();

    // Also include any custom location created in admin dashboard that matches the selected province
    const activeLocations = properties
      .filter(p => provinceFilter === "all" || p.province === provinceFilter)
      .map(p => p.location);

    const merged = new Set([...baseRegions, ...activeLocations]);
    return Array.from(merged).sort();
  }, [provinceFilter, properties]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    properties.forEach(p => p.vibeTags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [properties]);

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
    return properties.filter(p => {
      // Segment Filter
      if (p.segment !== activeSegment) return false;

      // Price Filter
      if (priceFilter === "under-200k" && p.price >= 200000) return false;
      if (priceFilter === "200k-500k" && (p.price < 200000 || p.price > 500000)) return false;
      if (priceFilter === "500k-700k" && (p.price < 500000 || p.price > 700000)) return false;
      if (priceFilter === "700k-1m" && (p.price < 700000 || p.price > 1000000)) return false;
      if (priceFilter === "1m-2m" && (p.price < 1000000 || p.price > 2000000)) return false;
      if (priceFilter === "over-2m" && p.price <= 2000000) return false;

      // Size Filter
      if (sizeFilter === "under-5k" && p.sqft >= 5000) return false;
      if (sizeFilter === "5k-10k" && (p.sqft < 5000 || p.sqft > 10000)) return false;
      if (sizeFilter === "over-10k" && p.sqft <= 10000) return false;

      // Location Filter
      if (locationFilter !== "all" && p.location !== locationFilter) return false;

      // Province Filter
      if (provinceFilter !== "all" && p.province !== provinceFilter) return false;

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
  }, [priceFilter, sizeFilter, provinceFilter, locationFilter, typeFilter, lifestyleFilter, selectedAmenityGroups, AMENITY_GROUPS, properties]);

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
                
                {/* Bryan's Personal Intro Greeting */}
                <p className="mx-auto mt-6 max-w-2xl text-xs md:text-sm leading-relaxed text-pearl/85 font-sans italic px-4">
                  "{(t.hero as any).intro}"
                </p>

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
          <section id="collection" className={`py-24 px-6 md:px-12 transition-colors duration-500 scroll-mt-24 ${catalogTheme.bg}`}>
            
            {/* Segment Selector Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-[1600px] mx-auto">
              {[
                { 
                  id: "Luxury", 
                  label: lang === "es" ? "Colección Signature" : "Signature Collection", 
                  desc: lang === "es" ? "Propiedades selectas con ubicaciones y acabados premium" : "Handpicked premium properties in prime locations",
                  icon: Sparkles,
                  activeColor: "border-sunset text-sunset bg-[#e5c777]/5 shadow-[0_0_25px_rgba(229,199,119,0.12)] scale-[1.02]",
                  hoverColor: "border-white/10 hover:border-sunset/50 hover:bg-white/5 hover:text-sunset text-pearl/80 hover:scale-[1.01]"
                },
                { 
                  id: "Standard", 
                  label: lang === "es" ? "Residencial & Lotes" : "Residential & Land", 
                  desc: lang === "es" ? "Casas familiares, quintas de descanso y lotes listos para construir" : "Family homes, rest estates and lots ready to build",
                  icon: HomeIcon,
                  activeColor: "border-cyan-400 text-cyan-400 bg-cyan-400/5 shadow-[0_0_25px_rgba(34,211,238,0.12)] scale-[1.02]",
                  hoverColor: "border-white/10 hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-400 text-pearl/80 hover:scale-[1.01]"
                },
                { 
                  id: "Commercial", 
                  label: lang === "es" ? "Comercial & Inversiones" : "Commercial & Investments", 
                  desc: lang === "es" ? "Locales, bodegas y proyectos comerciales con alto potencial" : "Commercial buildings, warehouses and ROI projects",
                  icon: Building2,
                  activeColor: "border-blue-400 text-blue-400 bg-blue-400/5 shadow-[0_0_25px_rgba(96,165,250,0.12)] scale-[1.02]",
                  hoverColor: "border-white/10 hover:border-blue-400/50 hover:bg-white/5 hover:text-blue-400 text-pearl/80 hover:scale-[1.01]"
                }
              ].map(seg => {
                const Icon = seg.icon;
                const isActive = activeSegment === seg.id;
                return (
                  <button
                    key={seg.id}
                    onClick={() => {
                      setActiveSegment(seg.id as any);
                      setPriceFilter("all");
                      setSizeFilter("all");
                      setProvinceFilter("all");
                      setLocationFilter("all");
                      setTypeFilter("all");
                      setLifestyleFilter("all");
                    }}
                    className={`relative p-6 rounded-3xl border text-left transition-all duration-300 cursor-pointer overflow-hidden group ${
                      isActive ? seg.activeColor : seg.hoverColor
                    }`}
                  >
                    {/* Background gradient layout */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="flex items-start gap-4 relative z-10">
                      <div className={`p-3 rounded-2xl transition duration-300 shrink-0 ${
                        isActive ? "bg-white/10" : "bg-white/5 group-hover:bg-white/10"
                      }`}>
                        <Icon size={20} className="transition duration-300" />
                      </div>
                      <div>
                        <div className="font-serif text-base tracking-wide font-semibold">{seg.label}</div>
                        <div className="text-[11px] opacity-75 font-sans tracking-wide mt-1.5 leading-relaxed">{seg.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-[1600px] mx-auto"
            >
              <div>
                <h2 className={`text-xs font-sans uppercase tracking-[0.3em] mb-3 font-semibold ${catalogTheme.textAccent}`}>
                  {lang === "es" ? "Portafolio Segmentado" : "Segmented Portfolio"}
                </h2>
                <h3 className="text-3xl md:text-5xl font-serif">
                  {lang === "es" 
                    ? (activeSegment === "Luxury" ? "Colección Signature" : activeSegment === "Standard" ? "Inmobiliaria Residencial" : "Bienes Raíces Comerciales")
                    : (activeSegment === "Luxury" ? "Signature Collection" : activeSegment === "Standard" ? "Residential Realty" : "Commercial Estates")
                  }
                </h3>
              </div>
              <p className="font-sans text-gray-400 max-w-md text-xs md:text-sm leading-relaxed">
                {lang === "es"
                  ? "Explore nuestro inventario curado y filtrado específicamente para responder a su perfil de inversión y estilo de vida."
                  : "Explore our curated inventory tailored to match your specific investment profile and lifestyle requirements."}
              </p>
            </motion.div>

            {/* Advanced Filters */}
            <div className="mb-16 space-y-6 max-w-[1600px] mx-auto">
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
                {/* Price range */}
                <div className={`rounded-3xl border p-5 shadow-sm bg-white/5 ${catalogTheme.borderAccent}`}>
                  <div className={`text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold ${catalogTheme.textAccent}`}>{t.catalog.filters.priceTitle}</div>
                  <label className="block text-[9px] font-sans text-gray-400 uppercase tracking-widest mb-1.5">{t.catalog.filters.priceLabel}</label>
                  <div className="relative">
                    <select 
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className={`w-full border text-pearl text-xs font-sans px-3 py-2.5 rounded-xl appearance-none focus:outline-none cursor-pointer pr-8 animate-none border-white/10 ${catalogTheme.selectBg}`}
                    >
                       <option value="all">{t.catalog.filters.all}</option>
                       <option value="under-200k">{t.catalog.filters.under200k}</option>
                       <option value="200k-500k">{t.catalog.filters.between200kand500k}</option>
                       <option value="500k-700k">{t.catalog.filters.between500kand700k}</option>
                       <option value="700k-1m">{t.catalog.filters.between700kand1m}</option>
                       <option value="1m-2m">{t.catalog.filters.between1mand2m}</option>
                       <option value="over-2m">{t.catalog.filters.over2m}</option>
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${catalogTheme.textAccent}`} size={13} />
                  </div>
                </div>

                {/* Property Type */}
                <div className={`rounded-3xl border p-5 shadow-sm bg-white/5 ${catalogTheme.borderAccent}`}>
                  <div className={`text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold ${catalogTheme.textAccent}`}>{t.catalog.filters.typeLabel}</div>
                  <label className="block text-[9px] font-sans text-gray-400 uppercase tracking-widest mb-1.5">{lang === "es" ? "Filtrar por tipo" : "Filter by type"}</label>
                  <div className="relative">
                    <select 
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className={`w-full border text-pearl text-xs font-sans px-3 py-2.5 rounded-xl appearance-none focus:outline-none cursor-pointer pr-8 animate-none border-white/10 ${catalogTheme.selectBg}`}
                    >
                      <option value="all">{t.catalog.filters.allTypes}</option>
                      {activeSegment !== "Commercial" ? (
                        <>
                          <option value="Casa">{lang === "es" ? "Casa" : "Home"}</option>
                          <option value="Cabaña">{lang === "es" ? "Cabaña" : "Cabin"}</option>
                          <option value="Quinta">{lang === "es" ? "Quinta" : "Estate"}</option>
                          <option value="Lote">{lang === "es" ? "Lote" : "Lot"}</option>
                          <option value="Quinta de Descanso">{lang === "es" ? "Quinta de Descanso" : "Rest Quinta"}</option>
                          <option value="Terreno de Montaña">{lang === "es" ? "Terreno de Montaña" : "Mountain Land"}</option>
                          <option value="Villa Exclusiva">{lang === "es" ? "Villa Exclusiva" : "Exclusive Villa"}</option>
                        </>
                      ) : (
                        <>
                          <option value="Edificio">{lang === "es" ? "Edificio Comercial" : "Commercial Building"}</option>
                          <option value="Bodega">{lang === "es" ? "Bodega / Local" : "Warehouse"}</option>
                        </>
                      )}
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${catalogTheme.textAccent}`} size={13} />
                  </div>
                </div>

                {/* Province */}
                <div className={`rounded-3xl border p-5 shadow-sm bg-white/5 ${catalogTheme.borderAccent}`}>
                  <div className={`text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold ${catalogTheme.textAccent}`}>{t.catalog.filters.provinceTitle}</div>
                  <label className="block text-[9px] font-sans text-gray-400 uppercase tracking-widest mb-1.5">{t.catalog.filters.provinceLabel}</label>
                  <div className="relative">
                    <select 
                      value={provinceFilter}
                      onChange={(e) => {
                        setProvinceFilter(e.target.value);
                        setLocationFilter("all");
                      }}
                      className={`w-full border text-pearl text-xs font-sans px-3 py-2.5 rounded-xl appearance-none focus:outline-none cursor-pointer pr-8 animate-none border-white/10 ${catalogTheme.selectBg}`}
                    >
                      <option value="all">{t.catalog.filters.allProvinces}</option>
                      <option value="San José">San José</option>
                      <option value="Alajuela">Alajuela</option>
                      <option value="Cartago">Cartago</option>
                      <option value="Heredia">Heredia</option>
                      <option value="Guanacaste">Guanacaste</option>
                      <option value="Puntarenas">Puntarenas</option>
                      <option value="Limón">Limón</option>
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${catalogTheme.textAccent}`} size={13} />
                  </div>
                </div>

                {/* Region */}
                <div className={`rounded-3xl border p-5 shadow-sm bg-white/5 ${catalogTheme.borderAccent}`}>
                  <div className={`text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold ${catalogTheme.textAccent}`}>{t.catalog.filters.locTitle}</div>
                  <label className="block text-[9px] font-sans text-gray-400 uppercase tracking-widest mb-1.5">{t.catalog.filters.locLabel}</label>
                  <div className="relative">
                    <select 
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className={`w-full border text-pearl text-xs font-sans px-3 py-2.5 rounded-xl appearance-none focus:outline-none cursor-pointer pr-8 animate-none border-white/10 ${catalogTheme.selectBg}`}
                    >
                      <option value="all">{t.catalog.filters.allLocs}</option>
                      {availableRegions.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${catalogTheme.textAccent}`} size={13} />
                  </div>
                </div>

                {/* Lifestyle */}
                <div className={`rounded-3xl border p-5 shadow-sm bg-white/5 ${catalogTheme.borderAccent}`}>
                  <div className={`text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold ${catalogTheme.textAccent}`}>{t.catalog.filters.lifestyleLabel}</div>
                  <label className="block text-[9px] font-sans text-gray-400 uppercase tracking-widest mb-1.5">{lang === "es" ? "Ambiente" : "Vibe"}</label>
                  <div className="relative">
                    <select 
                      value={lifestyleFilter}
                      onChange={(e) => setLifestyleFilter(e.target.value)}
                      className={`w-full border text-pearl text-xs font-sans px-3 py-2.5 rounded-xl appearance-none focus:outline-none cursor-pointer pr-8 animate-none border-white/10 ${catalogTheme.selectBg}`}
                    >
                      <option value="all">{t.catalog.filters.allLifestyles}</option>
                      <option value="Naturaleza">{lang === "es" ? "Naturaleza" : "Nature"}</option>
                      <option value="Ciudad">{lang === "es" ? "Ciudad" : "City"}</option>
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${catalogTheme.textAccent}`} size={13} />
                  </div>
                </div>

                {/* Currency Mode */}
                <div className={`rounded-3xl border p-5 shadow-sm bg-white/5 ${catalogTheme.borderAccent}`}>
                  <div className={`text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold ${catalogTheme.textAccent}`}>{t.catalog.filters.currencyLabel}</div>
                  <label className="block text-[9px] font-sans text-gray-400 uppercase tracking-widest mb-1.5">{lang === "es" ? "Ver precios" : "Show price"}</label>
                  <div className="relative">
                    <select 
                      value={currencyMode}
                      onChange={(e) => setCurrencyMode(e.target.value as "USD" | "CRC" | "EUR" | "JPY")}
                      className={`w-full border text-pearl text-xs font-sans px-3 py-2.5 rounded-xl appearance-none focus:outline-none cursor-pointer pr-8 animate-none border-white/10 ${catalogTheme.selectBg}`}
                    >
                      <option value="USD">{t.catalog.filters.showUSD}</option>
                      <option value="CRC">{t.catalog.filters.showCRC}</option>
                      <option value="EUR">{t.catalog.filters.showEUR}</option>
                      <option value="JPY">{t.catalog.filters.showJPY}</option>
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${catalogTheme.textAccent}`} size={13} />
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
          <ToursCalendar lang={lang} wishlistProperties={wishlistedProperties} />
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
                            <h5 className="font-serif text-sm text-pearl truncate leading-tight">
                              {lang === "es" && property.nameEs ? property.nameEs : property.name}
                            </h5>
                            <p className="text-[10px] text-sunset font-sans truncate mt-0.5">{property.location}</p>
                            <p className="text-xs text-white font-sans mt-1 font-medium">{formatCognitivePrice(property.price, currencyMode, lang, rates)}</p>
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
                    {/* Locked Status Banner */}
                    <div className="p-4 rounded-2xl bg-black/25 border border-white/5 text-center text-xs space-y-2 mb-6">
                      <div className="flex items-center justify-center gap-2 text-[#d4af37] font-semibold uppercase tracking-wider text-[10px]">
                        <Shield size={14} />
                        <span>{lang === "es" ? "Estatus: Consulta Bloqueada" : "Status: Advisory Locked"}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                        {lang === "es"
                          ? "Para consultar disponibilidad de estas propiedades exclusivas, complete el formulario de perfil de 4 pasos abajo."
                          : "To consult availability on these exclusive properties, please complete the 4-step profile form below."}
                      </p>
                    </div>

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
                                <option value="Under 500K">{lang === "es" ? "Menos de $500,000" : "Under $500,000"}</option>
                                <option value="500K - 1.5M">$500,000 - $1,500,000</option>
                                <option value="1.5M - 5M">$1,500,000 - $5,000,000</option>
                                <option value="Over 5M">{lang === "es" ? "Más de $5,000,000" : "Over $5,000,000"}</option>
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

                      {/* Step 4: Motivation & Service Requested */}
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

                          <div>
                            <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{(t.wishlist.steps as any).serviceLabel}</label>
                            <div className="relative">
                              <select 
                                value={qualification.requestedService}
                                onChange={(e) => handleQualificationChange("requestedService", e.target.value)}
                                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs font-sans px-4 py-3.5 rounded-2xl appearance-none focus:outline-none focus:border-sunset cursor-pointer pr-10 animate-none"
                              >
                                <option value="">{lang === "es" ? "-- Seleccionar opción --" : "-- Select option --"}</option>
                                <option value="information">{(t.wishlist.steps as any).serviceOption1}</option>
                                <option value="visit">{(t.wishlist.steps as any).serviceOption2}</option>
                                <option value="guided_tour">{(t.wishlist.steps as any).serviceOption3}</option>
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
                            disabled={!clientName || !clientEmail || !clientPhone || !qualification.budget || !qualification.financing || !qualification.horizon || !qualification.motivation || !qualification.requestedService}
                            className="flex-1 py-3.5 rounded-2xl bg-sunset text-jungle hover:bg-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-sunset/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
                          >
                            {(!clientName || !clientEmail || !clientPhone || !qualification.budget || !qualification.financing || !qualification.horizon || !qualification.motivation || !qualification.requestedService) ? (
                              <>
                                <Shield size={13} /> {lang === "es" ? "Bloqueado - Complete formulario" : "Locked - Complete form"}
                              </>
                            ) : (
                              <>
                                <Send size={13} /> {lang === "es" ? "Consultar disponibilidad / Solicitar asesoría" : "Consult Availability / Request Advisory"}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                )}

                {/* Lead Scoring Output Overlay (Friendly Client Confirmation) */}
                {leadScore && (
                  <div className="border-t border-white/10 pt-6 text-center space-y-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner border border-sunset/20 bg-sunset/5 text-sunset">
                      <Sparkles className="text-sunset animate-pulse" size={32} />
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-sunset font-semibold">{lang === "es" ? "Servicio de Concierge" : "Concierge Service"}</span>
                      <h4 className="font-serif text-xl text-pearl mt-1">
                        {(t.wishlist as any).successTitle || (lang === "es" ? "Solicitud VIP Recibida" : "VIP Request Received")}
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed mt-3 max-w-sm mx-auto font-light">
                        {(t.wishlist as any).successDesc || (lang === "es"
                          ? "Gracias por compartir su interés. Nuestro equipo de concierge privado ha recibido su portafolio exclusivo. Estamos revisando sus preferencias y nos comunicaremos con usted en las próximas 24 horas para coordinar visitas privadas o brindarle información logística detallada."
                          : "Thank you for sharing your interest. Our private concierge team has received your exclusive wishlist portfolio. We are reviewing your preferences and will reach out within 24 hours to coordinate private viewings or provide custom logistics information.")}
                      </p>
                    </div>

                    {/* WhatsApp CTA + Reset controls */}
                    <div className="space-y-3 max-w-sm mx-auto pt-4">

                      {/* Service label recap */}
                      <div className="text-center mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-sans tracking-widest uppercase font-bold ${
                          qualification.requestedService === "guided_tour"
                            ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                            : qualification.requestedService === "visit"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                              : "bg-blue-500/10 border-blue-500/30 text-blue-300"
                        }`}>
                          {qualification.requestedService === "guided_tour"
                            ? (lang === "es" ? "🚐 Tour Guiado + Transporte" : "🚐 Guided Tour + Transport")
                            : qualification.requestedService === "visit"
                              ? (lang === "es" ? "🔑 Visita a la Propiedad" : "🔑 Property Visit")
                              : (lang === "es" ? "📄 Información de Propiedad" : "📄 Property Information")}
                        </span>
                      </div>

                      {/* WhatsApp button */}
                      <button
                        onClick={buildWhatsAppMessage}
                        className="w-full bg-[#25D366] text-white py-3.5 rounded-2xl font-sans uppercase tracking-[0.2em] text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-[#1ebe5d] transition duration-250 cursor-pointer shadow-lg shadow-green-500/20"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <span>{lang === "es" ? "Continuar por WhatsApp" : "Continue on WhatsApp"}</span>
                      </button>

                      <button
                        onClick={() => {
                          setLeadScore(null);
                          setWishlistedIds([]);
                          setIsWishlistOpen(false);
                          setCurrentStep(1);
                          setClientName("");
                          setClientEmail("");
                          setClientPhone("");
                          setQualification({ budget: "", financing: "", horizon: "", motivation: "", requestedService: "" });
                        }}
                        className="w-full border border-white/10 hover:border-white/20 text-pearl/70 hover:text-white py-3 rounded-2xl font-sans uppercase tracking-[0.2em] text-[9px] font-semibold transition cursor-pointer"
                      >
                        {lang === "es" ? "Cerrar y Limpiar" : "Close & Clear"}
                      </button>
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
              {modalTab === "gallery" && (
                <div className="w-full h-full relative bg-black flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={getAssetPath(galleryImages[currentImageIndex])}
                        alt={`${selectedProperty.name} Gallery ${currentImageIndex + 1}`}
                        fill
                        priority
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Prev/Next Controls */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-jungle transition cursor-pointer z-10"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(prev => (prev + 1) % galleryImages.length);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-jungle transition cursor-pointer z-10"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </>
                  )}
                  
                  {/* Gallery Index Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/50 px-4 py-2 rounded-full border border-white/10">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-1.5 w-1.5 rounded-full transition-all ${idx === currentImageIndex ? "bg-sunset w-3" : "bg-white/30"}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {modalTab === "360" && <Three360Viewer panoramaUrl={selectedProperty.panorama} />}
              
              {modalTab === "map" && (
                <div className="w-full h-full bg-[#02120e] flex flex-col justify-center p-6 md:p-10 relative overflow-y-auto">
                  {/* Subtle Grid backdrop */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
                  
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full items-center">
                    
                    {/* LEFT COLUMN: Security-First Macro Map Mockup */}
                    <div className="relative flex flex-col items-center justify-center p-6 border border-[#d4af37]/20 bg-black/40 rounded-3xl overflow-hidden aspect-square max-w-[360px] mx-auto w-full shadow-lg">
                      {/* Abstract Concentric rings */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[90%] h-[90%] rounded-full border border-white/5 flex items-center justify-center">
                          <div className="w-[75%] h-[75%] rounded-full border border-[#d4af37]/5 flex items-center justify-center">
                            <div className="w-[50%] h-[50%] rounded-full border border-white/5 flex items-center justify-center" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Topographical grid lines */}
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

                      {/* Map Pins / Pulsing Macro Ring */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="relative flex items-center justify-center mb-4">
                          {/* Pulsing glow ring */}
                          <div className="absolute h-24 w-24 rounded-full bg-sunset/15 border border-sunset/40 animate-ping" />
                          <div className="absolute h-16 w-16 rounded-full bg-sunset/20 border border-sunset/30" />
                          <div className="h-8 w-8 rounded-full bg-[#d4af37] text-[#02100b] flex items-center justify-center shadow-lg">
                            <MapPin size={16} />
                          </div>
                        </div>
                        
                        <h5 className="font-serif text-base text-pearl uppercase tracking-wider text-center">{selectedProperty.location}</h5>
                        <p className="text-[10px] text-sunset font-sans font-bold tracking-widest mt-1 uppercase border border-sunset/30 bg-sunset/10 px-3 py-1 rounded-full text-center">
                          {selectedProperty.approxLocation}
                        </p>
                        
                        {/* Macro radius label */}
                        <div className="mt-4 text-[10px] text-gray-400 font-sans tracking-wide text-center leading-relaxed bg-[#021c15] border border-white/10 px-4 py-2 rounded-2xl max-w-[240px]">
                          🛡️ <span className="font-medium text-pearl">{lang === "es" ? "Área de Seguridad" : "Macro Security Radius"}</span>: ~5km²
                        </div>
                      </div>
                      
                      {/* Security message absolute footer */}
                      <div className="absolute bottom-2 text-center text-[8px] text-gray-500 uppercase tracking-widest px-4 font-mono">
                        {lang === "es" ? "Ubicación exacta restringida por privacidad" : "Exact coordinate locked under owner privacy"}
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Logistics Metric Card */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl space-y-4 font-sans text-pearl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Shield size={16} className="text-[#d4af37]" />
                        <h4 className="font-serif text-sm uppercase tracking-wider">{lang === "es" ? "Ficha Logística y Acceso" : "Logistics & Access Ledger"}</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Altitude */}
                        <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                          <span className="text-[8px] text-gray-400 uppercase tracking-wider block">{lang === "es" ? "Altitud sobre el mar" : "Altitude (m.s.n.m.)"}</span>
                          <span className="text-xs md:text-sm font-semibold mt-1 block">
                            {selectedProperty.elevationM || 100} m.s.n.m.
                          </span>
                          <span className="text-[9px] text-gray-400 block mt-0.5">
                            (~{Math.round((selectedProperty.elevationM || 100) * 3.28084).toLocaleString()} ft)
                          </span>
                        </div>

                        {/* Airport */}
                        <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                          <span className="text-[8px] text-gray-400 uppercase tracking-wider block">{lang === "es" ? "Aeropuerto SJO" : "SJO Airport Link"}</span>
                          <span className="text-xs md:text-sm font-semibold mt-1 block">
                            {selectedProperty.airportDistKm || 50} km
                          </span>
                          <span className="text-[9px] text-[#d4af37] font-medium block mt-0.5">
                            🚙 ~{selectedProperty.airportTimeMin || 60} min
                          </span>
                        </div>

                        {/* Medical Care */}
                        <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                          <span className="text-[8px] text-gray-400 uppercase tracking-wider block">{lang === "es" ? "Acceso Médico Urgent" : "Urgent Medical Access"}</span>
                          <span className="text-xs md:text-sm font-semibold mt-1 block text-rose-300">
                            ~{selectedProperty.medicalDistMin || 15} min
                          </span>
                          <span className="text-[9px] text-gray-400 block mt-0.5">
                            {lang === "es" ? "Hospital/Clínica local" : "Local hospital/clinic"}
                          </span>
                        </div>

                        {/* Closest City */}
                        <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                          <span className="text-[8px] text-gray-400 uppercase tracking-wider block">{lang === "es" ? "Centro de Ciudad" : "Closest Urban Center"}</span>
                          <span className="text-xs md:text-sm font-semibold mt-1 block truncate">
                            {selectedProperty.closestCity || "Nicoya"}
                          </span>
                          <span className="text-[9px] text-gray-400 block mt-0.5">
                            (~{selectedProperty.cityDistKm || 5} km)
                          </span>
                        </div>
                      </div>

                      {/* Internet & Connectivity Badges */}
                      <div className="pt-2">
                        <span className="text-[8px] text-gray-400 uppercase tracking-wider block mb-2">{lang === "es" ? "Infraestructura Digital" : "Digital Infrastructure"}</span>
                        <div className="flex gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-sans tracking-wider uppercase font-semibold ${
                            selectedProperty.hasFiberOptic
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-gray-500/5 border-white/5 text-gray-500"
                          }`}>
                            🌐 {lang === "es" ? "Fibra" : "Fiber"}: {selectedProperty.hasFiberOptic ? "Yes" : "N/A"}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-sans tracking-wider uppercase font-semibold ${
                            selectedProperty.hasStarlink
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-gray-500/5 border-white/5 text-gray-500"
                          }`}>
                            🛰️ Starlink: {selectedProperty.hasStarlink ? "Yes" : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Circular radial glow background */}
                  <div className="absolute w-[400px] h-[400px] rounded-full bg-sunset/5 blur-3xl pointer-events-none" />
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
                  onClick={() => setModalTab("gallery")}
                  className={`px-3 py-1.5 rounded-full border text-[9px] font-sans tracking-widest uppercase transition cursor-pointer ${
                    modalTab === "gallery"
                      ? "bg-sunset border-sunset text-jungle font-bold"
                      : "bg-black/60 border-white/15 text-pearl hover:bg-black/80"
                  }`}
                >
                  {lang === "es" ? "Galería" : "Gallery"}
                </button>
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

                <div className="flex items-center justify-between mb-3 text-sunset text-[10px] md:text-xs font-sans uppercase tracking-[0.3em]">
                  <span>{selectedProperty.location}</span>
                  {selectedProperty.refCode && (
                    <span className="px-2.5 py-1 border border-[#d4af37]/45 text-[#d4af37] font-semibold rounded-md bg-[#d4af37]/5 tracking-widest text-[9px]">
                      {selectedProperty.refCode}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl lg:text-4xl font-serif mb-6 leading-tight text-pearl font-bold">
                  {lang === "es" && selectedProperty.nameEs ? selectedProperty.nameEs : selectedProperty.name}
                </h2>
                
                <div className="text-xl lg:text-2xl font-sans font-light mb-8 border-b border-white/10 pb-6 text-white flex justify-between items-baseline">
                  <span>
                    {formatCognitivePrice(selectedProperty.price, currencyMode, lang, rates)}
                  </span>
                  {currencyMode !== "USD" && (
                    <span className="text-xs text-gray-400 font-normal">
                      (Approx. {formatCognitivePrice(selectedProperty.price, "USD", lang, rates)})
                    </span>
                  )}
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="text-[10px] font-sans uppercase tracking-widest text-gray-400 mb-2">{t.modal.archSoul}</h4>
                    <p className="font-sans text-xs md:text-sm text-gray-300 leading-relaxed font-light">
                      {lang === "es" && selectedProperty.descriptionEs ? selectedProperty.descriptionEs : selectedProperty.description}
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
                <button 
                  onClick={() => {
                    if (!wishlistedIds.includes(selectedProperty.id)) {
                      setWishlistedIds(prev => [...prev, selectedProperty.id]);
                    }
                    setSelectedProperty(null);
                    setModalTab("360");
                    setIsWishlistOpen(true);
                  }}
                  className="w-full bg-sunset text-jungle py-4 font-sans uppercase tracking-[0.2em] text-xs font-bold flex items-center justify-center gap-3 hover:bg-white transition-colors duration-250 cursor-pointer"
                >
                  {t.modal.bookTour} <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer id="contact" className="relative mt-16 border-t border-white/10 bg-black/35 py-12 px-6 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-8">
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

        <div className="mx-auto max-w-[1600px] mt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest gap-4">
          <div>
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-sunset font-semibold text-[#d4af37]/75 transition flex items-center gap-1.5 cursor-pointer bg-transparent border-0 outline-none"
            >
              <span>⚙️</span>
              <span>{lang === "es" ? "Acceso Portal Admin" : "Admin Portal Access"}</span>
            </button>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Imagine Real Estate & Property Management. All rights reserved.
          </div>
        </div>
      </footer>

      {isAdminOpen && (
        <AdminDashboard
          properties={properties}
          onAddProperty={handleAddProperty}
          onUpdateProperty={handleUpdateProperty}
          onDeleteProperty={handleDeleteProperty}
          lang={lang}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </main>
  );
}

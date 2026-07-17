"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Property } from "@/constants/properties";
import { BedDouble, Expand, Heart, MapPin } from "lucide-react";
import { getAssetPath } from "@/utils/paths";
import { formatCognitivePrice, formatDualPrice } from "@/utils/price";
import { TRANSLATIONS } from "@/constants/translations";

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
  wishlisted?: boolean;
  onToggleWishlist?: (property: Property) => void;
  lang?: "en" | "es";
  currencyMode?: "USD" | "CRC" | "EUR" | "JPY";
  rates?: { CRC: number; EUR: number; JPY: number; USD: number };
}

const statusStyles = {
  Disponible: "bg-emerald-600/90 border-emerald-500 text-pearl",
  Opcionada: "bg-amber-500 border-amber-400 text-jungle font-semibold",
  Vendida: "bg-rose-800/90 border-rose-600 text-pearl/80 opacity-75 line-through",
  Destacada: "bg-sunset border-sunset text-jungle font-bold uppercase",
};

const statusTranslations = {
  en: {
    Disponible: "Available",
    Opcionada: "Pending",
    Vendida: "Sold",
    Destacada: "Featured",
  },
  es: {
    Disponible: "Disponible",
    Opcionada: "Opcionada",
    Vendida: "Vendida",
    Destacada: "Destacada",
  }
};

export default function PropertyCard({ 
  property, 
  onClick, 
  wishlisted = false, 
  onToggleWishlist,
  lang = "en",
  currencyMode = "USD",
  rates
}: PropertyCardProps) {
  const t = TRANSLATIONS[lang].card;

  const formattedPrice = useMemo(() => {
    return formatDualPrice(property.price, property.currency || "USD", rates || undefined, lang).dualString;
  }, [property.price, property.currency, rates, lang]);

  const segmentStyles = useMemo(() => {
    const segments = Array.isArray(property.segment) 
      ? property.segment 
      : (property.segment ? [property.segment] : ["Luxury"]);

    let mainSegment: "Luxury" | "Standard" | "Commercial" = "Luxury";
    if (segments.includes("Luxury")) {
      mainSegment = "Luxury";
    } else if (segments.includes("Commercial")) {
      mainSegment = "Commercial";
    } else if (segments.includes("Standard")) {
      mainSegment = "Standard";
    }

    switch (mainSegment) {
      case "Standard":
        return {
          bg: "bg-[#08221b] border-white/10 hover:border-cyan-500/50",
          textAccent: "text-cyan-400",
          iconAccent: "text-cyan-400",
          wishlistHover: "hover:border-cyan-400 hover:bg-cyan-400/20",
          heartFill: "text-cyan-400 fill-cyan-400"
        };
      case "Commercial":
        return {
          bg: "bg-[#0b1329] border-white/10 hover:border-blue-500/50",
          textAccent: "text-blue-400",
          iconAccent: "text-blue-400",
          wishlistHover: "hover:border-blue-400 hover:bg-blue-400/20",
          heartFill: "text-blue-400 fill-blue-400"
        };
      case "Luxury":
      default:
        return {
          bg: "bg-[#041c16] border-white/5 hover:border-sunset/50",
          textAccent: "text-sunset",
          iconAccent: "text-sunset",
          wishlistHover: "hover:border-sunset hover:bg-sunset/20",
          heartFill: "text-sunset fill-sunset"
        };
    }
  }, [property.segment]);

  return (
    <motion.div
      className={`group relative cursor-pointer overflow-hidden rounded-sm text-pearl shadow-2xl border transition duration-300 ${segmentStyles.bg}`}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={() => onClick(property)}
    >
      <div className="aspect-[4/5] w-full overflow-hidden relative">
        <motion.img
          src={getAssetPath(property.image)}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

        {/* Wishlist Heart Toggle */}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleWishlist?.(property);
          }}
          className={`absolute top-4 right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition hover:scale-105 active:scale-95 ${segmentStyles.wishlistHover} ${wishlisted ? segmentStyles.textAccent : "text-gray-200"}`}
        >
          <Heart size={16} className={wishlisted ? segmentStyles.heartFill : ""} />
        </button>

        {/* Status Badges & Vibe Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start z-10 max-w-[70%]">
          <span
            className={`px-3 py-1.5 text-[9px] font-sans tracking-widest uppercase border rounded-full shadow-md ${statusStyles[property.status]}`}
          >
            {statusTranslations[lang][property.status]}
          </span>
          {property.refCode && (
            <span className="px-2.5 py-1 text-[9px] font-sans tracking-widest uppercase bg-black/65 backdrop-blur-md border border-[#d4af37]/45 rounded-full text-[#d4af37] font-semibold shadow-md">
              {property.refCode}
            </span>
          )}
          {property.vibeTags.slice(0, 1).map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-1 text-[9px] font-sans tracking-widest uppercase bg-black/55 backdrop-blur-md border border-white/10 rounded-full text-pearl/90 shadow-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content Area */}
        <div className="absolute bottom-0 w-full p-5 lg:translate-y-6 lg:group-hover:translate-y-0 transition-transform duration-500">
          <div className={`flex items-center gap-1.5 text-[10px] mb-2 uppercase tracking-widest font-sans font-semibold ${segmentStyles.textAccent}`}>
            <MapPin size={11} />
            <span>{property.location}</span>
          </div>
          
          <h3 className="text-xl md:text-2xl font-serif text-pearl mb-1.5 leading-tight truncate">
            {lang === "es" && property.nameEs ? property.nameEs : property.name}
          </h3>
          
          <div className="text-xs md:text-sm font-sans font-semibold text-[#d4af37] mb-3 tracking-wide bg-black/25 px-2.5 py-1 rounded-lg border border-white/5 w-fit">
            {formattedPrice}
          </div>
          
          <div className="flex items-center gap-4 flex-wrap text-[10.5px] font-sans text-gray-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 delay-75 border-t border-white/15 pt-3">
            <div className="flex items-center gap-1">
              <span className="text-[#d4af37] font-semibold">{lang === "es" ? "Const:" : "Const:"}</span>
              <span className="text-pearl">
                {(property.constructionSizeM2 || property.m2 || Math.round(property.sqft * 0.092903)).toLocaleString("en-US")} m²
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#d4af37] font-semibold">{lang === "es" ? "Lote:" : "Lot:"}</span>
              <span className="text-pearl">
                {(property.lotSizeM2 || 0) > 0 
                  ? `${(property.lotSizeM2 || 0).toLocaleString("en-US")} m²` 
                  : "N/A"}
              </span>
            </div>
            {property.suites > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-[#d4af37] font-semibold">{lang === "es" ? "Hab:" : "Suites:"}</span>
                <span className="text-pearl">{property.suites}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

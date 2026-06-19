"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Property } from "@/constants/properties";
import { BedDouble, Expand, Heart, MapPin } from "lucide-react";
import { getAssetPath } from "@/utils/paths";
import { TRANSLATIONS } from "@/constants/translations";

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
  wishlisted?: boolean;
  onToggleWishlist?: (property: Property) => void;
  lang?: "en" | "es";
  currencyMode?: "USD" | "CRC" | "EUR" | "JPY";
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
  currencyMode = "USD"
}: PropertyCardProps) {
  const t = TRANSLATIONS[lang].card;

  const formattedPrice = useMemo(() => {
    if (currencyMode === "CRC") {
      const crcValue = property.price * 520;
      return `₡${crcValue.toLocaleString(lang === "es" ? "es-CR" : "en-US")}`;
    }
    if (currencyMode === "EUR") {
      const eurValue = property.price * 0.92;
      return `€${eurValue.toLocaleString(lang === "es" ? "es-ES" : "en-US", { maximumFractionDigits: 0 })}`;
    }
    if (currencyMode === "JPY") {
      const jpyValue = property.price * 158;
      return `¥${jpyValue.toLocaleString(lang === "es" ? "ja-JP" : "en-US", { maximumFractionDigits: 0 })}`;
    }
    return `$${property.price.toLocaleString("en-US")}`;
  }, [property.price, currencyMode, lang]);

  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden rounded-sm bg-[#041c16] text-pearl shadow-2xl border border-white/5"
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
          className={`absolute top-4 right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition hover:scale-105 active:scale-95 hover:border-sunset hover:bg-sunset/20 ${wishlisted ? "text-sunset" : "text-gray-200"}`}
        >
          <Heart size={16} className={wishlisted ? "fill-sunset text-sunset" : ""} />
        </button>

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start z-10">
          <span
            className={`px-3 py-1.5 text-[9px] font-sans tracking-widest uppercase border rounded-full shadow-md ${statusStyles[property.status]}`}
          >
            {statusTranslations[lang][property.status]}
          </span>
        </div>

        {/* Vibe Tags - moved down slightly to avoid overlapping top badges */}
        <div className="absolute top-16 left-4 flex flex-wrap gap-2 max-w-[70%] z-10">
          {property.vibeTags.slice(0, 1).map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-1 text-[9px] font-sans tracking-widest uppercase bg-black/55 backdrop-blur-md border border-white/10 rounded-full text-pearl/90"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content Area */}
        <div className="absolute bottom-0 w-full p-5 lg:translate-y-6 lg:group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-1.5 text-sunset text-[10px] mb-2 uppercase tracking-widest font-sans font-semibold">
            <MapPin size={11} />
            <span>{property.location}</span>
          </div>
          
          <h3 className="text-xl md:text-2xl font-serif text-pearl mb-1.5 leading-tight truncate">
            {property.name}
          </h3>
          
          <div className="text-lg md:text-xl font-sans font-medium text-white mb-3">
            {formattedPrice}
            {currencyMode !== "USD" && (
              <span className="text-[10px] text-gray-400 font-normal block mt-0.5">
                (Approx. ${(property.price).toLocaleString("en-US")} USD)
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-5 text-xs font-sans text-gray-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 delay-75 border-t border-white/15 pt-3">
            <div className="flex items-center gap-1.5">
              <Expand size={13} className="text-sunset" />
              <span>
                {property.sqft.toLocaleString("en-US")} {t.sqft}
                <span className="text-[10px] text-gray-400 ml-1">({Math.round(property.sqft * 0.092903).toLocaleString("en-US")} m²)</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble size={13} className="text-sunset" />
              <span>{property.suites} {t.suites}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

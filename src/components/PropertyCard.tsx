"use client";

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
}

export default function PropertyCard({ 
  property, 
  onClick, 
  wishlisted = false, 
  onToggleWishlist,
  lang = "en"
}: PropertyCardProps) {
  const t = TRANSLATIONS[lang].card;

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleWishlist?.(property);
          }}
          className={`absolute top-4 right-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition hover:scale-105 active:scale-95 hover:border-sunset hover:bg-sunset/20 ${wishlisted ? "text-sunset" : "text-gray-200"}`}
        >
          <Heart size={18} className={wishlisted ? "fill-sunset text-sunset" : ""} />
        </button>

        {/* Vibe Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[70%]">
          {property.vibeTags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-[10px] font-sans tracking-widest uppercase bg-black/55 backdrop-blur-md border border-white/15 rounded-full text-pearl"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 w-full p-5 lg:translate-y-6 lg:group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-2 text-sunset text-xs mb-2 uppercase tracking-widest font-sans font-semibold">
            <MapPin size={12} />
            <span>{property.location}</span>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-serif text-pearl mb-1.5 leading-tight">
            {property.name}
          </h3>
          
          <div className="text-xl md:text-2xl font-sans font-light text-white mb-3">
            ${property.price.toLocaleString("en-US")}
          </div>
          
          <div className="flex items-center gap-5 text-xs md:text-sm font-sans text-gray-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 delay-75 border-t border-white/15 pt-3">
            <div className="flex items-center gap-1.5">
              <Expand size={14} className="text-sunset" />
              <span>
                {property.sqft.toLocaleString("en-US")} {t.sqft}
                <span className="text-[10px] text-gray-400 ml-1">({Math.round(property.sqft * 0.092903).toLocaleString("en-US")} m²)</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble size={14} className="text-sunset" />
              <span>{property.suites} {t.suites}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


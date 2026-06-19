"use client";

import { motion } from "framer-motion";
import { Property } from "@/constants/properties";
import { BedDouble, Expand, Heart, MapPin } from "lucide-react";
import { getAssetPath } from "@/utils/paths";

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
  wishlisted?: boolean;
  onToggleWishlist?: (property: Property) => void;
}

export default function PropertyCard({ property, onClick, wishlisted = false, onToggleWishlist }: PropertyCardProps) {
  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden rounded-sm bg-[#064e3b] text-pearl shadow-2xl"
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={() => onClick(property)}
    >
      <div className="aspect-[4/5] w-full overflow-hidden relative">
        <motion.img
          src={getAssetPath(property.image)}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleWishlist?.(property);
          }}
          className={`absolute top-4 right-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition hover:border-sunset hover:bg-sunset/80 ${wishlisted ? "text-sunset" : "text-gray-100"}`}
        >
          <Heart size={18} />
        </button>

        {/* Vibe Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {property.vibeTags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs font-sans tracking-widest uppercase bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-pearl"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-2 text-sunset text-sm mb-2 uppercase tracking-widest font-sans font-semibold">
            <MapPin size={14} />
            <span>{property.location}</span>
          </div>
          
          <h3 className="text-3xl font-serif text-pearl mb-2 leading-tight">
            {property.name}
          </h3>
          
          <div className="text-2xl font-sans font-light text-white mb-4">
            ${property.price.toLocaleString("en-US")}
          </div>
          
          <div className="flex items-center gap-6 text-sm font-sans text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 border-t border-white/20 pt-4">
            <div className="flex items-center gap-2">
              <Expand size={16} className="text-sunset" />
              <span>
                {property.sqft.toLocaleString("en-US")} sqft
                <span className="text-xs text-gray-400 ml-1">({Math.round(property.sqft * 0.092903).toLocaleString("en-US")} m²)</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BedDouble size={16} className="text-sunset" />
              <span>{property.suites} Suites</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

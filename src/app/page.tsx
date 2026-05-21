"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROPERTIES, Property } from "@/constants/properties";
import PropertyCard from "@/components/PropertyCard";
import Three360Viewer from "@/components/Three360Viewer";
import { X, ChevronRight } from "lucide-react";

export default function Home() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filtering state
  const [priceFilter, setPriceFilter] = useState("all");
  const [sqftFilter, setSqftFilter] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Compute unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    PROPERTIES.forEach(p => p.vibeTags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter(p => {
      // Price
      if (priceFilter === "under-5" && p.price >= 5000000) return false;
      if (priceFilter === "5-10" && (p.price < 5000000 || p.price > 10000000)) return false;
      if (priceFilter === "over-10" && p.price <= 10000000) return false;

      // Sqft
      if (sqftFilter === "under-5k" && p.sqft >= 5000) return false;
      if (sqftFilter === "5k-10k" && (p.sqft < 5000 || p.sqft > 10000)) return false;
      if (sqftFilter === "over-10k" && p.sqft <= 10000) return false;

      // Tags
      if (selectedTags.length > 0) {
        const hasTag = selectedTags.some(tag => p.vibeTags.includes(tag));
        if (!hasTag) return false;
      }

      return true;
    });
  }, [priceFilter, sqftFilter, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <main className="min-h-screen bg-jungle text-pearl selection:bg-sunset selection:text-jungle">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-jungle/90 to-transparent backdrop-blur-sm">
        <div className="font-serif text-2xl font-bold tracking-wider">
          Bryan Viquez <span className="text-sunset text-sm font-sans font-normal uppercase tracking-[0.3em] ml-2">| Imagine Property Management & Real Estate</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-sans uppercase tracking-widest">
          <a href="#" className="hover:text-sunset transition-colors">Home</a>
          <a href="#collection" className="hover:text-sunset transition-colors">Collection</a>
          <a href="#" className="hover:text-sunset transition-colors">About Bryan</a>
          <a href="#" className="hover:text-sunset transition-colors text-sunset">Concierge</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Simulated Video Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=2000" 
            alt="Costa Rica Coast"
            className="w-full h-full object-cover opacity-40 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jungle via-jungle/50 to-transparent" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 p-12 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl text-center max-w-3xl mx-4"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-24 h-24 mx-auto mb-8 rounded-full overflow-hidden border-2 border-sunset"
          >
            {/* Using a placeholder for Bryan's photo */}
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256" 
              alt="Bryan Viquez"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif mb-4 leading-tight">
            The Architect of <br/><span className="text-sunset italic">Exclusivity</span>
          </h1>
          <p className="text-lg md:text-xl font-sans font-light tracking-wide text-gray-300 max-w-xl mx-auto mb-8">
            Curating Costa Rica&apos;s most extraordinary properties for the world&apos;s most discerning individuals. Pura Vida elegance meets architectural minimalism.
          </p>
          <button className="bg-sunset text-jungle px-8 py-4 uppercase font-sans tracking-widest text-sm font-semibold hover:bg-white transition-colors duration-300">
            Enter the Collection
          </button>
        </motion.div>
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
          <div className="flex flex-col md:flex-row gap-6">
            {/* Price Filter */}
            <div className="flex-1">
              <label className="block text-xs font-sans text-gray-400 uppercase tracking-widest mb-2">Price Range</label>
              <select 
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full bg-[#033b2a] border border-white/10 text-pearl text-sm font-sans px-4 py-3 appearance-none focus:outline-none focus:border-sunset/50 transition-colors"
              >
                <option value="all">Any Price</option>
                <option value="under-5">Under $5,000,000</option>
                <option value="5-10">$5,000,000 - $10,000,000</option>
                <option value="over-10">Over $10,000,000</option>
              </select>
            </div>
            
            {/* Sqft Filter */}
            <div className="flex-1">
              <label className="block text-xs font-sans text-gray-400 uppercase tracking-widest mb-2">Size (Sqft / m²)</label>
              <select 
                value={sqftFilter}
                onChange={(e) => setSqftFilter(e.target.value)}
                className="w-full bg-[#033b2a] border border-white/10 text-pearl text-sm font-sans px-4 py-3 appearance-none focus:outline-none focus:border-sunset/50 transition-colors"
              >
                <option value="all">Any Size</option>
                <option value="under-5k">Under 5,000 sqft (465 m²)</option>
                <option value="5k-10k">5,000 - 10,000 sqft (465 - 930 m²)</option>
                <option value="over-10k">Over 10,000 sqft (930 m²)</option>
              </select>
            </div>
          </div>

          {/* Vibe Tags */}
          <div>
            <label className="block text-xs font-sans text-gray-400 uppercase tracking-widest mb-3">Amenities & Vibe</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 text-xs font-sans uppercase tracking-widest rounded-full border transition-all duration-300 ${
                    selectedTags.includes(tag) 
                      ? "bg-sunset border-sunset text-jungle font-bold" 
                      : "bg-transparent border-white/20 text-gray-300 hover:border-sunset/50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 text-sm font-sans text-gray-400 uppercase tracking-widest border-b border-white/10 pb-4">
          Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'}
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
                  <PropertyCard property={property} onClick={setSelectedProperty} />
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
    </main>
  );
}

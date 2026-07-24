"use client";

import { useState, type FormEvent, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, UploadCloud } from "lucide-react";
import { GlobalSiteSettings } from "@/constants/properties";

interface GlobalSettingsProps {
  siteSettings: GlobalSiteSettings;
  onUpdateSiteSettings: (settings: GlobalSiteSettings) => void;
  lang: "en" | "es";
}

export default function GlobalSettings({
  siteSettings,
  onUpdateSiteSettings,
  lang
}: GlobalSettingsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(f => f.type.startsWith("image/"));
    const newImages: string[] = [];
    
    let processed = 0;
    if (validFiles.length === 0) return;

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          newImages.push(ev.target.result as string);
        }
        processed++;
        if (processed === validFiles.length) {
          onUpdateSiteSettings({
            ...siteSettings,
            rotatingBackgrounds: [...siteSettings.rotatingBackgrounds, ...newImages]
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const updated = siteSettings.rotatingBackgrounds.filter((_, i) => i !== index);
    onUpdateSiteSettings({
      ...siteSettings,
      rotatingBackgrounds: updated
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#021812] border border-[#d4af37]/20 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl text-[#d4af37] font-semibold mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          {lang === "es" ? "Fondos de Pantalla Rotativos (Página Principal)" : "Rotating Backgrounds (Homepage)"}
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          {lang === "es" ? "Arrastra imágenes o haz clic para subir los fondos de alta resolución." : "Drag and drop images or click to upload high-resolution backgrounds."}
        </p>

        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mb-8 border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-white/20 bg-[#01140f] hover:border-[#d4af37]/50 hover:bg-white/5'}`}
        >
          <input 
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileInput}
          />
          <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-[#d4af37]' : 'text-gray-400'}`} />
          <h4 className="text-pearl font-medium text-lg mb-1">
            {lang === "es" ? "Arrastra tus imágenes aquí" : "Drag & Drop your images here"}
          </h4>
          <p className="text-gray-500 text-xs">
            {lang === "es" ? "PNG, JPG hasta 5MB (Puedes seleccionar varias)" : "PNG, JPG up to 5MB (You can select multiple)"}
          </p>
          <div className="mt-4 px-6 py-2 rounded-full bg-white/10 text-pearl text-xs uppercase tracking-widest hover:bg-white/20 transition-colors">
            {lang === "es" ? "Explorar Archivos" : "Browse Files"}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {siteSettings.rotatingBackgrounds.map((img, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden aspect-video border border-white/10">
              <img src={img} alt={`Background ${i}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => handleRemoveImage(i)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                  title="Eliminar / Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

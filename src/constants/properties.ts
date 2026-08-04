export interface PropertyPanorama {
  url: string;
  title: string;
  titleEs?: string;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  sqft: number;
  suites: number;
  vibeTags: string[];
  description: string;
  image: string;
  panorama: string;
  panoramas?: PropertyPanorama[];
  type: string[] | string;
  segment: ("Luxury" | "Standard" | "Commercial")[] | "Luxury" | "Standard" | "Commercial";
  m2?: number;
  acres?: number;
  province: "San José" | "Alajuela" | "Cartago" | "Heredia" | "Guanacaste" | "Puntarenas" | "Limón";
  lifestyle: "Naturaleza" | "Ciudad";
  status: "Disponible" | "Opcionada" | "Vendida" | "Destacada";
  approxLocation: string;
  // Security-First Logistics & Style of Life Metrics
  elevationM: number;
  airportDistKm: number;
  airportTimeMin: number;
  closestCity: string;
  cityDistKm: number;
  medicalDistMin: number;
  hasFiberOptic: boolean;
  hasStarlink: boolean;
  gallery?: string[];
  nameEs?: string;
  descriptionEs?: string;
  refCode?: string;
  fincaRegistryNum?: string;
  catasterMapNum?: string;
  amenities?: string[];
  currency?: "USD" | "CRC";
  commissionType?: "percentage" | "fixed";
  commissionValue?: number;
  commissionAmount?: number;
  lotSizeM2?: number;
  constructionSizeM2?: number;
  transactionType?: "Venta" | "Alquiler";
  videoUrl?: string;
  virtualTourUrl?: string;
}

export interface PropertyType {
  id: string;
  nameEs: string;
  nameEn: string;
  visible: boolean;
}

export const DEFAULT_PROPERTY_TYPES: PropertyType[] = [
  { id: "Casa", nameEs: "Casa", nameEn: "House", visible: true },
  { id: "Apartamento", nameEs: "Apartamento", nameEn: "Apartment", visible: true },
  { id: "Condominio", nameEs: "Condominio", nameEn: "Condo", visible: true },
  { id: "Villa Exclusiva", nameEs: "Villa Exclusiva", nameEn: "Exclusive Villa", visible: true },
  { id: "Cabaña", nameEs: "Cabaña", nameEn: "Cabin", visible: true },
  { id: "Quinta", nameEs: "Quinta", nameEn: "Estate", visible: true },
  { id: "Quinta de Descanso", nameEs: "Quinta de Descanso", nameEn: "Rest Quinta", visible: true },
  { id: "Lote", nameEs: "Lote", nameEn: "Lot", visible: true },
  { id: "Terreno de Montaña", nameEs: "Terreno de Montaña", nameEn: "Mountain Land", visible: true },
  { id: "Finca", nameEs: "Finca / Finca Agrícola", nameEn: "Farm / Ranch", visible: true },
  { id: "Edificio", nameEs: "Edificio Comercial", nameEn: "Commercial Building", visible: true },
  { id: "Bodega", nameEs: "Bodega / Local", nameEn: "Warehouse / Retail Space", visible: true },
  { id: "Oficina", nameEs: "Oficina", nameEn: "Office", visible: true },
  { id: "Penthouse", nameEs: "Penthouse", nameEn: "Penthouse", visible: true },
  { id: "Hotel", nameEs: "Hotel / Hostal", nameEn: "Hotel / B&B", visible: true }
];

export interface Region {
  id: string;
  name: string;
  province: string;
  visible: boolean;
}

export const PROVINCE_REGIONS: Record<string, string[]> = {
  "San José": [
    "San José Centro", "Escazú", "Desamparados", "Puriscal", "Tarrazú", "Aserrí", "Mora", "Goicoechea", "Santa Ana", "Alajuelita", "Vázquez de Coronado", "Acosta", "Tibás", "Moravia", "Montes de Oca", "Turrubares", "Dota", "Curridabat", "Pérez Zeledón", "León Cortés Castro"
  ],
  "Alajuela": [
    "Alajuela Centro", "San Ramón", "Grecia", "San Mateo", "Atenas", "Naranjo", "Palmares", "Poás", "Orotina", "San Carlos", "Zarcero", "Valverde Vega (Sarchí)", "Upala", "Los Chiles", "Guatuso", "Río Cuarto"
  ],
  "Cartago": [
    "Cartago Centro", "Paraíso", "La Unión", "Jiménez", "Turrialba", "Alvarado", "Oreamuno", "El Guarco"
  ],
  "Heredia": [
    "Heredia Centro", "Barva", "Santo Domingo", "Santa Bárbara", "San Rafael", "San Isidro", "Belén", "Flores", "San Pablo", "Sarapiquí"
  ],
  "Guanacaste": [
    "Liberia", "Nicoya", "Santa Cruz", "Bagaces", "Carrillo", "Cañas", "Abangares", "Tilarán", "Nandayure", "La Cruz", "Hojancha"
  ],
  "Puntarenas": [
    "Puntarenas Centro", "Esparza", "Buenos Aires", "Montes de Oro", "Osa", "Quepos", "Golfito", "Coto Brus", "Parrita", "Corredores", "Garabito", "Monteverde", "Puerto Jiménez"
  ],
  "Limón": [
    "Limón Centro", "Pococí", "Siquirres", "Talamanca", "Matina", "Guácimo"
  ]
};

export const DEFAULT_REGIONS: Region[] = Object.entries(PROVINCE_REGIONS).flatMap(
  ([province, cantonList]) =>
    cantonList.map(canton => ({
      id: canton,
      name: canton,
      province: province,
      visible: true
    }))
);

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  budgetRange: string;
  financing: string;
  horizon: string;
  motivation: string;
  wishlistPropertyIds: string[];
  status: "Lead Nuevo" | "En Contacto" | "Discovery Tour Programado" | "Propuesta/Negociación" | "Cierre Exitoso / Perdido";
  tourDates?: string;
  tourPeople?: number;
  tourLodging?: boolean;
  tourLodgingPref?: string;
  notes: string[];
  lastInteractionDate: string; // ISO String
  gdprConsent?: boolean;
  tourAgent?: string;
  tourVisitedProperties?: string[];
  requestedService?: string;
}

const SEEDED_PROPERTIES: Property[] = [
  {
    id: "prop-san-ramon-cabana",
    name: "Cloud Forest Mountain Cabin",
    nameEs: "Cabaña de Montaña en Bosque Nuboso",
    location: "San Ramón, Alajuela",
    approxLocation: "Ángeles Norte (Cerca de Hotel Villa Blanca)",
    province: "Alajuela",
    price: 102000000,
    currency: "CRC",
    sqft: 1668,
    m2: 155,
    acres: 1.24,
    lotSizeM2: 5000,
    constructionSizeM2: 155,
    suites: 2,
    vibeTags: ["Bosque Nuboso", "Clima Fresco", "Proyecto Privado", "Acceso Controlado", "Vista Panorámica", "Tranquilidad"],
    description: "Beautiful 155 m² (1,668 sqft) mountain cabin set on a 5,000 m² (1.24 acre) private forest lot in Ángeles Norte, San Ramón, Alajuela. Located within a gated private estate project near the famous Villa Blanca Cloud Forest Hotel. At 1,100m elevation with spring-like weather year-round.",
    descriptionEs: "Hermosa cabaña de montaña de 155 m² (1,668 sqft) construida sobre un impresionante terreno de 5,000 m² (1.24 acres) de bosque privado y zonas verdes en Ángeles Norte de San Ramón, Alajuela. Ubicada en un exclusivo proyecto de quintas privado con acceso controlado cerca del reconocido Hotel Villa Blanca Cloud Forest.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
    panorama: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
    panoramas: [
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80", title: "Vista Principal", titleEs: "Vista Principal" },
      { url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80", title: "Balcón de Montaña", titleEs: "Balcón de Montaña" }
    ],
    type: ["Cabaña", "Quinta de Descanso"],
    segment: ["Standard", "Luxury"],
    lifestyle: "Naturaleza",
    status: "Destacada",
    elevationM: 1100,
    airportDistKm: 60,
    airportTimeMin: 60,
    closestCity: "San Ramón",
    cityDistKm: 12,
    medicalDistMin: 20,
    hasFiberOptic: true,
    hasStarlink: true,
    amenities: ["Balcón Panorámico", "Cocina Funcional", "Bosque Privado", "Acceso Controlado"],
    gallery: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  {
    id: "prop-papagayo-estate",
    name: "Villa Papagayo Oceanfront Sanctuary",
    nameEs: "Villa Papagayo Santuario Frente al Mar",
    location: "Golfo de Papagayo, Guanacaste",
    approxLocation: "Península Papagayo",
    province: "Guanacaste",
    price: 2850000,
    currency: "USD",
    sqft: 5200,
    m2: 483,
    acres: 0.85,
    lotSizeM2: 3439,
    constructionSizeM2: 483,
    suites: 5,
    vibeTags: ["Oceanfront", "Infinity Pool", "Gated Security", "Private Pier", "Luxury Finishes"],
    description: "Ultra-luxury beachfront villa located in the prestigious Peninsula Papagayo. Features 5 master suites, private infinity pool overlooking the Pacific Ocean, smart home automation, and direct beach access.",
    descriptionEs: "Villa de ultra lujo frente al mar ubicada en la prestigiosa Península de Papagayo. Cuenta con 5 suites principales, piscina infinita privada con vista al Océano Pacífico, automatización inteligente y acceso directo a la playa.",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80",
    panorama: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80",
    panoramas: [
      { url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80", title: "Terraza Piscina", titleEs: "Terraza Piscina" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80", title: "Sala Principal", titleEs: "Sala Principal" },
      { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80", title: "Vista Aérea", titleEs: "Vista Aérea" }
    ],
    type: ["Casa", "Villa"],
    segment: ["Luxury"],
    lifestyle: "Naturaleza",
    status: "Destacada",
    elevationM: 35,
    airportDistKm: 32,
    airportTimeMin: 35,
    closestCity: "Liberia",
    cityDistKm: 30,
    medicalDistMin: 25,
    hasFiberOptic: true,
    hasStarlink: true,
    amenities: ["Piscina Infinita", "Muelle Privado", "Seguridad 24/7", "Cancha de Tenis"],
    gallery: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  {
    id: "prop-escazu-penthouse",
    name: "Horizon Escazú Skyline Penthouse",
    nameEs: "Penthouse Horizon Escazú Skyline",
    location: "Escazú, San José",
    approxLocation: "Jaboncillos de Escazú",
    province: "San José",
    price: 980000,
    currency: "USD",
    sqft: 3400,
    m2: 315,
    acres: 0.1,
    lotSizeM2: 315,
    constructionSizeM2: 315,
    suites: 3,
    vibeTags: ["Penthouse", "City View", "Concierge 24/7", "Private Elevator"],
    description: "Exclusive penthouse in Jaboncillos Escazú featuring 360-degree panoramic views of San José valley and surrounding mountains. Floor-to-ceiling glass walls, Italian marble floors, and private rooftop lounge.",
    descriptionEs: "Exclusivo penthouse en Jaboncillos de Escazú con vistas panorámicas de 360 grados hacia el valle de San José y las montañas. Paredes de vidrio de piso a techo, pisos de mármol italiano y lounge privado en azotea.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
    panorama: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
    panoramas: [
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80", title: "Rooftop Lounge", titleEs: "Rooftop Lounge" },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80", title: "Suite Principal", titleEs: "Suite Principal" }
    ],
    type: ["Apartamento"],
    segment: ["Luxury"],
    lifestyle: "Ciudad",
    status: "Disponible",
    elevationM: 1100,
    airportDistKm: 18,
    airportTimeMin: 25,
    closestCity: "San José",
    cityDistKm: 5,
    medicalDistMin: 8,
    hasFiberOptic: true,
    hasStarlink: false,
    amenities: ["Ascensor Privado", "Gimnasio Equipado", "Piscina Climatizada", "Cava de Vinos"],
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80"
    ]
  }
];

export const PROPERTIES: Property[] = SEEDED_PROPERTIES.map((p, idx) => ({
  ...p,
  refCode: `REF-${String(idx + 1).padStart(2, "0")}`
}));
export interface GlobalSiteSettings {
  rotatingBackgrounds: string[];
}

export const DEFAULT_SITE_SETTINGS: GlobalSiteSettings = {
  rotatingBackgrounds: [
    "/images/premium1.png",
    "/images/premium2.png",
    "/images/premium3.png"
  ]
};

export interface PMProperty {
  id: string;
  name: string;
  location: string;
  descriptionEs: string;
  descriptionEn: string;
  image: string;
  gallery: string[];
  airbnbUrl?: string;
  privateWebUrl?: string;
  whatsappContact?: string;
  nightlyRate?: number;
  currency?: "USD" | "CRC";
}

export const DEMO_PM_PROPERTIES: PMProperty[] = [
  {
    id: "pm-demo-1",
    name: "Villa Paraíso Sunset",
    location: "Santa Teresa, Puntarenas",
    descriptionEs: "Increíble villa frente al mar con piscina infinita y todas las comodidades de lujo. Perfecta para retiros de yoga o vacaciones familiares.",
    descriptionEn: "Incredible beachfront villa with infinity pool and all luxury amenities. Perfect for yoga retreats or family vacations.",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1600&q=80"
    ],
    airbnbUrl: "https://airbnb.com/",
    whatsappContact: "+50688888888",
    nightlyRate: 350,
    currency: "USD"
  }
];

"use client";

import { useState } from "react";
import { FileText, Eye, Printer, Share2, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LegalDemoVaultProps {
  lang: "en" | "es";
}

interface DemoContract {
  id: string;
  titleEs: string;
  titleEn: string;
  categoryEs: string;
  categoryEn: string;
  descEs: string;
  descEn: string;
  htmlEs: string;
  htmlEn: string;
}

const DEMO_CONTRACTS: DemoContract[] = [
  {
    id: "pm-demo",
    titleEs: "Contrato de Administración de Propiedades",
    titleEn: "Property Management Agreement",
    categoryEs: "Gestión Hotelera & Alquileres",
    categoryEn: "Hospitality & Property Care",
    descEs: "Muestra para propietarios que entregan su residencia a gestión de rentas cortas/largas y mantenimiento.",
    descEn: "Sample for property owners delegating vacation rental management, maintenance, and concierge care.",
    htmlEs: `
      <div style="font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1.5px;">CONTRATO DE ADMINISTRACIÓN DE PROPIEDAD</h1>
          <p style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin: 0;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A. [DOCUMENTO DE MUESTRA / DEMO]</p>
        </div>
        
        <p>En la ciudad de San José, Costa Rica, al día <strong>20 de Julio del 2026</strong>, se celebra el presente contrato de administración entre:</p>
        <p>Por una parte, <strong>IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A.</strong>, cédula jurídica número 3-101-778899, representada en este acto por el Sr. <strong>Bryan Viquez</strong> en su calidad de apoderado (en adelante el "ADMINISTRADOR"), y por la otra parte, el/la Sr./Sra. <strong>CLIENTE EJEMPLO / PROPIETARIO DEMO</strong>, cédula/pasaporte N° 1-1234-5678 (en adelante el "PROPIETARIO").</p>
        
        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">CLÁUSULA PRIMERA: OBJETO Y DATOS REGISTRALES DEL INMUEBLE</h3>
        <p>El PROPIETARIO entrega en administración exclusiva al ADMINISTRADOR la finca habitacional denominada <strong>"VILLA MORPHO - DEMO ESTATE"</strong>, situada en Provincia de Guanacaste, Cantón de Carrillo, Distrito Sardinal (Península Papagayo), e inscrita bajo el número de <strong>Finca: 5-123456-000</strong> y <strong>Plano Catastro: G-9876543-2024</strong>.</p>
        
        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">CLÁUSULA SEGUNDA: ALCANCE DE LOS SERVICIOS CONCIERGE & MANTENIMIENTO</h3>
        <p>El ADMINISTRADOR asume la gestión comercial en plataformas digitales (Airbnb, VRBO, canal directo), atención de huéspedes 24/7, servicios de ama de llaves, limpieza de entrada/salida, jardinería y mantenimiento preventivo con rendición de cuentas mensual.</p>
        
        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">CLÁUSULA TERCERA: COMISIÓN DE GESTIÓN Y BALANCE FINANCIERO</h3>
        <p>El PROPIETARIO reconoce al ADMINISTRADOR una comisión de administración equivalente al <strong>15% (quince por ciento)</strong> sobre los ingresos brutos generados por las reservas efectuadas durante la vigencia del contrato.</p>
        
        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">CLÁUSULA CUARTA: RESOLUCIÓN ALTERNA DE CONFLICTOS (RAC)</h3>
        <p>Toda controversia derivada de este instrumento será resuelta de manera definitiva mediante arbitraje de derecho de conformidad con los reglamentos del Centro de Conciliación y Arbitraje de la Cámara de Comercio de Costa Rica.</p>
        
        <div style="margin-top: 70px; display: flex; justify-content: space-between;">
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>IMAGINE S.A.</strong><br/>Bryan Viquez - Apoderado</p>
          </div>
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>PROPIETARIO DEMO</strong><br/>Cliente Ejemplo</p>
          </div>
        </div>
      </div>
    `,
    htmlEn: `
      <div style="font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1.5px;">PROPERTY MANAGEMENT AGREEMENT</h1>
          <p style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin: 0;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A. [DEMO SAMPLE DOCUMENT]</p>
        </div>
        
        <p>Executed in San José, Costa Rica, on this <strong>20th day of July, 2026</strong>, by and between:</p>
        <p><strong>IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A.</strong>, Corporate ID No. 3-101-778899, represented herein by Mr. <strong>Bryan Viquez</strong> (hereinafter referred to as the "MANAGER"), and <strong>SAMPLE CLIENT / DEMO OWNER</strong>, Passport/ID No. 1-1234-5678 (hereinafter referred to as the "OWNER").</p>
        
        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">FIRST CLAUSE: PROPERTY OBJECT AND REGISTRY DETAILS</h3>
        <p>The OWNER grants exclusive property management rights to the MANAGER over the residential estate known as <strong>"VILLA MORPHO - DEMO ESTATE"</strong>, located in Guanacaste, Península Papagayo, registered under Property ID <strong>Finca: 5-123456-000</strong> and Survey Map <strong>Plano: G-9876543-2024</strong>.</p>
        
        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">SECOND CLAUSE: SERVICES & CONCIERGE CARE</h3>
        <p>The MANAGER assumes distribution across premium digital channels (Airbnb, VRBO, direct booking), 24/7 guest concierge, turnover housekeeping, grounds maintenance, and monthly accounting reporting.</p>
        
        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">THIRD CLAUSE: MANAGEMENT COMMISSION</h3>
        <p>The OWNER agrees to pay the MANAGER a management fee equal to <strong>15% (fifteen percent)</strong> of gross rental receipts during the duration of this agreement.</p>
        
        <div style="margin-top: 70px; display: flex; justify-content: space-between;">
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>IMAGINE S.A.</strong><br/>Bryan Viquez - Manager</p>
          </div>
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>DEMO OWNER</strong><br/>Sample Client</p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "exclusive-listing-demo",
    titleEs: "Contrato de Corretaje & Venta Exclusiva",
    titleEn: "Exclusive Real Estate Listing Agreement",
    categoryEs: "Venta Inmobiliaria",
    categoryEn: "Property Brokerage",
    descEs: "Muestra de corretaje para enlistar propiedades de alta gama con exclusividad en la red de comercialización Imagine.",
    descEn: "Sample exclusive brokerage agreement for listing luxury properties in the Imagine curated inventory.",
    htmlEs: `
      <div style="font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1.5px;">CONTRATO DE CORRETAJE Y COMERCIALIZACIÓN EXCLUSIVA</h1>
          <p style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin: 0;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT [DOCUMENTO DE MUESTRA / DEMO]</p>
        </div>
        
        <p>Entre los suscritos, <strong>IMAGINE S.A.</strong> (el "CORREDOR") y el Sr./Sra. <strong>PROPIETARIO DEMO</strong> (el "VENDEDOR"), se acuerda la intermediación inmobiliaria exclusiva del siguiente inmueble:</p>
        
        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">CLÁUSULA PRIMERA: CONDICIONES DE VENTA Y COMISIÓN ACORDADA</h3>
        <p>El VENDEDOR autoriza al CORREDOR a promocionar el inmueble por un precio de venta sugerido de <strong>$1,250,000 USD</strong> (o su equivalente en colones según el tipo de cambio oficial). Por la gestión de venta, se fija una comisión del <strong>5% + IVA</strong> sobre el precio final de cierre pactado.</p>
        
        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">CLÁUSULA SEGUNDA: ESTRATEGIA DE MARKETING Y PRODUCCIÓN MULTIMEDIA</h3>
        <p>El CORREDOR se compromete a realizar fotografía arquitectónica HD, recorrido virtual 360°, tomas con dron de alta resolución y publicidad dirigida en canales internacionales de bienes raíces.</p>
        
        <div style="margin-top: 70px; display: flex; justify-content: space-between;">
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>IMAGINE S.A.</strong><br/>Corredor Inmobiliario</p>
          </div>
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>VENDEDOR DEMO</strong><br/>Propietario</p>
          </div>
        </div>
      </div>
    `,
    htmlEn: `
      <div style="font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1.5px;">EXCLUSIVE REAL ESTATE LISTING AGREEMENT</h1>
          <p style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin: 0;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT [SAMPLE DEMO]</p>
        </div>
        
        <p>By and between <strong>IMAGINE S.A.</strong> (the "BROKER") and <strong>DEMO SELLER</strong> (the "SELLER"), exclusive brokerage representation is hereby granted for the marketing of the property listed at <strong>$1,250,000 USD</strong>.</p>

        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">FIRST CLAUSE: COMMISSION & SALES PRICE</h3>
        <p>The SELLER agrees to pay the BROKER a success fee of <strong>5% + VAT</strong> upon closing of the sale transaction.</p>
        
        <div style="margin-top: 70px; display: flex; justify-content: space-between;">
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>IMAGINE S.A.</strong><br/>Brokerage Team</p>
          </div>
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>DEMO SELLER</strong><br/>Owner</p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "option-purchase-demo",
    titleEs: "Contrato de Opción de Compraventa",
    titleEn: "Option to Purchase & Sale Agreement",
    categoryEs: "Promesa de Compra",
    categoryEn: "Legal Acquisition",
    descEs: "Muestra de contrato para congelar una propiedad mediante depósito/prima y fijar fechas de cierre.",
    descEn: "Sample contract for reserving a property with earnest money deposit and establishing formal closing terms.",
    htmlEs: `
      <div style="font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1.5px;">CONTRATO DE OPCIÓN DE COMPRAVENTA DE BIEN INMUEBLE</h1>
          <p style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin: 0;">DOCUMENTO LEGAL DE MUESTRA PARA CLIENTES [DEMO]</p>
        </div>
        
        <p>Reunidos el <strong>VENDEDOR DEMO</strong> y el <strong>COMPRADOR DEMO</strong> con el testimonio de <strong>IMAGINE REAL ESTATE S.A.</strong>, acuerdan otorgar la presente opción de compraventa bajo los siguientes términos:</p>

        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">CLÁUSULA PRIMERA: PRIMA DE OPCIÓN Y PLAZO DE EJECUCIÓN</h3>
        <p>El COMPRADOR entrega la suma de <strong>$50,000 USD (cincuenta mil dólares)</strong> en calidad de prima o señal de opción. El plazo acordado para llevar a cabo la firma de la escritura de compraventa en protocolo notarial será de <strong>60 días naturales</strong>.</p>
        
        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">CLÁUSULA SEGUNDA: LIBERTAD DE GRAVÁMENES Y ESTADO DE IMPUESTOS</h3>
        <p>El VENDEDOR garantiza que la finca se traspasará libre de gravámenes hipotecarios, anotaciones judiciales y al día en el pago de impuestos municipales y de bienes inmuebles.</p>

        <div style="margin-top: 70px; display: flex; justify-content: space-between;">
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>VENDEDOR DEMO</strong><br/>Propietario</p>
          </div>
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>COMPRADOR DEMO</strong><br/>Optante Comprador</p>
          </div>
        </div>
      </div>
    `,
    htmlEn: `
      <div style="font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1.5px;">OPTION TO PURCHASE & SALE AGREEMENT</h1>
          <p style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin: 0;">CLIENT SAMPLE DRAFT [DEMO]</p>
        </div>
        
        <p>By and between <strong>DEMO SELLER</strong> and <strong>DEMO BUYER</strong>, witnessed by <strong>IMAGINE REAL ESTATE S.A.</strong>, the parties agree on an earnest deposit option of <strong>$50,000 USD</strong> for 60 calendar days until final closing.</p>

        <div style="margin-top: 70px; display: flex; justify-content: space-between;">
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>DEMO SELLER</strong><br/>Seller</p>
          </div>
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>DEMO BUYER</strong><br/>Buyer</p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "reservation-receipt-demo",
    titleEs: "Recibo de Reserva & Señal de Trato",
    titleEn: "Reservation & Deposit Receipt",
    categoryEs: "Apartado Formal",
    categoryEn: "Priority Hold",
    descEs: "Comprobante formal para apartado rápido de propiedad y bloqueo temporal de inventario para el cliente.",
    descEn: "Official hold receipt to temporarily freeze property inventory while formal purchase terms are prepared.",
    htmlEs: `
      <div style="font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1.5px;">COMPROBANTE FORMAL DE RESERVA Y APARTADO</h1>
          <p style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin: 0;">IMAGINE REAL ESTATE [DOCUMENTO DEMO]</p>
        </div>
        
        <p>Se hace constar la recepción del depósito de reserva por un monto de <strong>$5,000 USD (cinco mil dólares)</strong> efectuado por el cliente <strong>CLIENTE DEMO</strong> para congelar la oferta de la propiedad <strong>"CASA MANUEL ANTONIO"</strong> por un período de 10 días hábiles.</p>
        
        <div style="margin-top: 70px; display: flex; justify-content: space-between;">
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>IMAGINE REAL ESTATE</strong><br/>Recibido Conforme</p>
          </div>
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>CLIENTE DEMO</strong><br/>Depositante</p>
          </div>
        </div>
      </div>
    `,
    htmlEn: `
      <div style="font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1.5px;">FORMAL RESERVATION & DEPOSIT RECEIPT</h1>
          <p style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin: 0;">IMAGINE REAL ESTATE [DEMO SAMPLE]</p>
        </div>
        
        <p>This acknowledges the receipt of a refundable reservation deposit of <strong>$5,000 USD</strong> from <strong>DEMO CLIENT</strong> to place a temporary 10-day hold on property <strong>"CASA MANUEL ANTONIO"</strong>.</p>
        
        <div style="margin-top: 70px; display: flex; justify-content: space-between;">
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>IMAGINE REAL ESTATE</strong><br/>Received By</p>
          </div>
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>DEMO CLIENT</strong><br/>Depositor</p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "commission-agreement-demo",
    titleEs: "Contrato de Reconocimiento de Comisión & Honorarios",
    titleEn: "Real Estate Commission & Fee Agreement",
    categoryEs: "Honorarios de Intermediación",
    categoryEn: "Commission & Brokerage Fee",
    descEs: "Muestra de reconocimiento formal de honorarios y comisión de intermediación pactados para transacciones inmobiliarias.",
    descEn: "Sample agreement formalizing agreed brokerage commission percentages, fee structure, and payout terms upon closing.",
    htmlEs: `
      <div style="font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1.5px;">CONTRATO DE RECONOCIMIENTO DE COMISIÓN E INTERMEDIACIÓN INMOBILIARIA</h1>
          <p style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin: 0;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A. [DOCUMENTO DE MUESTRA / DEMO]</p>
        </div>
        
        <p>En la ciudad de San José, Costa Rica, al día <strong>20 de Julio del 2026</strong>, se suscribe el presente acuerdo de honorarios y comisión entre:</p>
        <p>Por una parte, <strong>IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A.</strong> (el "CORREDOR / INTERMEDIARIO"), y por la otra parte, <strong>CLIENTE PROPIETARIO / DESARROLLADOR DEMO</strong>, cédula jurídica/física N° 3-101-998877 (el "CONTRATANTE").</p>

        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">CLÁUSULA PRIMERA: RECONOCIMIENTO DE COMISIÓN PACTADA</h3>
        <p>El CONTRATANTE reconoce expresamente a favor del CORREDOR una comisión de éxito correspondiente al <strong>5% (cinco por ciento) + IVA</strong> sobre el monto bruto final negociado de la propiedad denominada <strong>"VILLA MORPHO - PAPAGAYO"</strong> (o bien un monto fijo acordado de <strong>$25,000 USD</strong>).</p>

        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">CLÁUSULA SEGUNDA: MOMENTO Y FORMA DE PAGO</h3>
        <p>La comisión pactada será exigible y liquidada de forma directa e irrevocable en el acto de firma del protocolo notarial de traspaso o mediante giro bancario coordinado al momento del cierre formal de la venta.</p>

        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">CLÁUSULA TERCERA: CONFIDENCIALIDAD Y ASISTENCIA LEGAL</h3>
        <p>Ambas partes se obligan a mantener absoluta confidencialidad sobre los términos económicos y legales pactados en esta negociación.</p>

        <div style="margin-top: 70px; display: flex; justify-content: space-between;">
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>IMAGINE S.A.</strong><br/>Bryan Viquez - Intermediario</p>
          </div>
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>CLIENTE DEMO</strong><br/>Contratante</p>
          </div>
        </div>
      </div>
    `,
    htmlEn: `
      <div style="font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1.5px;">REAL ESTATE COMMISSION & FEE AGREEMENT</h1>
          <p style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin: 0;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT [DEMO SAMPLE]</p>
        </div>
        
        <p>Executed in San José, Costa Rica, by and between <strong>IMAGINE S.A.</strong> (the "BROKER") and <strong>DEMO CLIENT / DEVELOPER</strong> (the "PRINCIPAL"), regarding brokerage fee terms:</p>

        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">FIRST CLAUSE: AGREED COMMISSION & SUCCESS FEE</h3>
        <p>The PRINCIPAL acknowledges and agrees to pay the BROKER a success commission of <strong>5% + VAT</strong> (or a fixed fee of <strong>$25,000 USD</strong>) upon final closing of property <strong>"VILLA MORPHO - PAPAGAYO"</strong>.</p>

        <h3 style="font-size: 13px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 25px;">SECOND CLAUSE: PAYMENT TERMS & SETTLEMENT</h3>
        <p>The commission shall be fully payable and disbursed directly upon execution of the notary deed of transfer at property closing.</p>

        <div style="margin-top: 70px; display: flex; justify-content: space-between;">
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>IMAGINE S.A.</strong><br/>Brokerage Representative</p>
          </div>
          <div style="width: 42%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 11px;">
            <p><strong>DEMO CLIENT</strong><br/>Principal</p>
          </div>
        </div>
      </div>
    `
  }
];

export default function LegalDemoVault({ lang }: LegalDemoVaultProps) {
  const [selectedContract, setSelectedContract] = useState<DemoContract | null>(null);
  const [viewLang, setViewLang] = useState<"en" | "es">(lang || "es");

  const handlePrintDemo = () => {
    if (!selectedContract) return;
    const content = viewLang === "es" ? selectedContract.htmlEs : selectedContract.htmlEn;
    const printWin = window.open("", "_blank");
    if (!printWin) return;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${viewLang === "es" ? selectedContract.titleEs : selectedContract.titleEn} - DEMO</title>
          <style>
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body style="padding: 40px; background: #fff;">
          ${content}
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
    }, 250);
  };

  const handleWhatsAppShare = (contract: DemoContract) => {
    const title = viewLang === "es" ? contract.titleEs : contract.titleEn;
    const message = viewLang === "es"
      ? `Hola, de parte de Imagine Real Estate le comparto una plantilla de muestra de nuestro "${title}" para su revisión. Quedamos a su disposición para cualquier duda.`
      : `Hello, from Imagine Real Estate here is a sample draft of our "${title}" for your review. Please let us know if you have any questions.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-serif text-lg text-pearl flex items-center gap-2">
            <FileText className="text-[#d4af37]" size={20} />
            {lang === "es" ? "Demostración de Contratos Legales para Clientes" : "Legal Contracts Demo Vault"}
          </h3>
          <p className="text-[10px] text-gray-400 font-sans mt-1">
            {lang === "es" 
              ? "Muestra modelos de contrato oficiales a tus clientes cuando soliciten un borrador, ejemplo o copia informativa."
              : "Show official sample contract templates to your clients whenever they request a draft or copy."
            }
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[10px] font-sans text-gray-400 uppercase tracking-widest">{lang === "es" ? "Idioma Demo:" : "Demo Lang:"}</span>
          <button
            type="button"
            onClick={() => setViewLang(prev => prev === "es" ? "en" : "es")}
            className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[10px] font-mono text-[#d4af37] font-semibold uppercase hover:bg-white/10 transition"
          >
            {viewLang === "es" ? "Español (ES)" : "English (EN)"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DEMO_CONTRACTS.map(contract => {
          const title = viewLang === "es" ? contract.titleEs : contract.titleEn;
          const category = viewLang === "es" ? contract.categoryEs : contract.categoryEn;
          const desc = viewLang === "es" ? contract.descEs : contract.descEn;

          return (
            <div 
              key={contract.id} 
              className="p-5 border border-white/10 bg-[#011a14] rounded-xl flex flex-col justify-between hover:border-[#d4af37]/40 transition group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-mono border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] font-semibold">
                    {category}
                  </span>
                  <ShieldCheck size={14} className="text-emerald-400 opacity-70" />
                </div>
                <h4 className="font-serif text-sm text-pearl font-semibold group-hover:text-[#d4af37] transition">
                  {title}
                </h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans font-light">
                  {desc}
                </p>
              </div>

              <div className="flex gap-2 mt-5 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setSelectedContract(contract)}
                  className="flex-1 bg-[#d4af37]/15 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#02140f] border border-[#d4af37]/35 text-[10px] py-2 rounded-lg font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Eye size={12} />
                  <span>{lang === "es" ? "Ver Demo" : "Preview Demo"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWhatsAppShare(contract)}
                  className="p-2 border border-emerald-500/30 hover:border-emerald-500 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded-lg text-[10px] transition cursor-pointer"
                  title={lang === "es" ? "Enviar muestra por WhatsApp" : "Share sample via WhatsApp"}
                >
                  <Share2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Screen Contract Demo Preview Modal */}
      <AnimatePresence>
        {selectedContract && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#02140f] border border-[#d4af37]/40 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 md:p-6 border-b border-white/10 bg-[#032219] flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base md:text-lg text-pearl font-semibold">
                    {viewLang === "es" ? selectedContract.titleEs : selectedContract.titleEn}
                  </h3>
                  <p className="text-[9px] text-gray-400 font-mono uppercase tracking-widest mt-0.5">
                    {lang === "es" ? "Vista Previa de Demostración para Clientes" : "Client Sample Preview Draft"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setViewLang(prev => prev === "es" ? "en" : "es")}
                    className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-white/20 text-[10px] font-mono text-pearl hover:border-[#d4af37] transition"
                  >
                    {viewLang === "es" ? "Ver en Inglés (EN)" : "Ver en Español (ES)"}
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintDemo}
                    className="bg-[#d4af37] text-[#02140f] hover:bg-white text-xs px-3.5 py-1.5 rounded-lg font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>{lang === "es" ? "Imprimir / PDF" : "Print / PDF"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedContract(null)}
                    className="p-2 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Printable Document Paper View */}
              <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#08100d] flex justify-center">
                <div className="bg-white text-black p-8 md:p-14 shadow-2xl rounded-sm w-full max-w-3xl min-h-[600px] border border-gray-200">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: viewLang === "es" ? selectedContract.htmlEs : selectedContract.htmlEn 
                    }} 
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

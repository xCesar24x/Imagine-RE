"use client";

import { useState, useEffect } from "react";
import { Download, ChevronDown, Send, MessageCircle } from "lucide-react";
import { Property, Lead } from "@/constants/properties";

interface ContractAutomatorProps {
  leads: Lead[];
  properties: Property[];
  lang: "en" | "es";
}

export default function ContractAutomator({
  leads,
  properties,
  lang
}: ContractAutomatorProps) {
  const [selectedContractLead, setSelectedContractLead] = useState<string>("");
  const [selectedContractProp, setSelectedContractProp] = useState<string>("");
  const [contractType, setContractType] = useState<"pm" | "exclusive" | "commission">("pm");
  const [contractLang, setContractLang] = useState<"en" | "es">(lang || "es");
  const [contractCommission, setContractCommission] = useState<number>(15);
  const [contractTerm, setContractTerm] = useState<number>(12);
  const [contractRepName, setContractRepName] = useState<string>("Bryan Viquez");
  const [contractRepId, setContractRepId] = useState<string>("3-101-778899");
  const [contractCustomClauses, setContractCustomClauses] = useState<string>("");
  const [includeRac, setIncludeRac] = useState<boolean>(true); // Alternative dispute resolution check
  
  const [generatedContractHtml, setGeneratedContractHtml] = useState<string>("");
  const [contractEmailStatus, setContractEmailStatus] = useState<string | null>(null);

  useEffect(() => {
    if (contractType === "pm") {
      setContractCommission(15);
      setContractTerm(12);
    } else if (contractType === "exclusive") {
      setContractCommission(6);
      setContractTerm(12);
    } else if (contractType === "commission") {
      setContractCommission(3);
      setContractTerm(6);
    }
  }, [contractType]);

  const generateLegalContract = () => {
    const lead = leads.find(l => l.id === selectedContractLead);
    const prop = properties.find(p => p.id === selectedContractProp);
    if (!lead || !prop) return;

    let content = "";
    const dateStr = new Date().toLocaleDateString(
      contractLang === "es" ? "es-CR" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );

    const racText = includeRac
      ? (contractLang === "es"
          ? `<h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA DE RESOLUCIÓN ALTERNA DE CONFLICTOS (RAC)</h3>
             <p>Cualquier disputa o reclamación que surja de la interpretación o ejecución de este contrato se resolverá de forma definitiva mediante arbitraje de derecho, de conformidad con los reglamentos de arbitraje del Centro de Conciliación y Arbitraje de la Cámara de Comercio de Costa Rica, a cuyas normas las partes se someten de manera incondicional.</p>`
          : `<h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">ALTERNATIVE DISPUTE RESOLUTION (ADR) CLAUSE</h3>
             <p>Any dispute, claim or difference arising out of the interpretation or execution of this agreement shall be settled definitively by arbitration, in accordance with the arbitration rules of the Conciliation and Arbitration Center of the Chamber of Commerce of Costa Rica, to which rules the parties unconditionally submit.</p>`)
      : "";

    if (contractType === "pm") {
      if (contractLang === "es") {
        content = `
          <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #02140f; font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">CONTRATO DE ADMINISTRACIÓN DE PROPIEDADES</h1>
              <p style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT</p>
            </div>
            
            <p>En la ciudad de San José, Costa Rica, al día <strong>${dateStr}</strong>, se celebra el presente contrato de administración de propiedad (en adelante el "Contrato") entre:</p>
            <p>Por una parte, <strong>IMAGINE S.A.</strong>, cédula jurídica número <strong>${contractRepId}</strong>, representada en este acto por el Sr. <strong>${contractRepName}</strong> en su calidad de apoderado generalísimo (en adelante el "Administrador"), y por la otra, el Sr./Sra. <strong>${lead.name}</strong>, titular del correo electrónico <strong>${lead.email}</strong> y teléfono <strong>${lead.phone}</strong> (en adelante el "Propietario").</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA PRIMERA: OBJETO DEL CONTRATO Y DATOS REGISTRALES</h3>
            <p>El Propietario entrega en administración exclusiva al Administrador la propiedad denominada <strong>"${prop.nameEs || prop.name}"</strong>, ubicada en <strong>${prop.location} (${prop.approxLocation})</strong>, e inscrita en el Registro de la Propiedad de Costa Rica bajo el número de <strong>Finca: ${prop.fincaRegistryNum || "___________"}</strong> y <strong>Plano Catastro: ${prop.catasterMapNum || "___________"}</strong>. La propiedad se entrega para su gestión hotelera, comercialización en canales digitales (Airbnb, Booking.com y canal directo), limpieza, check-in/check-out y mantenimiento integral.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA SEGUNDA: COMISIÓN DE GESTIÓN Y BALANCE</h3>
            <p>El Administrador percibirá una comisión de gestión correspondiente al <strong>${contractCommission}% (por ciento)</strong> sobre los ingresos brutos generados por concepto de alquiler de la propiedad durante la vigencia del Contrato. Los balances financieros serán entregados mensualmente.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA TERCERA: PLAZO DE VIGENCIA</h3>
            <p>El plazo de vigencia del presente contrato será de <strong>${contractTerm} meses</strong> a partir de la firma de este documento, prorrogable de forma automática por períodos iguales salvo manifestación en contrario por alguna de las partes con 30 días de anticipación.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA CUARTA: SERVICIOS CONCIERGE VIP INCLUIDOS</h3>
            <p>El Administrador coordinará servicios de limpieza premium de entrada/salida, mantenimiento de piscina, jardinería básica y atención concierge 24/7 para huéspedes VIP.</p>
            
            ${racText}

            ${contractCustomClauses.trim() ? `
              <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA ADICIONAL PACTADA</h3>
              <p style="white-space: pre-wrap; font-style: italic;">${contractCustomClauses}</p>
            ` : ""}

            <div style="margin-top: 80px; display: flex; justify-content: space-between;">
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>IMAGINE S.A.</strong><br/>Administrador / Representante</p>
              </div>
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>${lead.name}</strong><br/>Propietario / Cliente</p>
              </div>
            </div>
          </div>
        `;
      } else {
        content = `
          <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #02140f; font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">PROPERTY MANAGEMENT CONTRACT</h1>
              <p style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT</p>
            </div>
            
            <p>In San José, Costa Rica, on <strong>${dateStr}</strong>, this property management agreement (hereinafter the "Agreement") is entered into by and between:</p>
            <p>On one part, <strong>IMAGINE S.A.</strong>, Corporate ID number <strong>${contractRepId}</strong>, represented by Mr. <strong>${contractRepName}</strong> in his capacity as legal representative (hereinafter the "Manager"), and on the other part, Mr./Mrs. <strong>${lead.name}</strong>, with email <strong>${lead.email}</strong> and phone <strong>${lead.phone}</strong> (hereinafter the "Owner").</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLAUSE ONE: OBJECT OF AGREEMENT & REGISTRY DATA</h3>
            <p>The Owner delivers to the Manager under exclusive administration the property named <strong>"${prop.name}"</strong>, located in <strong>${prop.location} (${prop.approxLocation})</strong>, registered under Costa Rican **Registry Finca: ${prop.fincaRegistryNum || "___________"}** and **Cataster Map: ${prop.catasterMapNum || "___________"}**, for rental management, digital marketing on booking channels (Airbnb, Booking.com and direct channel), turnover cleaning, check-in/check-out services and general maintenance.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLAUSE TWO: MANAGEMENT FEE & REVENUE BALANCE</h3>
            <p>The Manager shall receive a management commission corresponding to <strong>${contractCommission}% (percent)</strong> of the gross rental income generated by the property during the term of the Agreement. Financial statements will be delivered on a monthly basis.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLAUSE THREE: CONTRACT TERM</h3>
            <p>The duration of this agreement shall be <strong>${contractTerm} months</strong> from the signing date, automatically renewable for equal periods unless written notice is given by either party 30 days in advance.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLAUSE FOUR: VIP CONCIERGE SERVICES INCLUDED</h3>
            <p>The Manager will coordinate premium turnover cleaning, pool maintenance, basic landscaping, and 24/7 concierge support for VIP guests.</p>
            
            ${racText}

            ${contractCustomClauses.trim() ? `
              <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">ADDITIONAL AGREED COVENANT</h3>
              <p style="white-space: pre-wrap; font-style: italic;">${contractCustomClauses}</p>
            ` : ""}

            <div style="margin-top: 80px; display: flex; justify-content: space-between;">
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>IMAGINE S.A.</strong><br/>Manager Representative</p>
              </div>
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>${lead.name}</strong><br/>Owner / Client</p>
              </div>
            </div>
          </div>
        `;
      }
    } else if (contractType === "exclusive") {
      if (contractLang === "es") {
        content = `
          <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #02140f; font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">CONTRATO DE EXCLUSIVIDAD DE CORRETAJE INMOBILIARIO</h1>
              <p style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT</p>
            </div>
            
            <p>En Costa Rica, al día <strong>${dateStr}</strong>, se suscribe el presente acuerdo entre <strong>IMAGINE S.A.</strong>, cédula jurídica número <strong>${contractRepId}</strong>, representada por <strong>${contractRepName}</strong> (en adelante el "Corredor"), y el propietario <strong>${lead.name}</strong> (en adelante el "Propietario"), para la promoción y venta en exclusiva de la siguiente propiedad:</p>
            <p style="background: #f7f9f8; padding: 15px; border-left: 3px solid #d4af37; font-size: 12px;">
              <strong>Nombre de la Propiedad:</strong> ${prop.nameEs || prop.name}<br/>
              <strong>Ubicación Geográfica:</strong> ${prop.location} (${prop.approxLocation})<br/>
              <strong>Finca Registrada N°:</strong> ${prop.fincaRegistryNum || "___________"}<br/>
              <strong>Plano Catastro N°:</strong> ${prop.catasterMapNum || "___________"}<br/>
              <strong>Precio Mínimo de Publicación (USD):</strong> $${prop.price.toLocaleString("en-US")} USD
            </p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA PRIMERA: DERECHO DE EXCLUSIVIDAD</h3>
            <p>El Propietario concede al Corredor el derecho exclusivo para publicitar, promover, mostrar y negociar la venta de la propiedad descrita por un período obligatorio de <strong>${contractTerm} meses</strong> naturales a partir de la firma de este acuerdo.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA SEGUNDA: HONORARIOS DE CORRETAJE</h3>
            <p>En caso de concretarse la venta de la propiedad con cualquier cliente, los honorarios correspondientes al Corredor serán del <strong>${contractCommission}% (por client) + IVA</strong> sobre el precio final de venta pactado, pagaderos en el acto de la firma de la escritura de traspaso.</p>
            
            ${racText}

            ${contractCustomClauses.trim() ? `
              <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA ADICIONAL PACTADA</h3>
              <p style="white-space: pre-wrap; font-style: italic;">${contractCustomClauses}</p>
            ` : ""}

            <div style="margin-top: 80px; display: flex; justify-content: space-between;">
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>IMAGINE S.A.</strong><br/>Corredor Autorizado</p>
              </div>
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>${lead.name}</strong><br/>Propietario / Cliente</p>
              </div>
            </div>
          </div>
        `;
      } else {
        content = `
          <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #02140f; font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">EXCLUSIVE REAL ESTATE BROKERAGE AGREEMENT</h1>
              <p style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT</p>
            </div>
            
            <p>In Costa Rica, on <strong>${dateStr}</strong>, this exclusive agreement is signed between <strong>IMAGINE S.A.</strong>, Corporate ID number <strong>${contractRepId}</strong>, represented by <strong>${contractRepName}</strong> (hereinafter the "Broker"), and the property owner <strong>${lead.name}</strong> (hereinafter the "Owner"), for the exclusive marketing and sale of the following property:</p>
            <p style="background: #f7f9f8; padding: 15px; border-left: 3px solid #d4af37; font-size: 12px;">
              <strong>Property Name:</strong> ${prop.name}<br/>
              <strong>Location:</strong> ${prop.location} (${prop.approxLocation})<br/>
              <strong>Finca Registry N°:</strong> ${prop.fincaRegistryNum || "___________"}<br/>
              <strong>Cataster Map N°:</strong> ${prop.catasterMapNum || "___________"}<br/>
              <strong>Minimum Listing Price (USD):</strong> $${prop.price.toLocaleString("en-US")} USD
            </p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLAUSE ONE: EXCLUSIVITY RIGHT</h3>
            <p>The Owner grants the Broker the exclusive right to market, advertise, display and negotiate the sale of the described property for an obligatory term of <strong>${contractTerm} months</strong> from the signing of this agreement.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLAUSE TWO: BROKERAGE FEES</h3>
            <p>In the event of a successful sale of the property to any buyer, the fees corresponding to the Broker shall be <strong>${contractCommission}% (percent) + VAT</strong> of the final agreed sale price, payable upon the execution of the deed of transfer.</p>
            
            ${racText}

            ${contractCustomClauses.trim() ? `
              <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLAUSE THREE: ADDITIONAL AGREED COVENANTS</h3>
              <p style="white-space: pre-wrap; font-style: italic;">${contractCustomClauses}</p>
            ` : ""}

            <div style="margin-top: 80px; display: flex; justify-content: space-between;">
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>IMAGINE S.A.</strong><br/>Authorized Broker</p>
              </div>
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>${lead.name}</strong><br/>Owner / Client</p>
              </div>
            </div>
          </div>
        `;
      }
    } else {
      if (contractLang === "es") {
        content = `
          <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #02140f; font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">ACUERDO DE PAGO DE COMISIÓN DE REAL ESTATE</h1>
              <p style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT</p>
            </div>
            
            <p>Este documento formaliza el acuerdo de pago de comisión por intermediación inmobiliaria celebrado al día <strong>${dateStr}</strong> entre <strong>IMAGINE S.A.</strong> (cédula jurídica <strong>${contractRepId}</strong>, rep. por <strong>${contractRepName}</strong>) y el Propietario/Cliente <strong>${lead.name}</strong>, para la promoción de la propiedad <strong>"${prop.nameEs || prop.name}"</strong> (Finca N° ${prop.fincaRegistryNum || "___________"}).</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA PRIMERA: INTERMEDIACIÓN Y COMISIÓN</h3>
            <p>Se acuerda formalmente que el comisionista recibirá el pago de una comisión correspondiente al <strong>${contractCommission}% (por ciento)</strong> del valor de venta final de la propiedad. Este acuerdo tiene una validez de <strong>${contractTerm} meses</strong>.</p>
            
            ${racText}

            ${contractCustomClauses.trim() ? `
              <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA CONDICIONAL PACTADA</h3>
              <p style="white-space: pre-wrap; font-style: italic;">${contractCustomClauses}</p>
            ` : ""}

            <div style="margin-top: 80px; display: flex; justify-content: space-between;">
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>IMAGINE S.A.</strong><br/>Representante</p>
              </div>
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>${lead.name}</strong><br/>Propietario / Cliente</p>
              </div>
            </div>
          </div>
        `;
      } else {
        content = `
          <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #02140f; font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">REAL ESTATE COMMISSION AGREEMENT</h1>
              <p style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT</p>
            </div>
            
            <p>This document formalizes the real estate commission payment agreement executed on <strong>${dateStr}</strong> by and between <strong>IMAGINE S.A.</strong> (Corporate ID <strong>${contractRepId}</strong>, represented by <strong>${contractRepName}</strong>) and the Owner/Client <strong>${lead.name}</strong>, for the promotion of the property <strong>"${prop.name}"</strong> (Finca N° ${prop.fincaRegistryNum || "___________"}).</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLAUSE ONE: INTERMEDIATION & FEES</h3>
            <p>It is formally agreed that the agent/broker shall receive a commission equivalent to <strong>${contractCommission}% (percent)</strong> of the final sale price of the property. This agreement shall remain valid for a term of <strong>${contractTerm} months</strong>.</p>
            
            ${racText}

            ${contractCustomClauses.trim() ? `
              <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLAUSE TWO: ADDITIONAL SPECIAL COVENANTS</h3>
              <p style="white-space: pre-wrap; font-style: italic;">${contractCustomClauses}</p>
            ` : ""}

            <div style="margin-top: 80px; display: flex; justify-content: space-between;">
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>IMAGINE S.A.</strong><br/>Representative</p>
              </div>
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>${lead.name}</strong><br/>Owner / Client</p>
              </div>
            </div>
          </div>
        `;
      }
    }

    setGeneratedContractHtml(content);
  };

  const handlePrintContract = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Contrato Imagine RE</title>
          <style>
            body { font-family: 'Georgia', serif; padding: 50px; background: white; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          ${generatedContractHtml}
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const triggerEmailContract = () => {
    const lead = leads.find(l => l.id === selectedContractLead);
    const prop = properties.find(p => p.id === selectedContractProp);
    if (!lead || !prop) return;

    setContractEmailStatus(lang === "es" ? "Preparando adjunto PDF y redactando correo..." : "Preparing PDF attachment and writing email...");
    
    setTimeout(() => {
      setContractEmailStatus(lang === "es" ? "Autenticando con servidor SMTP corporativo..." : "Authenticating with corporate SMTP server...");
    }, 1000);

    setTimeout(() => {
      setContractEmailStatus(
        lang === "es"
          ? `✓ Contrato PDF enviado exitosamente a: ${lead.email}`
          : `✓ Contract PDF successfully dispatched to: ${lead.email}`
      );
      setTimeout(() => setContractEmailStatus(null), 5000);
    }, 2800);
  };

  const triggerWhatsAppContract = () => {
    const lead = leads.find(l => l.id === selectedContractLead);
    const prop = properties.find(p => p.id === selectedContractProp);
    if (!lead || !prop) return;

    const docName = contractType === "pm"
      ? (lang === "es" ? "Contrato de Administración de Propiedad" : "Property Management Agreement")
      : contractType === "exclusive"
      ? (lang === "es" ? "Contrato de Exclusividad de Corretaje" : "Exclusive Brokerage Agreement")
      : (lang === "es" ? "Acuerdo de Comisión de Venta" : "Commission Agreement");

    const message = lang === "es"
      ? `Estimado/a ${lead.name},\n\nEs un placer saludarle de parte de IMAGINE Real Estate. Le adjuntamos para su revisión el borrador del ${docName} para la propiedad "${prop.nameEs || prop.name}" bajo las condiciones acordadas (${contractCommission}% de comisión y plazo de ${contractTerm} meses).\n\nQuedamos a su disposición para cualquier consulta.\n\nAtentamente,\n${contractRepName}\nIMAGINE Real Estate`
      : `Dear ${lead.name},\n\nGreetings from IMAGINE Real Estate. We have prepared and attached the draft of the ${docName} for the property "${prop.name}" for your review under the agreed terms (${contractCommission}% commission and a term of ${contractTerm} months).\n\nPlease let us know if you have any questions.\n\nBest regards,\n${contractRepName}\nIMAGINE Real Estate`;

    const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(lead.phone)}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      {/* Form parameters */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between h-fit">
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-pearl mb-4 border-b border-white/10 pb-3">
            {lang === "es" ? "Automatizador de Contratos Legales" : "Legal Contract Automator"}
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Seleccionar Cliente / Lead" : "Select Client / Lead"}
              </label>
              <div className="relative">
                <select
                  value={selectedContractLead}
                  onChange={e => setSelectedContractLead(e.target.value)}
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl appearance-none pr-10 focus:outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  <option value="">{lang === "es" ? "-- Elegir lead --" : "-- Choose lead --"}</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37] border-t-0 border-l-0 border-r-0">&#9662;</div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Seleccionar Propiedad" : "Select Property"}
              </label>
              <div className="relative">
                <select
                  value={selectedContractProp}
                  onChange={e => setSelectedContractProp(e.target.value)}
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl appearance-none pr-10 focus:outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  <option value="">{lang === "es" ? "-- Elegir propiedad --" : "-- Choose property --"}</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37] border-t-0 border-l-0 border-r-0">&#9662;</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Tipo de Contrato" : "Contract Template Type"}
              </label>
              <div className="relative">
                <select
                  value={contractType}
                  onChange={e => setContractType(e.target.value as any)}
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl appearance-none pr-10 focus:outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  <option value="pm">{lang === "es" ? "Administración de Propiedad (PM)" : "Property Management (PM)"}</option>
                  <option value="exclusive">{lang === "es" ? "Exclusividad de Corretaje" : "Exclusive Brokerage"}</option>
                  <option value="commission">{lang === "es" ? "Acuerdo de Comisión de Venta" : "Commission Agreement"}</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37] border-t-0 border-l-0 border-r-0">&#9662;</div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Idioma del Documento" : "Document Language"}
              </label>
              <div className="flex border border-white/10 p-0.5 rounded-xl bg-white/5 h-[37px] items-center">
                <button
                  type="button"
                  onClick={() => setContractLang("en")}
                  className={`flex-1 py-1 text-[10px] font-sans uppercase tracking-wider font-semibold rounded-lg transition h-full ${
                    contractLang === "en" ? "bg-[#d4af37] text-[#02140f] font-bold" : "text-gray-400 hover:text-pearl"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setContractLang("es")}
                  className={`flex-1 py-1 text-[10px] font-sans uppercase tracking-wider font-semibold rounded-lg transition h-full ${
                    contractLang === "es" ? "bg-[#d4af37] text-[#02140f] font-bold" : "text-gray-400 hover:text-pearl"
                  }`}
                >
                  Español
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Comisión de Negociación (%)" : "Negotiated Commission (%)"}
              </label>
              <input
                type="number"
                step="0.1"
                value={contractCommission}
                onChange={e => setContractCommission(Number(e.target.value))}
                className="w-full bg-[#01140f] border border-white/10 text-[#d4af37] font-semibold text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-sans"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Plazo de Vigencia (Meses)" : "Validity Term (Months)"}
              </label>
              <input
                type="number"
                value={contractTerm}
                onChange={e => setContractTerm(Number(e.target.value))}
                className="w-full bg-[#01140f] border border-white/10 text-[#d4af37] font-semibold text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Representante Legal" : "Legal Representative"}
              </label>
              <input
                type="text"
                value={contractRepName}
                onChange={e => setContractRepName(e.target.value)}
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-sans"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Cédula Jurídica / ID" : "Corporate ID / Passport"}
              </label>
              <input
                type="text"
                value={contractRepId}
                onChange={e => setContractRepId(e.target.value)}
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-sans"
              />
            </div>
          </div>

          {/* ADR / RAC Checkbox */}
          <div className="bg-[#01140f] border border-white/5 rounded-xl p-3 flex items-center justify-between">
            <div>
              <label className="block text-[9.5px] uppercase font-bold text-pearl tracking-wider">
                {lang === "es" ? "Resolución Alterna de Conflictos (RAC)" : "Alternative Dispute Resolution (RAC)"}
              </label>
              <p className="text-[8px] text-gray-400 mt-0.5 leading-relaxed">
                {lang === "es" ? "Someter controversias a arbitraje en la Cámara de Comercio de Costa Rica." : "Submit contract claims definitively to Costa Rican CCA arbitration."}
              </p>
            </div>
            <input 
              type="checkbox"
              checked={includeRac}
              onChange={e => setIncludeRac(e.target.checked)}
              className="accent-[#d4af37] w-4 h-4 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
              {lang === "es" ? "Cláusulas Especiales Adicionales" : "Special Additional Clauses"}
            </label>
            <textarea
              value={contractCustomClauses}
              onChange={e => setContractCustomClauses(e.target.value)}
              placeholder={
                lang === "es"
                  ? "Cláusulas especiales negociadas que se insertarán al final del contrato..."
                  : "Special negotiated clauses to insert at the end of the contract..."
              }
              rows={3}
              className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-sans resize-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={generateLegalContract}
          disabled={!selectedContractLead || !selectedContractProp}
          className="w-full bg-[#d4af37] text-[#02140f] hover:bg-white text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center disabled:opacity-50 disabled:pointer-events-none mt-2 transition"
        >
          {lang === "es" ? "Generar Contrato Legal" : "Generate Legal Contract"}
        </button>
      </div>

      {/* Preview and Export */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-[650px] overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3 flex items-center justify-between">
            <span>{lang === "es" ? "Vista Previa de Impresión PDF" : "PDF Print Template Preview"}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{lang === "es" ? "Documentos Corporativos" : "Branded Legal Documents"}</span>
          </h3>
          
          {generatedContractHtml ? (
            <div 
              className="border border-white/10 rounded-xl overflow-hidden overflow-y-auto bg-white flex-1 min-h-[300px]"
              dangerouslySetInnerHTML={{ __html: generatedContractHtml }}
            />
          ) : (
            <div className="py-24 text-center text-xs text-gray-400 font-light italic flex-1 flex items-center justify-center">
              {lang === "es" 
                ? "Complete los parámetros de la izquierda y genere el contrato para visualizar el borrador..."
                : "Fill the parameters on the left and generate the contract to review the draft..."
              }
            </div>
          )}
        </div>

        {contractEmailStatus && (
          <div className="mt-4 p-3 bg-black/60 rounded-xl border border-white/10 text-[10px] font-mono text-emerald-400 text-center">
            {contractEmailStatus}
          </div>
        )}

        {generatedContractHtml && (
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handlePrintContract}
              className="w-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-jungle text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center flex items-center justify-center gap-2 transition"
            >
              <Download size={14} />
              {lang === "es" ? "Descargar / Imprimir Contrato PDF" : "Download / Print Contract PDF"}
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={triggerEmailContract}
                className="bg-[#032219] hover:bg-[#043326] border border-white/10 text-pearl text-[10px] py-2.5 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center flex items-center justify-center gap-1.5 transition"
              >
                <Send size={12} className="text-[#d4af37]" />
                {lang === "es" ? "Enviar por Correo" : "Send via Email"}
              </button>
              
              <button
                type="button"
                onClick={triggerWhatsAppContract}
                className="bg-emerald-700 hover:bg-emerald-600 border border-emerald-600/30 text-pearl text-[10px] py-2.5 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center flex items-center justify-center gap-1.5 transition"
              >
                <MessageCircle size={12} />
                WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

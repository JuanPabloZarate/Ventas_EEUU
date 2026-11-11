'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';

export interface HeroSectionProps {
  ctaHref?: string;
  className?: string;
}

export function HeroSection({
  ctaHref = '/registro',
  className = '',
}: HeroSectionProps) {
  return (
    <section
      className={`relative w-full overflow-hidden text-white py-16 sm:py-24 lg:py-28 border-b border-white/10 ${className}`}
    >
      {/* Imagen de Fondo: New York nevada, luces navideñas y bolsas de Black Friday */}
      <div className="absolute inset-0 select-none pointer-events-none">
        <Image
          src="/hero-ny-black-friday-christmas.jpg"
          alt="Black Friday en Nueva York con Compras y Luces Navideñas en Manhattan"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-105"
        />
        {/* Capas de superposición para legibilidad impecable y atmósfera cálida */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#0b1426]/75 to-[#080d1a]/85 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#080d1a]/40 to-[#080d1a]"></div>
      </div>

      {/* Contenido Central */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        {/* Badge Temático: Black Friday + Navidad */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-white text-xs font-semibold border border-white/20 backdrop-blur-md shadow-sm">
          <span className="text-secondary-fixed">🎄 Compras Navideñas</span>
          <span className="text-white/40">•</span>
          <span className="text-amber-300 font-bold">Black Friday NYC</span>
          <span className="text-white/40">•</span>
          <span className="text-slate-200">Vuelo Directo a Bolivia</span>
        </div>

        {/* Titular Principal */}
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight drop-shadow-md">
          Magia Navideña desde Manhattan: <br />
          <span className="text-secondary-fixed">Aprovecha hasta 70% OFF en Black Friday</span> <br className="hidden sm:inline" />
          <span className="text-white">y recíbelo en Bolivia antes de Navidad.</span>
        </h1>

        {/* Subtítulo enfocado en regalos y tiendas físicas */}
        <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto font-sans leading-relaxed drop-shadow-sm">
          Lleva la magia de la 5ta Avenida y Manhattan a tu hogar. Compramos tus regalos en{' '}
          <strong className="text-white font-semibold">Apple, Sephora, Nike, Best Buy y Coach</strong>{' '}
          con tarifa plana de <strong className="text-amber-300 font-bold">$9.50/Lb</strong> y entregas garantizadas en Bolivia desde el 4 de Diciembre.
        </p>

        {/* Acciones principales */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={ctaHref}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-sans font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Icon name="redeem" size={17} />
            <span>Pedir Regalo / Compra Asistida</span>
          </Link>
          <a
            href="#ofertas-estrella"
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-white/20 backdrop-blur-md"
          >
            <span>Ver Ofertas de Temporada</span>
            <Icon name="arrow_downward" size={15} />
          </a>
        </div>

        {/* Micro-garantía festiva */}
        <div className="pt-4 flex items-center justify-center gap-4 sm:gap-6 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <Icon name="verified" size={15} className="text-secondary-fixed" />
            <span>Garantía Entrega 24 de Diciembre</span>
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="flex items-center gap-1.5">
            <Icon name="flight_land" size={15} className="text-secondary-fixed" />
            <span>Retiro en SCZ, LPB y CBBA</span>
          </span>
        </div>

      </div>
    </section>
  );
}

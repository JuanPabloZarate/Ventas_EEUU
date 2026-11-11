import React from 'react';

export function BrandLogo({ type }: { type: string }) {
  switch (type) {
    case 'sephora':
      return (
        <div className="bg-black text-white px-2 py-1 rounded-lg flex items-center justify-center font-serif text-[11px] font-black tracking-[0.25em] shadow-xs">
          SEPHORA
        </div>
      );
    case 'macys':
      return (
        <div className="bg-white p-1 rounded-lg flex items-center justify-center border border-red-100 shadow-xs">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#E11A2B]">
            <path d="M12 2l2.95 6.63 7.19.6-5.45 4.8 1.62 7.02L12 17.38l-6.31 3.67 1.62-7.02-5.45-4.8 7.19-.6z" />
          </svg>
        </div>
      );
    case 'nike':
      return (
        <div className="bg-black text-white p-1.5 rounded-lg flex items-center justify-center shadow-xs">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M21.7 5.3c-2.3 2.4-5.7 5.6-10.4 9.1-2.6 1.9-4.5 2.9-5.7 2.9-.9 0-1.6-.4-1.9-1.3-.5-1.1-.1-2.7 1-4.6 1.1-2 2.7-3.7 4.5-5.2.6-.5 1-.5 1.3-.2.3.3.2.7-.3 1.4-1.7 2.1-2.9 3.9-3.4 5.5-.3.8-.3 1.4 0 1.8.2.3.7.4 1.3.4 1-.1 2.4-.8 4.2-2.3 4.4-3.6 7.8-6.7 10.2-9.2.2-.2.5-.2.7 0 .1.2.1.5-.1.7z" />
          </svg>
        </div>
      );
    case 'bestbuy':
      return (
        <div className="bg-[#FFE000] text-black px-1.5 py-0.5 rounded-lg flex flex-col items-center justify-center border border-amber-400/50 leading-none shadow-xs">
          <span className="text-[8px] font-sans font-black tracking-tighter">BEST</span>
          <span className="text-[8px] font-sans font-black tracking-tighter">BUY</span>
        </div>
      );
    case 'coach':
      return (
        <div className="bg-[#1f1a17] text-[#e0b868] px-2 py-0.5 rounded-lg flex flex-col items-center justify-center border border-[#e0b868]/30 shadow-xs">
          <span className="text-[9.5px] font-serif font-black tracking-widest leading-none">COACH</span>
          <span className="text-[5.5px] tracking-wider text-slate-300 font-sans">NEW YORK</span>
        </div>
      );
    case 'victorias-secret':
      return (
        <div className="bg-[#111111] text-[#f4a0b7] px-2 py-1 rounded-lg flex items-center justify-center font-serif text-[9px] font-black tracking-widest shadow-xs border border-[#f4a0b7]/40">
          VICTORIA&apos;S SECRET
        </div>
      );
    case 'adidas':
      return (
        <div className="bg-black text-white p-1 rounded-lg flex items-center justify-center shadow-xs">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M8.6 17.5L5.7 13.9C5.4 13.5 4.8 13.4 4.4 13.7L1.6 15.6C1.2 15.9 1.1 16.5 1.4 16.9L5.3 22.3C5.6 22.7 6.2 22.8 6.6 22.5L9.4 20.6C9.8 20.3 9.9 19.7 9.6 19.3L8.6 17.5ZM14.9 12.8L10.3 6.9C10 6.5 9.4 6.4 9 6.7L6.2 8.6C5.8 8.9 5.7 9.5 6 9.9L11.6 17.6C11.9 18 12.5 18.1 12.9 17.8L15.7 15.9C16.1 15.6 16.2 15 15.9 14.6L14.9 12.8ZM21.2 8.1L14.9 .1C14.6 -.3 14 -.4 13.6 -.1L10.8 1.8C10.4 2.1 10.3 2.7 10.6 3.1L17.9 12.9C18.2 13.3 18.8 13.4 19.2 13.1L22 11.2C22.4 10.9 22.5 10.3 22.2 9.9L21.2 8.1Z" />
          </svg>
        </div>
      );
    case 'amazon':
      return (
        <div className="bg-[#131921] text-white px-2 py-1 rounded-lg flex flex-col items-center justify-center border border-white/10 shadow-xs">
          <span className="text-[10px] font-sans font-black leading-none tracking-tight">amazon</span>
          <svg viewBox="0 0 36 8" className="w-6 h-1.5 mt-0.5">
            <path d="M2 2 Q 18 10 34 2" fill="none" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M31 1 L 35 2 L 32 5 Z" fill="#FF9900" />
          </svg>
        </div>
      );
    case 'target':
      return (
        <div className="bg-white p-1 rounded-lg flex items-center justify-center border border-red-100 shadow-xs">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <circle cx="12" cy="12" r="11" fill="#CC0000" />
            <circle cx="12" cy="12" r="7.33" fill="#FFFFFF" />
            <circle cx="12" cy="12" r="3.67" fill="#CC0000" />
          </svg>
        </div>
      );
    case 'apple':
      return (
        <div className="bg-black text-white p-1.5 rounded-lg flex items-center justify-center shadow-xs">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.2c.67-.82 1.13-1.96 1-3.1-.98.04-2.16.66-2.86 1.48-.61.71-1.15 1.87-1.01 2.98 1.09.08 2.2-.54 2.87-1.36z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-6 h-6 rounded-lg bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface">
          ★
        </div>
      );
  }
}

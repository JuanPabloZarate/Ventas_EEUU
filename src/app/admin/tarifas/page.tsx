import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TarifasAdminView } from '@/components/admin/TarifasAdminView';

export const metadata: Metadata = {
  title: 'Administración de Tarifas por Producto | Compras EEUU',
  description: 'Panel de gestión y administración de tarifas de flete y comisión según el producto comprado.',
};

export default function AdminTarifasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
      {/* Header */}
      <Navbar whatsappNumber="59177012345" />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <TarifasAdminView />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

import React from 'react';
import { ShieldCheck, Users, Tractor, CalendarDays, CreditCard, Database } from 'lucide-react';

export default function AdminDashboard({ users, machines, bookings }) {
  const paidBookings = bookings.filter((booking) => booking.status === 'ongoing' || booking.status === 'completed');
  const grossVolume = paidBookings.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0);
  const commission = grossVolume * 0.1;
  const suppliers = users.filter((user) => user.role === 'supplier');
  const farmers = users.filter((user) => user.role === 'farmer');

  const cards = [
    { label: 'Utilisateurs', value: users.length, icon: Users, tone: 'text-agri-green bg-agri-green/10' },
    { label: 'Machines', value: machines.length, icon: Tractor, tone: 'text-agri-dark bg-gray-100' },
    { label: 'Réservations', value: bookings.length, icon: CalendarDays, tone: 'text-agri-gold bg-amber-50' },
    { label: 'Commission', value: `${commission.toLocaleString('fr-FR')} FCFA`, icon: CreditCard, tone: 'text-emerald-600 bg-emerald-50' }
  ];

  return (
    <div className="py-12 bg-agri-bg min-h-screen px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-agri-dark rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-agri-gold/20 text-agri-gold flex items-center justify-center">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-agri-gold">Back-office</span>
              <h1 className="text-2xl font-bold font-outfit">Administration AGRILOC</h1>
              <p className="text-xs text-gray-300 mt-1">Pilotage des comptes, machines, réservations et revenus plateforme.</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs">
            <Database className="h-4 w-4 inline mr-2 text-agri-light" />
            MySQL opérationnel
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className={`h-11 w-11 rounded-xl ${card.tone} flex items-center justify-center mb-4`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{card.label}</span>
                <div className="text-xl font-black text-gray-800 font-outfit mt-1">{card.value}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-800">Comptes utilisateurs</h2>
              <p className="text-[10px] text-gray-400 mt-1">{farmers.length} agriculteurs · {suppliers.length} fournisseurs</p>
            </div>
            <div className="divide-y divide-gray-100">
              {users.map((user) => (
                <div key={user.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-gray-800">{user.companyName || user.fullName}</div>
                    <div className="text-[11px] text-gray-400">{user.email} · {user.city}, {user.region}</div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-lg bg-gray-100 text-gray-600">{user.role}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-800">Réservations récentes</h2>
              <p className="text-[10px] text-gray-400 mt-1">Suivi opérationnel et financier</p>
            </div>
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => {
                const machine = machines.find((item) => item.id === booking.machineId);
                return (
                  <div key={booking.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-gray-800">{machine?.name || booking.machineId}</div>
                      <div className="text-[11px] text-gray-400">
                        {booking.farmer?.name || 'Client'} · {booking.startDate} au {booking.endDate}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-agri-green">{Number(booking.totalPrice).toLocaleString('fr-FR')} FCFA</div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">{booking.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

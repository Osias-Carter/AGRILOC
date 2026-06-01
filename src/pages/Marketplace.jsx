import React from 'react';
import { Search, MapPin, SlidersHorizontal, Star, Info, Tractor, Fuel, ShieldAlert } from 'lucide-react';

export default function Marketplace({ machines, filters, setFilters, onSelectMachine }) {
  
  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value });
  };

  const handleRegionChange = (e) => {
    setFilters({ ...filters, region: e.target.value });
  };

  const handlePriceChange = (e) => {
    setFilters({ ...filters, maxPrice: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      region: '',
      maxPrice: ''
    });
  };

  // Filter logic
  const filteredMachines = machines.filter((m) => {
    const matchesCategory = filters.category ? m.category === filters.category : true;
    const matchesRegion = filters.region ? m.location_region === filters.region : true;
    const matchesPrice = filters.maxPrice ? m.daily_price <= parseInt(filters.maxPrice) : true;
    // Don't show rented items if needed, but showing them as 'rented' is fine
    return matchesCategory && matchesRegion && matchesPrice;
  });

  return (
    <div className="py-12 bg-agri-bg min-h-screen px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Title & Stats Banner */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-agri-light uppercase tracking-widest">Marketplace AGRILOC</span>
            <h1 className="text-3xl font-bold font-outfit text-agri-dark">Équipements agricoles disponibles</h1>
            <p className="text-xs text-gray-500 font-light">Trouvez et réservez des machines inspectées prêtes pour le labour, la récolte ou l'irrigation.</p>
          </div>
          <div className="bg-white/80 border border-gray-200/50 px-4 py-2 rounded-2xl text-xs font-semibold text-gray-600 shadow-sm">
            Total trouvé : <span className="text-agri-green font-bold">{filteredMachines.length} machines</span>
          </div>
        </div>

        {/* Filters and List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-28">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center text-gray-800 font-bold font-outfit text-base">
                  <SlidersHorizontal className="h-4.5 w-4.5 mr-2 text-agri-light" />
                  <span>Filtres avancés</span>
                </div>
                <button 
                  onClick={resetFilters} 
                  className="text-xs font-bold text-gray-400 hover:text-agri-light transition-all"
                >
                  Effacer
                </button>
              </div>

              {/* 1. Category filter */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Type d'équipement</label>
                <select 
                  value={filters.category}
                  onChange={handleCategoryChange}
                  className="w-full bg-agri-bg border border-gray-200/80 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-agri-light focus:ring-1 focus:ring-agri-light"
                >
                  <option value="">Tous les équipements</option>
                  <option value="Tracteur">Tracteur</option>
                  <option value="Motoculteur">Motoculteur</option>
                  <option value="Moissonneuse">Moissonneuse-batteuse</option>
                  <option value="Pulvérisateur">Pulvérisateur</option>
                  <option value="Pompe">Pompe d'irrigation</option>
                </select>
              </div>

              {/* 2. Region filter */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Région du Togo</label>
                <select 
                  value={filters.region}
                  onChange={handleRegionChange}
                  className="w-full bg-agri-bg border border-gray-200/80 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-agri-light focus:ring-1 focus:ring-agri-light"
                >
                  <option value="">Toutes les régions</option>
                  <option value="Maritime">Maritime (Lomé, Tsévié)</option>
                  <option value="Plateaux">Plateaux (Atakpamé, Kpalimé)</option>
                  <option value="Centrale">Centrale (Sokodé)</option>
                  <option value="Kara">Kara (Kara)</option>
                  <option value="Savanes">Savanes (Dapaong)</option>
                </select>
              </div>

              {/* 3. Max Price filter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                  <span className="uppercase tracking-wider">Tarif journalier max</span>
                  <span className="text-agri-green">{filters.maxPrice ? `${parseInt(filters.maxPrice).toLocaleString('fr-FR')} FCFA` : 'Illimité'}</span>
                </div>
                <input 
                  type="range" 
                  min="10000" 
                  max="200000" 
                  step="5000"
                  value={filters.maxPrice || 200000}
                  onChange={handlePriceChange}
                  className="w-full accent-agri-light h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>10K FCFA</span>
                  <span>200K FCFA</span>
                </div>
              </div>

              {/* Info box */}
              <div className="p-4 bg-agri-green/5 border border-agri-green/10 rounded-2xl flex items-start space-x-2.5">
                <Info className="h-4.5 w-4.5 text-agri-light flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-agri-green leading-relaxed">
                  Toutes les locations incluent un chauffeur qualifié et une couverture d'assistance technique de base au Togo.
                </p>
              </div>

            </div>
          </div>

          {/* Machine List Grid */}
          <div className="lg:col-span-3">
            {filteredMachines.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl border border-gray-100 shadow-sm text-center max-w-lg mx-auto space-y-4">
                <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto text-gray-400">
                  <ShieldAlert className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-bold font-outfit text-gray-800">Aucune machine ne correspond aux filtres</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Essayez d'élargir votre recherche en réinitialisant les filtres de région ou de catégorie.
                </p>
                <button 
                  onClick={resetFilters} 
                  className="px-6 py-2.5 bg-agri-green hover:bg-agri-light text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:scale-105"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMachines.map((machine) => (
                  <div 
                    key={machine.id} 
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:translate-y-[-6px] hover:shadow-lg flex flex-col justify-between"
                  >
                    
                    {/* Image Header with Badge */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img 
                        src={machine.images && machine.images[0] ? machine.images[0] : 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=600'} 
                        alt={machine.name} 
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Category Badge */}
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-agri-green shadow-sm border border-white/50">
                        {machine.category}
                      </span>

                      {/* Status Badge */}
                      <span className={`absolute top-4 right-4 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border text-white ${
                        machine.status === 'available' 
                          ? 'bg-agri-light/85 border-agri-light/20'
                          : 'bg-red-500/85 border-red-500/20'
                      }`}>
                        {machine.status === 'available' ? 'Disponible' : 'Réservée'}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{machine.brand_model || 'Standard model'}</span>
                          
                          {/* Rating */}
                          <div className="flex items-center text-agri-gold space-x-1">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span className="text-xs font-bold text-gray-700">{machine.average_rating || '5.0'}</span>
                          </div>
                        </div>

                        <h3 className="text-base font-bold font-outfit text-gray-800 leading-tight">
                          {machine.name}
                        </h3>
                        
                        <p className="text-[11px] text-gray-500 font-light line-clamp-2">
                          {machine.description || 'Équipement de qualité premium, idéal pour vos travaux agricoles au Togo.'}
                        </p>
                      </div>

                      {/* Technical characteristics specs badge row */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                        <div className="flex items-center text-[10px] text-gray-500">
                          <Fuel className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                          <span>{machine.power_hp ? `${machine.power_hp} HP` : 'Chauffeur inclus'}</span>
                        </div>
                        <div className="flex items-center text-[10px] text-gray-500">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                          <span className="truncate">{machine.location_city} ({machine.location_region})</span>
                        </div>
                      </div>

                      {/* Footer Row pricing & button */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-2">
                        <div>
                          <span className="text-[10px] text-gray-400 block font-bold uppercase">Tarif par jour</span>
                          <span className="text-base font-extrabold font-outfit text-agri-green">
                            {parseInt(machine.daily_price).toLocaleString('fr-FR')} <span className="text-xs font-medium">FCFA</span>
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => onSelectMachine(machine)}
                          className="px-4 py-2.5 bg-gradient-to-r from-agri-green to-agri-light hover:from-agri-light hover:to-agri-green text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:scale-105"
                        >
                          Détails & Réserver
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

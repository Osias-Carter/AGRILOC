import React, { useState } from 'react';
import { Tractor, PlusCircle, CreditCard, Users, CheckCircle, XCircle, BarChart3, MapPin, Fuel, Coins } from 'lucide-react';

export default function SupplierDashboard({ bookings, machines, currentUser, users, onAddMachine, onAcceptBooking, onRejectBooking }) {
  const [activeTab, setActiveTab] = useState('bookings');
  
  // New Machine Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tracteur');
  const [brandModel, setBrandModel] = useState('');
  const [powerHp, setPowerHp] = useState('');
  const [dailyPrice, setDailyPrice] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationRegion, setLocationRegion] = useState('Maritime');
  const [description, setDescription] = useState('');
  const [imageSearchQuery, setImageSearchQuery] = useState('tractor'); // to mock elegant pictures

  // Calculation of statistics
  const visibleMachines = currentUser?.role === 'admin'
    ? machines
    : machines.filter((machine) => !machine.supplierId || machine.supplierId === currentUser?.id);
  const visibleMachineIds = new Set(visibleMachines.map((machine) => machine.id));
  const visibleBookings = currentUser?.role === 'admin'
    ? bookings
    : bookings.filter((booking) => visibleMachineIds.has(booking.machineId));

  const supplierMachinesCount = visibleMachines.length;
  
  // Calculate revenue: sum of paid bookings (ongoing or completed, or simply simulated as successful payment)
  const paidBookings = visibleBookings.filter(b => b.status === 'ongoing' || b.status === 'completed');
  const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice * 0.9, 0); // 90% goes to owner, 10% commission

  const pendingBookings = visibleBookings.filter(b => b.status === 'pending');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !dailyPrice || !locationCity) {
      alert("Veuillez remplir les champs obligatoires.");
      return;
    }

    // Images par catégorie (machines de référence AGRILOC)
    const categoryImages = {
      Tracteur: '/machines/massey-ferguson-375.png',
      Motoculteur: '/machines/kubota-krt140.png',
      Moissonneuse: '/machines/john-deere-w330.png',
      Pulvérisateur: '/machines/agrator-1200l.png',
      Pompe: '/machines/lorentz-pompe.png',
    };
    const imageUrl = categoryImages[category] || '/machines/massey-ferguson-375.png';

    const newMachine = {
      name,
      category,
      brand_model: brandModel,
      power_hp: powerHp ? parseInt(powerHp) : null,
      daily_price: parseFloat(dailyPrice),
      location_city: locationCity,
      location_region: locationRegion,
      description,
      images: [imageUrl],
      status: 'available',
      average_rating: 5.0
    };

    onAddMachine(newMachine);
    
    // Clear form fields
    setName('');
    setBrandModel('');
    setPowerHp('');
    setDailyPrice('');
    setLocationCity('');
    setDescription('');
    
    // Alert and swap tab back
    alert("Votre équipement a été publié avec succès ! Il est instantanément visible sur la Marketplace.");
    setActiveTab('bookings');
  };

  return (
    <div className="py-12 bg-agri-bg min-h-screen px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Profile Info Banner */}
        <div className="bg-gradient-to-br from-agri-dark to-black rounded-3xl p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-agri-light rounded-2xl flex items-center justify-center font-bold text-2xl shadow shadow-agri-light/20">
              AT
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold font-outfit">AgriTech Togo S.A.</h1>
                <span className="text-[10px] bg-agri-gold/20 text-agri-gold border border-agri-gold/20 font-bold px-2 py-0.5 rounded uppercase tracking-wider">Fournisseur Premium</span>
              </div>
              <p className="text-xs text-gray-300 font-light">Flotte certifiée d'équipements de pointe • Lomé & Sokodé, Togo</p>
            </div>
          </div>
          <div className="flex space-x-3.5 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <div className="text-center px-4 border-r border-white/10">
              <span className="text-lg font-bold text-agri-gold block font-outfit">{supplierMachinesCount}</span>
              <span className="text-[9px] text-gray-300 uppercase tracking-widest">Ma Flotte</span>
            </div>
            <div className="text-center px-4">
              <span className="text-lg font-bold text-agri-light block font-outfit">
                {totalRevenue.toLocaleString('fr-FR')} <span className="text-xs font-normal">XOF</span>
              </span>
              <span className="text-[9px] text-gray-300 uppercase tracking-widest font-medium">Revenus Nets</span>
            </div>
          </div>
        </div>

        {/* Analytical Analytics Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Demandes en attente</span>
              <span className="text-2xl font-black font-outfit text-agri-dark">{pendingBookings.length} réservations</span>
            </div>
            <div className="h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Revenus Nets Partenaire</span>
              <span className="text-2xl font-black font-outfit text-agri-green">{totalRevenue.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="h-12 w-12 bg-agri-green/10 rounded-2xl flex items-center justify-center text-agri-green">
              <Coins className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Commission Platform (10%)</span>
              <span className="text-2xl font-black font-outfit text-agri-gold">
                {visibleBookings.filter(b => b.status === 'ongoing' || b.status === 'completed').reduce((sum, b) => sum + b.totalPrice * 0.1, 0).toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <div className="h-12 w-12 bg-agri-gold/10 rounded-2xl flex items-center justify-center text-agri-gold">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>

        </div>

        {/* Tab Selection Navigation */}
        <div className="flex space-x-2 mb-8 bg-white border border-gray-100 p-1.5 rounded-2xl w-fit shadow-sm">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bookings' 
                ? 'bg-agri-dark text-white shadow-sm'
                : 'text-gray-500 hover:text-agri-dark'
            }`}
          >
            Demandes de Réservation ({visibleBookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center ${
              activeTab === 'products' 
                ? 'bg-agri-dark text-white shadow-sm'
                : 'text-gray-500 hover:text-agri-dark'
            }`}
          >
            <Tractor className="h-4 w-4 mr-1.5 text-agri-light" />
            Mes Produits ({visibleMachines.length})
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center ${
              activeTab === 'add' 
                ? 'bg-agri-dark text-white shadow-sm'
                : 'text-gray-500 hover:text-agri-dark'
            }`}
          >
            <PlusCircle className="h-4 w-4 mr-1.5 text-agri-light" />
            Ajouter un équipement
          </button>
        </div>

        {/* Dynamic Tab Body Contents */}
        {activeTab === 'bookings' && (
          
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-800 font-outfit">Suivi logistique des contrats</h3>
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Mise à jour instantanée</span>
              </div>

              {visibleBookings.length === 0 ? (
                <div className="p-16 text-center text-xs text-gray-400">
                  Aucune demande de réservation reçue pour le moment.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {visibleBookings.map((booking) => {
                    const machine = visibleMachines.find((m) => m.id === booking.machineId) || machines.find((m) => m.id === booking.machineId);
                    return (
                      <div key={booking.id} className="p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        
                        {/* Equipment and dates */}
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="h-14 w-14 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                            <img 
                              src={machine?.images?.[0] || '/machines/massey-ferguson-375.png'} 
                              alt={machine?.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] text-agri-green font-bold uppercase tracking-wider">{machine?.category}</span>
                              <span className="text-[9px] text-gray-400 font-semibold">• ID: #{booking.id.substring(0, 8)}</span>
                            </div>
                            <h4 className="text-sm font-bold text-gray-800 font-outfit mt-0.5">{machine?.name}</h4>
                            <p className="text-xs text-gray-400 font-light mt-0.5">
                              Du <strong>{booking.startDate}</strong> au <strong>{booking.endDate}</strong> ({booking.totalDays} jours)
                            </p>
                          </div>
                        </div>

                        {/* Customer profile and delivery */}
                        <div className="space-y-1 min-w-[200px]">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Client (Agriculteur)</span>
                          <p className="text-xs font-bold text-gray-700">Koffi Kouma (Atakpamé)</p>
                          {booking.deliveryRequired ? (
                            <span className="text-[9px] bg-amber-50 text-amber-500 border border-amber-100 px-2 py-0.5 rounded block w-fit">
                              🚚 Livraison requise : {booking.deliveryAddress}
                            </span>
                          ) : (
                            <span className="text-[9px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded block w-fit">
                              Récupération chez le fournisseur
                            </span>
                          )}
                        </div>

                        {/* Total Price */}
                        <div className="min-w-[140px]">
                          <span className="text-[10px] text-gray-400 block font-bold uppercase">Montant Brut</span>
                          <span className="text-sm font-black font-outfit text-agri-green">
                            {parseInt(booking.totalPrice * 0.9).toLocaleString('fr-FR')} FCFA
                          </span>
                          <span className="text-[8px] text-gray-400 block mt-0.5">(90% Net reversé)</span>
                        </div>

                        {/* Actions buttons */}
                        <div className="flex items-center space-x-3 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 lg:justify-end">
                          
                          {booking.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => onAcceptBooking(booking.id)}
                                className="flex-1 lg:flex-initial px-4 py-2 bg-gradient-to-r from-agri-green to-agri-light hover:scale-105 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1 shadow-sm transition-all"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Accepter</span>
                              </button>
                              
                              <button 
                                onClick={() => onRejectBooking(booking.id)}
                                className="flex-1 lg:flex-initial px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 border border-red-100 transition-colors"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>Refuser</span>
                              </button>
                            </>
                          )}

                          {booking.status === 'confirmed' && (
                            <span className="px-4 py-2 bg-blue-50 text-blue-500 border border-blue-100 rounded-xl text-xs font-bold w-full lg:w-auto text-center">
                              Attente Paiement Client (Mobile Money)
                            </span>
                          )}

                          {booking.status === 'ongoing' && (
                            <span className="px-4 py-2 bg-green-50 text-agri-light border border-green-100 rounded-xl text-xs font-bold flex items-center space-x-1 justify-center w-full lg:w-auto">
                              <span className="h-2 w-2 rounded-full bg-agri-light animate-ping mr-1"></span>
                              <span>Paiement Validé - Chantier Actif</span>
                            </span>
                          )}

                          {booking.status === 'completed' && (
                            <span className="px-4 py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-semibold w-full lg:w-auto text-center">
                              Travaux Terminés & Réglés
                            </span>
                          )}

                          {booking.status === 'cancelled' && (
                            <span className="px-4 py-2 bg-red-50 text-red-500 border border-red-100 rounded-xl text-xs font-bold w-full lg:w-auto text-center">
                              Contrat Rejeté
                            </span>
                          )}

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>

        )}

        {activeTab === 'add' && (
          
          /* ======================================= */
          /* FORMULAIRE D'AJOUT DE MACHINE AGRICOLE  */
          /* ======================================= */
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-3xl mx-auto text-left">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-lg font-bold font-outfit text-gray-800">Ajouter un équipement à louer</h3>
              <p className="text-xs text-gray-400 font-light mt-0.5">Votre machine sera directement inspectée par nos techniciens régionaux puis publiée sur la marketplace.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nom commercial de l'équipement *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Massey Ferguson 385 4WD, etc."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-agri-light"
                  />
                </div>

                {/* 2. Category */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Catégorie *</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-agri-light"
                  >
                    <option value="Tracteur">Tracteur</option>
                    <option value="Motoculteur">Motoculteur</option>
                    <option value="Moissonneuse">Moissonneuse-batteuse</option>
                    <option value="Pulvérisateur">Pulvérisateur</option>
                    <option value="Pompe">Pompe d'irrigation</option>
                  </select>
                </div>

                {/* 3. Model & Brand */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Marque & Modèle précis</label>
                  <input 
                    type="text"
                    placeholder="Kubota KRT140, etc."
                    value={brandModel}
                    onChange={(e) => setBrandModel(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-agri-light"
                  />
                </div>

                {/* 4. Horsepower */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Puissance en chevaux (HP)</label>
                  <input 
                    type="number"
                    placeholder="75, 120 (Optionnel)"
                    value={powerHp}
                    onChange={(e) => setPowerHp(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-agri-light"
                  />
                </div>

                {/* 5. Daily Price */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tarif journalier en FCFA *</label>
                  <input 
                    type="number"
                    required
                    placeholder="75000"
                    value={dailyPrice}
                    onChange={(e) => setDailyPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-agri-light font-bold text-agri-green"
                  />
                </div>

                {/* 6. Location City */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ville de garage *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Atakpamé, Sokodé, etc."
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-agri-light"
                  />
                </div>

                {/* 7. Location Region */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Région Administrative *</label>
                  <select 
                    value={locationRegion}
                    onChange={(e) => setLocationRegion(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-agri-light"
                  >
                    <option value="Maritime">Maritime (Lomé, Tsévié)</option>
                    <option value="Plateaux">Plateaux (Atakpamé, Kpalimé)</option>
                    <option value="Centrale">Centrale (Sokodé)</option>
                    <option value="Kara">Kara (Kara)</option>
                    <option value="Savanes">Savanes (Dapaong)</option>
                  </select>
                </div>

              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description de l'état technique & conditions de location</label>
                <textarea 
                  rows="4"
                  placeholder="Décrivez précisément l'état de l'équipement, sa consommation, si le transport est à la charge du locataire, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-agri-light"
                ></textarea>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start space-x-2.5">
                <Tractor className="h-4.5 w-4.5 text-agri-light flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-500 leading-relaxed font-light">
                  En publiant cet équipement, vous certifiez sur l'honneur détenir la propriété légale ou les droits exclusifs d'exploitation de la machine. Un inspecteur AGRILOC de votre région vous contactera pour valider l'état mécanique sous 24 heures.
                </p>
              </div>

              {/* Submit button */}
              <button 
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-agri-green to-agri-light hover:scale-102 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <PlusCircle className="h-4.5 w-4.5" />
                <span>Publier mon équipement sur AGRILOC</span>
              </button>

            </form>
          </div>

        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-gray-800 font-outfit">Mes Équipements Référés ({visibleMachines.length})</h3>
                <p className="text-xs text-gray-400 font-light mt-0.5">Consultez l'état et la disponibilité de votre matériel agricole.</p>
              </div>
              <button
                onClick={() => setActiveTab('add')}
                className="px-4 py-2.5 bg-agri-green text-white font-bold text-xs rounded-xl flex items-center shadow transition-all hover:scale-105"
              >
                <PlusCircle className="h-4 w-4 mr-1.5" />
                Ajouter un équipement
              </button>
            </div>

            {visibleMachines.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center text-xs text-gray-400">
                Vous n'avez publié aucun produit pour le moment. Cliquez sur "Ajouter un équipement" pour commencer.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleMachines.map((machine) => (
                  <div key={machine.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="h-40 w-full bg-gray-100 relative overflow-hidden">
                      <img 
                        src={machine.images?.[0] || '/machines/massey-ferguson-375.png'} 
                        alt={machine.name} 
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                        machine.status === 'available' ? 'bg-green-100 text-green-700' :
                        machine.status === 'rented' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {machine.status === 'available' && 'Disponible'}
                        {machine.status === 'rented' && 'Loué'}
                        {machine.status === 'maintenance' && 'Maintenance'}
                      </span>
                    </div>
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between animate-fade-in">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{machine.category}</span>
                        <h4 className="text-sm font-bold text-gray-800 font-outfit leading-snug">{machine.name}</h4>
                        {machine.brand_model && (
                          <p className="text-[11px] text-gray-500 font-light">{machine.brand_model}</p>
                        )}
                        <p className="text-[11px] text-gray-400 flex items-center mt-1">
                          <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                          {machine.location_city}, {machine.location_region}
                        </p>
                      </div>
                      <div className="pt-3.5 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-sm font-black font-outfit text-agri-green">
                          {parseInt(machine.daily_price).toLocaleString('fr-FR')} <span className="text-[10px] font-normal text-gray-400">FCFA / jour</span>
                        </span>
                        <div className="flex items-center text-xs font-bold text-agri-gold bg-amber-500/5 px-2 py-1 rounded-lg">
                          ⭐ {machine.average_rating || '5.0'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

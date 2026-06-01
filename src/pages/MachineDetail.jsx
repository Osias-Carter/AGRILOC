import React, { useState } from 'react';
import { X, Star, MapPin, Fuel, ShieldCheck, Calendar, ArrowRight, CheckCircle2, CreditCard, ArrowLeft, Smartphone } from 'lucide-react';

export default function MachineDetail({ machine, onClose, onCreateBooking, currentUserId }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deliveryRequired, setDeliveryRequired] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  // Gestion des étapes et du formulaire de paiement
  const [step, setStep] = useState('booking'); // 'booking' ou 'payment'
  const [paymentMethod, setPaymentMethod] = useState('tmoney'); // 'tmoney', 'flooz', 'stripe'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  
  // États de simulation (comme un backend)
  const [isPaying, setIsPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  if (!machine) return null;

  // 1. Calcul des frais de location en local
  let totalDays = 0;
  let rawPrice = 0;
  let serviceFee = 0;
  let totalPrice = 0;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    if (timeDiff >= 0) {
      totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      rawPrice = totalDays * machine.daily_price;
      serviceFee = rawPrice * 0.1; // 10% commission AgriLoc
      totalPrice = rawPrice + serviceFee;
    }
  }

  // Étape 1 : Envoi de la demande au fournisseur
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (totalDays <= 0) {
      setErrorMsg("Veuillez sélectionner des dates valides.");
      return;
    }
    setErrorMsg('');
    if (onCreateBooking) {
      onCreateBooking({
        machineId: machine.id,
        machineName: machine.name,
        startDate,
        endDate,
        totalDays,
        totalPrice,
        deliveryRequired,
        deliveryAddress: deliveryRequired ? deliveryAddress : ''
      });
    }
  };

  // Étape 2 : Simulation du traitement Backend (sans aucun fetch !)
  const handleFinalPaySubmit = (e) => {
    e.preventDefault();
    setIsPaying(true);
    setErrorMsg('');

    // On simule une latence réseau/serveur de 2 secondes (comme sur AcademiaLMS)
    setTimeout(() => {
      // Simulation d'une validation de sécurité basique côté "client-backend"
      if (paymentMethod !== 'stripe' && !phoneNumber) {
        setErrorMsg("Veuillez entrer un numéro Mobile Money valide.");
        setIsPaying(false);
        return;
      }
      if (paymentMethod === 'stripe' && !cardNumber) {
        setErrorMsg("Veuillez entrer un numéro de carte valide.");
        setIsPaying(false);
        return;
      }

      // Génération de fausses données d'insertion (simule le insertId de la BDD)
      const fakePaiementId = Math.floor(Math.random() * 9000) + 1000;
      const fakeLocationId = Math.floor(Math.random() * 9000) + 1000;

      // Structure de l'objet de réservation simulé
      const fakeBookingData = {
        id: fakeLocationId,
        machineId: machine.id,
        machineName: machine.name,
        startDate,
        endDate,
        totalDays,
        totalPrice,
        deliveryRequired,
        deliveryAddress: deliveryRequired ? deliveryAddress : '',
        paiement: {
          id: fakePaiementId,
          montant: totalPrice,
          methode: paymentMethod.toUpperCase(),
          compte: paymentMethod === 'stripe' ? cardNumber : phoneNumber,
          date: new Date().toLocaleDateString('fr-FR')
        },
        status: 'VALIDE'
      };

      setIsPaying(false);
      
      // Message de succès comme sur ton projet précédent
      alert(`🎉 [SIMULATION] Paiement réussi pour "${machine.name}" !\n\n• ID Paiement : #${fakePaiementId}\n• ID Réservation : #${fakeLocationId}\n• Montant : ${totalPrice.toLocaleString('fr-FR')} FCFA via ${paymentMethod.toUpperCase()}`);
      
      // On injecte les données dans le state parent de ton application React
      if (onCreateBooking) {
        onCreateBooking(fakeBookingData);
      }
      
      // Fermeture de la modale
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-agri-dark/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-gray-100/50 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Bouton de fermeture */}
        <button 
          onClick={onClose}
          disabled={isPaying}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur hover:bg-gray-100 text-gray-700 rounded-full shadow transition-all border border-gray-200 disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Côté Gauche : Détails de la machine */}
        <div className="md:w-1/2 overflow-y-auto p-6 space-y-6">
          <div className="h-64 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
            <img 
              src={machine.images && machine.images[0] ? machine.images[0] : 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=600'} 
              alt={machine.name} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-agri-light uppercase tracking-widest">{machine.category}</span>
              <div className="flex items-center text-agri-gold space-x-1">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-xs font-bold text-gray-700">{machine.average_rating || '5.0'}</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold font-outfit text-gray-800 leading-snug">{machine.name}</h2>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-4 w-4 text-agri-light mr-1.5" />
              <span>{machine.location_city}, Région des {machine.location_region}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-4 bg-agri-bg rounded-2xl border border-gray-100 flex items-center space-x-3">
              <Fuel className="h-5 w-5 text-agri-green" />
              <div>
                <span className="text-[10px] text-gray-400 block font-bold uppercase">Puissance</span>
                <span className="text-xs font-bold text-gray-700">{machine.power_hp ? `${machine.power_hp} HP` : 'Chauffeur inclus'}</span>
              </div>
            </div>
            <div className="p-4 bg-agri-bg rounded-2xl border border-gray-100 flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-agri-green" />
              <div>
                <span className="text-[10px] text-gray-400 block font-bold uppercase">Contrôle</span>
                <span className="text-xs font-bold text-gray-700">Inspecté / Conforme</span>
              </div>
            </div>
          </div>
        </div>

        {/* Côté Droit : Gestion du workflow (Dates -> Formulaire de Paiement) */}
        <div className="md:w-1/2 bg-gray-50 p-6 flex flex-col justify-between overflow-y-auto border-t md:border-t-0 md:border-l border-gray-200/50">
          
          {step === 'booking' ? (
            /* ================= ÉCRAN 1 : FORMULAIRE DE RÉSERVATION ================= */
            <div className="space-y-6 flex flex-col h-full justify-between">
              <div className="space-y-6">
                <div className="border-b border-gray-200/60 pb-4">
                  <h3 className="text-lg font-bold font-outfit text-gray-800">Planifier vos travaux</h3>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Simulez vos dates et envoyez la demande au fournisseur.</p>
                </div>

                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date de début</label>
                      <input 
                        type="date"
                        required
                        value={startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date de fin</label>
                      <input 
                        type="date"
                        required
                        value={endDate}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer text-xs font-bold text-gray-700 select-none">
                      <input 
                        type="checkbox"
                        checked={deliveryRequired}
                        onChange={(e) => setDeliveryRequired(e.target.checked)}
                        className="h-4.5 w-4.5 accent-agri-light rounded cursor-pointer"
                      />
                      <span>Demander l'acheminement au champ ?</span>
                    </label>
                    {deliveryRequired && (
                      <input 
                        type="text"
                        required
                        placeholder="Saisir la localité au Togo (ex: Kara, Blitta)"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      />
                    )}
                  </div>

                  {totalDays > 0 && (
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-2.5">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{parseInt(machine.daily_price).toLocaleString('fr-FR')} FCFA x {totalDays} j</span>
                        <span className="font-semibold text-gray-700">{rawPrice.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Frais de service AgriLoc (10%)</span>
                        <span className="font-semibold text-gray-700">{serviceFee.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center text-sm font-bold text-gray-800">
                        <span>Coût Total (Simulé)</span>
                        <span className="text-base text-agri-green font-extrabold font-outfit">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={totalDays <= 0}
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md ${
                      totalDays > 0 ? 'bg-gradient-to-r from-agri-green to-agri-light text-white hover:scale-[1.01]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Calendar className="h-4.5 w-4.5" />
                    <span>Envoyer la demande de réservation</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>

          ) : (
            /* ================= ÉCRAN 2 : PASSERELLE DE PAIEMENT SIMULÉE ================= */
            <div className="space-y-6 flex flex-col h-full justify-between">
              <div className="space-y-6">
                <div className="border-b border-gray-200/60 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-outfit text-gray-800">Guichet de Paiement</h3>
                    <p className="text-xs text-gray-400 font-light mt-0.5">Simulation de débit en cours.</p>
                  </div>
                  <button
                    type="button"
                    disabled={isPaying}
                    onClick={() => setStep('booking')}
                    className="text-xs font-bold text-agri-light hover:text-agri-green flex items-center space-x-1"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Retour</span>
                  </button>
                </div>

                <div className="bg-agri-green/5 border border-agri-green/10 p-4 rounded-2xl flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-700">Montant à régler :</span>
                  <span className="text-lg font-extrabold text-agri-green font-outfit">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleFinalPaySubmit} className="space-y-4">
                  {/* Choix du mode locale */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Moyen de paiement</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        disabled={isPaying}
                        onClick={() => setPaymentMethod('tmoney')}
                        className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center space-y-1 ${
                          paymentMethod === 'tmoney' ? 'border-agri-green bg-emerald-50 text-agri-green' : 'border-gray-200 bg-white text-gray-600'
                        }`}
                      >
                        <span className="text-base">🇹🇬</span>
                        <span>T-Money</span>
                      </button>
                      <button
                        type="button"
                        disabled={isPaying}
                        onClick={() => setPaymentMethod('flooz')}
                        className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center space-y-1 ${
                          paymentMethod === 'flooz' ? 'border-agri-green bg-emerald-50 text-agri-green' : 'border-gray-200 bg-white text-gray-600'
                        }`}
                      >
                        <span className="text-base">🇹🇬</span>
                        <span>Flooz</span>
                      </button>
                      <button
                        type="button"
                        disabled={isPaying}
                        onClick={() => setPaymentMethod('stripe')}
                        className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center space-y-1 ${
                          paymentMethod === 'stripe' ? 'border-agri-green bg-emerald-50 text-agri-green' : 'border-gray-200 bg-white text-gray-600'
                        }`}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Stripe</span>
                      </button>
                    </div>
                  </div>

                  {/* Inputs conditionnels */}
                  {paymentMethod === 'stripe' ? (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Numéro de Carte de Simulation</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          disabled={isPaying}
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-mono focus:outline-none"
                        />
                        <CreditCard className="h-4 w-4 text-gray-400 absolute left-3 top-3.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Numéro Mobile Money (Togo)</label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          disabled={isPaying}
                          placeholder="ex: 90 12 34 56"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-xs focus:outline-none"
                        />
                        <Smartphone className="h-4 w-4 text-gray-400 absolute left-3 top-3.5" />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPaying}
                    className="w-full mt-4 py-3.5 bg-agri-green hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
                  >
                    {isPaying ? (
                      <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="uppercase font-mono tracking-wider">Traitement {paymentMethod.toUpperCase()}...</span>
                      </div>
                    ) : (
                      <>
                        <ShieldCheck className="h-4.5 w-4.5" />
                        <span>Simuler le Paiement final</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-gray-200/60 flex items-center space-x-2 text-[10px] text-gray-400 font-semibold justify-center">
                <CheckCircle2 className="h-4 w-4 text-agri-light" />
                <span className="uppercase tracking-wider">Validation locale instantanée</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

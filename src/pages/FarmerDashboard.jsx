import React, { useState } from 'react';
import { ShieldCheck, Calendar, CreditCard, MessageSquare, Send, CheckCircle2, Phone, Check, X, Tractor } from 'lucide-react';
import Marketplace from './Marketplace';
import confetti from 'canvas-confetti';

export default function FarmerDashboard({ bookings, machines, currentUser, onPayBooking, chatMessages, onSendMessage, filters, setFilters, onSelectMachine }) {
  const [activeTab, setActiveTab] = useState('bookings');
  
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardName, setCardName] = useState('Koffi Kouma');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/30');
  const [cardCvc, setCardCvc] = useState('123');
  const [paymentError, setPaymentError] = useState('');
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [paymentStep, setPaymentStep] = useState(1); // 1 = input, 2 = processing, 3 = success

  // Chat message input
  const [typedMessage, setTypedMessage] = useState('');

  // Find machine details for bookings
  const visibleBookings = currentUser?.role === 'admin'
    ? bookings
    : bookings.filter((booking) => !booking.farmerId || booking.farmerId === currentUser?.id);

  const enrichedBookings = visibleBookings.map((b) => {
    const machine = machines.find((m) => m.id === b.machineId);
    return {
      ...b,
      machine
    };
  });

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleStartPayment = (booking) => {
    setSelectedBookingForPayment(booking);
    setPaymentMethod('stripe');
    setPhoneNumber('');
    setCardName('Koffi Kouma');
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/30');
    setCardCvc('123');
    setPaymentError('');
    setPaymentReceipt(null);
    setPaymentStep(1);
  };

  const handleProcessPaymentSubmit = (e) => {
    e.preventDefault();

    if (!selectedBookingForPayment) return;

    if (paymentMethod === 'stripe') {
      const digits = cardNumber.replace(/\D/g, '');
      if (digits !== '4242424242424242') {
        setPaymentError('Utilisez la carte Stripe de test 4242 4242 4242 4242 pour valider la simulation.');
        return;
      }
      if (!cardName.trim() || !/^\d{2}\/\d{2}$/.test(cardExpiry) || cardCvc.replace(/\D/g, '').length < 3) {
        setPaymentError('Veuillez renseigner le nom, une expiration MM/AA et un CVC valide.');
        return;
      }
    } else if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 8) {
      setPaymentError("Veuillez saisir un numéro de téléphone togolais valide à 8 chiffres minimum.");
      return;
    }

    setPaymentError('');
    setPaymentStep(2);

    setTimeout(() => {
      const receipt = {
        id: `pay_${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
        method: paymentMethod,
        last4: paymentMethod === 'stripe' ? cardNumber.replace(/\D/g, '').slice(-4) : phoneNumber.replace(/\D/g, '').slice(-4),
        amount: selectedBookingForPayment.totalPrice,
        createdAt: new Date().toLocaleString('fr-FR')
      };

      setPaymentReceipt(receipt);
      setPaymentStep(3);
      onPayBooking(selectedBookingForPayment.id, receipt);
      triggerConfetti();
    }, 2500);
  };

  const handleSendMessageSubmit = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    onSendMessage(typedMessage);
    setTypedMessage('');
  };

  return (
    <div className="py-12 bg-agri-bg min-h-screen px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Profile Info Banner */}
        <div className="bg-gradient-to-br from-agri-green to-[#133519] rounded-3xl p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center font-bold text-2xl border border-white/20">
              KK
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold font-outfit">{currentUser?.fullName || 'Koffi Kouma'}</h1>
                <span className="text-[10px] bg-agri-light/20 text-agri-light border border-agri-light/20 font-bold px-2 py-0.5 rounded uppercase tracking-wider">Producteur Vérifié</span>
              </div>
              <p className="text-xs text-gray-300 font-light">Agriculteur membre depuis mai 2026 • Atakpamé, Togo</p>
            </div>
          </div>
          <div className="flex space-x-3.5 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <div className="text-center px-4 border-r border-white/10">
              <span className="text-lg font-bold text-agri-gold block font-outfit">{visibleBookings.length}</span>
              <span className="text-[9px] text-gray-300 uppercase tracking-widest">Réservations</span>
            </div>
            <div className="text-center px-4">
              <span className="text-lg font-bold text-agri-gold block font-outfit">
                {visibleBookings.filter(b => b.status === 'completed').length}
              </span>
              <span className="text-[9px] text-gray-300 uppercase tracking-widest font-medium">Chantiers clos</span>
            </div>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex space-x-2 mb-8 bg-white border border-gray-100 p-1.5 rounded-2xl w-fit shadow-sm">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bookings' 
                ? 'bg-agri-green text-white shadow-sm'
                : 'text-gray-500 hover:text-agri-green'
            }`}
          >
            Mes Réservations ({visibleBookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center ${
              activeTab === 'chat' 
                ? 'bg-agri-green text-white shadow-sm'
                : 'text-gray-500 hover:text-agri-green'
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Messagerie & Support
          </button>
          <button 
            onClick={() => setActiveTab('marketplace')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center ${
              activeTab === 'marketplace' 
                ? 'bg-agri-green text-white shadow-sm'
                : 'text-gray-500 hover:text-agri-green'
            }`}
          >
            <Tractor className="h-4.5 w-4.5 mr-1.5" />
            Louer un équipement (Marketplace)
          </button>
        </div>

        {/* Dynamic Tab Body Contents */}
        {activeTab === 'bookings' && (
          
          <div className="space-y-6">
            {enrichedBookings.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl border border-gray-100 shadow-sm text-center max-w-lg mx-auto space-y-4">
                <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto text-gray-400">
                  <Calendar className="h-10 w-10 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold font-outfit text-gray-800">Aucune réservation en cours</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Vous n'avez réservé aucun équipement agricole pour le moment. Parcourez la marketplace pour équiper vos labours ou récoltes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {enrichedBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-all"
                  >
                    
                    {/* Left: Machine Image and Name */}
                    <div className="flex flex-col sm:flex-row gap-5 flex-1">
                      <div className="h-28 w-full sm:w-40 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                        <img 
                          src={booking.machine?.images?.[0] || 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=600'} 
                          alt={booking.machine?.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] bg-agri-green/5 text-agri-green font-bold px-2 py-0.5 rounded uppercase">
                            {booking.machine?.category || 'Machine'}
                          </span>
                          <span className="text-xs text-gray-400 font-semibold">• ID: #{booking.id.substring(0, 8)}</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-800 font-outfit">
                          {booking.machine?.name || 'Nom de la machine'}
                        </h3>
                        
                        {/* Dates */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 font-light">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                            <span>Du <strong>{booking.startDate}</strong> au <strong>{booking.endDate}</strong> ({booking.totalDays} jours)</span>
                          </div>
                        </div>

                        {/* Delivery address if chosen */}
                        {booking.deliveryRequired && (
                          <div className="text-[11px] bg-gray-50 text-gray-500 px-3 py-1.5 rounded-xl border border-gray-100 w-fit">
                            🚚 Livraison au champ: <span className="font-semibold text-gray-600">{booking.deliveryAddress}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle: Status & Step Tracker */}
                    <div className="md:w-1/4 flex flex-col justify-center space-y-3.5 border-t md:border-t-0 md:border-l md:border-r border-gray-100 md:px-6">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Statut réservation</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`h-2.5 w-2.5 rounded-full ${
                            booking.status === 'pending' ? 'bg-amber-400' :
                            booking.status === 'confirmed' ? 'bg-sky-400' :
                            booking.status === 'ongoing' ? 'bg-agri-light animate-ping' :
                            booking.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></span>
                          <span className="text-xs font-bold text-gray-700 uppercase">
                            {booking.status === 'pending' && 'Attente Validation'}
                            {booking.status === 'confirmed' && 'Confirmé / À payer'}
                            {booking.status === 'ongoing' && 'Travaux en cours'}
                            {booking.status === 'completed' && 'Service Terminé'}
                            {booking.status === 'cancelled' && 'Annulé'}
                          </span>
                        </div>
                      </div>

                      {/* Micro Step details */}
                      <div className="text-[10px] text-gray-400 leading-normal">
                        {booking.status === 'pending' && 'Le propriétaire vérifie son calendrier.'}
                        {booking.status === 'confirmed' && 'Demande acceptée par le fournisseur ! Veuillez payer pour bloquer la date.'}
                        {booking.status === 'ongoing' && 'Le chauffeur est actif sur votre champ.'}
                        {booking.status === 'completed' && 'Chantier clos avec succès.'}
                      </div>
                    </div>

                    {/* Right: Price & Mobile Money CTA */}
                    <div className="md:w-1/4 flex flex-col justify-between items-end text-right border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold uppercase">Montant total</span>
                        <span className="text-lg font-black font-outfit text-agri-green">
                          {parseInt(booking.totalPrice).toLocaleString('fr-FR')} <span className="text-xs font-medium">FCFA</span>
                        </span>
                        <span className="text-[8px] text-gray-400 block mt-0.5">Taxes & Commission de 10% incluses</span>
                      </div>

                      {/* Payment Action CTA */}
                      {booking.status === 'confirmed' && (
                        <button 
                          onClick={() => handleStartPayment(booking)}
                          className="mt-4 px-5 py-2.5 bg-agri-gold hover:bg-agri-gold/90 text-agri-dark font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all hover:scale-105"
                        >
                          <CreditCard className="h-4 w-4" />
                          <span>Payer maintenant</span>
                        </button>
                      )}

                      {booking.status === 'ongoing' && (
                        <span className="text-xs font-bold text-agri-green bg-agri-green/5 border border-agri-green/10 px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 mt-4">
                          <CheckCircle2 className="h-4 w-4 text-agri-light" />
                          <span>{booking.payment?.method === 'stripe' ? 'Payé par Stripe' : 'Paiement validé'}</span>
                        </span>
                      )}

                      {booking.status === 'completed' && (
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 mt-4">
                          <Check className="h-4 w-4" />
                          <span>Travaux Clos</span>
                        </span>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        )}

        {activeTab === 'chat' && (
          
          /* MESSAGING SUPPORT / CHAT */
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[520px]">
            
            {/* Chat Header */}
            <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-agri-green rounded-full flex items-center justify-center text-white font-bold">
                  AG
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-800">Support Client AGRILOC / Propriétaires</h3>
                  <div className="flex items-center text-[10px] text-gray-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-agri-light mr-1.5 animate-ping"></span>
                    <span>Conseiller disponible en ligne (Lomé)</span>
                  </div>
                </div>
              </div>
              <a 
                href="https://wa.me/22890000000" 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-[10px] font-bold flex items-center shadow-sm"
              >
                <Phone className="h-3.5 w-3.5 mr-1" />
                WhatsApp Direct
              </a>
            </div>

            {/* Chat Message Box Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
              
              {/* Default Welcome Message */}
              <div className="flex items-start space-x-2.5 max-w-[80%]">
                <div className="h-7 w-7 bg-agri-green rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                  A
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 text-xs text-gray-700 shadow-sm leading-relaxed">
                  Bonjour Koffi ! Bienvenue sur la messagerie sécurisée AGRILOC. Vous pouvez poser vos questions sur l'acheminement des machines de Kpalimé ou de Sokodé directement ici.
                </div>
              </div>

              {/* Chat state rendering */}
              {chatMessages.map((msg) => {
                const isFarmer = msg.sender === 'farmer';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex items-start space-x-2.5 max-w-[80%] ${
                      isFarmer ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${
                      isFarmer ? 'bg-agri-light' : 'bg-agri-green'
                    }`}>
                      {isFarmer ? 'K' : 'F'}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs shadow-sm leading-relaxed ${
                      isFarmer 
                        ? 'bg-agri-green text-white rounded-tr-none' 
                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                      <span className={`block text-[8px] mt-1 text-right ${isFarmer ? 'text-white/60' : 'text-gray-400'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* Message Input Form Footer */}
            <form onSubmit={handleSendMessageSubmit} className="border-t border-gray-100 p-4 flex gap-3.5 bg-white">
              <input 
                type="text" 
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Rédigez votre message pour le fournisseur ou le support technique..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-agri-light"
              />
              <button 
                type="submit"
                className="px-5 bg-agri-green hover:bg-agri-light text-white rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>

        )}

        {activeTab === 'marketplace' && (
          <div className="animate-fade-in bg-white border border-gray-100 shadow-sm rounded-3xl p-6">
            <Marketplace 
              machines={machines} 
              filters={filters}
              setFilters={setFilters}
              onSelectMachine={onSelectMachine}
            />
          </div>
        )}

      </div>

      {/* ============================================== */}
      {/* 4. STRIPE / MOBILE MONEY PAYMENT SIMULATOR      */}
      {/* ============================================== */}
      {selectedBookingForPayment && (
        <div className="fixed inset-0 z-50 bg-agri-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 border border-gray-100/50 space-y-6 text-left animate-slide-up relative">
            
            {/* Close Button */}
            <button 
              onClick={() => {
                setSelectedBookingForPayment(null);
                setPaymentStep(1);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {paymentStep === 1 && (
              <form onSubmit={handleProcessPaymentSubmit} className="space-y-5">
                <div className="space-y-1.5 border-b border-gray-100 pb-3">
                  <h3 className="text-lg font-bold font-outfit text-gray-800">Paiement sécurisé AGRILOC</h3>
                  <p className="text-xs text-gray-400 font-light">Simulation Stripe recommandée, sans débit réel.</p>
                </div>

                <div className="bg-agri-green/5 border border-agri-green/10 rounded-2xl p-3 flex justify-between text-xs font-semibold text-gray-700">
                  <span>Montant à régler :</span>
                  <span className="text-agri-green font-extrabold text-sm">{parseInt(selectedBookingForPayment.totalPrice).toLocaleString('fr-FR')} FCFA</span>
                </div>

                {/* Payment method selector */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Moyen de paiement</label>
                  <div className="grid grid-cols-3 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5 ${
                        paymentMethod === 'stripe' 
                          ? 'border-agri-green bg-emerald-50 ring-1 ring-agri-green' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard className="h-5 w-5 text-agri-green" />
                      <span className="text-xs font-black text-gray-800">Stripe</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase">Test</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('tmoney')}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5 ${
                        paymentMethod === 'tmoney' 
                          ? 'border-agri-gold bg-amber-500/5 ring-1 ring-agri-gold' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm font-black text-amber-500">T-MONEY</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase">Togocom</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('flooz')}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5 ${
                        paymentMethod === 'flooz' 
                          ? 'border-agri-light bg-green-500/5 ring-1 ring-agri-light' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm font-black text-blue-600">FLOOZ</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase">Moov</span>
                    </button>

                  </div>
                </div>

                {paymentMethod === 'stripe' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nom sur la carte</label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-agri-light"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Carte Stripe de test</label>
                        <input
                          type="text"
                          required
                          inputMode="numeric"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-mono font-semibold focus:outline-none focus:border-agri-light"
                        />
                        <span className="text-[9px] text-gray-400 block">Carte acceptée: 4242 4242 4242 4242. Aucune transaction réelle.</span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Expiration</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/AA"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-agri-light"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">CVC</label>
                        <input
                          type="text"
                          required
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-agri-light"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Numéro de téléphone togolais</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">+228</span>
                      <input 
                        type="tel"
                        required
                        placeholder="90 12 34 56"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\s+/g, ''))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-14 pr-4 text-sm font-semibold focus:outline-none focus:border-agri-light"
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 block">Simulation de push USSD T-Money/Flooz.</span>
                  </div>
                )}

                {paymentError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-semibold">
                    {paymentError}
                  </div>
                )}

                {/* Submit button */}
                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-agri-green to-agri-light hover:scale-102 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>{paymentMethod === 'stripe' ? 'Simuler le paiement Stripe' : 'Lancer la demande Mobile Money'}</span>
                </button>
              </form>
            )}

            {paymentStep === 2 && (
              <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
                
                {/* Circular spinner */}
                <div className="h-16 w-16 border-4 border-agri-green/10 border-t-agri-light rounded-full animate-spin"></div>
                
                <div className="space-y-2">
                  <h4 className="text-base font-bold font-outfit text-gray-800">
                    {paymentMethod === 'stripe' ? 'Autorisation Stripe en cours...' : 'Demande Push USSD envoyée...'}
                  </h4>
                  <p className="text-xs text-gray-500 max-w-xs font-light leading-relaxed">
                    {paymentMethod === 'stripe'
                      ? `AGRILOC simule une autorisation, une capture et une mise en séquestre de ${parseInt(selectedBookingForPayment.totalPrice).toLocaleString('fr-FR')} FCFA.`
                      : `Veuillez vérifier votre téléphone portable et valider la transaction de ${parseInt(selectedBookingForPayment.totalPrice).toLocaleString('fr-FR')} FCFA.`}
                  </p>
                </div>

                <div className="px-4 py-2 bg-gray-100 rounded-xl text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {paymentMethod === 'stripe' ? 'Vérification 3D Secure simulée...' : 'En attente de validation USSD...'}
                </div>

              </div>
            )}

            {paymentStep === 3 && (
              <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center animate-fade-in">
                
                {/* Check circle */}
                <div className="h-16 w-16 bg-agri-light/10 border-2 border-agri-light rounded-full flex items-center justify-center text-agri-light shadow-lg">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-lg font-bold font-outfit text-gray-800">Paiement effectué avec succès !</h4>
                  <p className="text-xs text-gray-500 max-w-xs font-light leading-relaxed">
                    Félicitations Koffi, votre paiement de {parseInt(selectedBookingForPayment.totalPrice).toLocaleString('fr-FR')} FCFA a été traité. Votre équipement est désormais définitivement réservé.
                  </p>
                </div>

                {paymentReceipt && (
                  <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left space-y-2">
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Référence</span>
                      <span className="font-mono font-bold text-gray-700">{paymentReceipt.id}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Moyen</span>
                      <span className="font-bold text-gray-700 uppercase">{paymentReceipt.method} •••• {paymentReceipt.last4}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Date</span>
                      <span className="font-bold text-gray-700">{paymentReceipt.createdAt}</span>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => {
                    setSelectedBookingForPayment(null);
                    setPaymentStep(1);
                  }}
                  className="px-8 py-2.5 bg-agri-green hover:bg-agri-light text-white text-xs font-bold rounded-xl transition-all shadow"
                >
                  Fermer
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

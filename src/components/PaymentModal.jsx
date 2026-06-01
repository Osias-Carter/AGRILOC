import React, { useState } from 'react';

export default function PaymentModal({ isOpen, onClose, amount, onPaymentSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('tmoney'); // tmoney, flooz, ou carte

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);

    // Simulation du délai réseau (3 secondes)
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(); // Déclenche la fonction de succès (ex: validation de la location)
      onClose(); // Ferme le modal
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Finaliser la réservation</h3>
        
        <p className="text-gray-600 mb-4">
          Montant à régler : <span className="font-semibold text-emerald-600">{amount} FCFA</span>
        </p>

        {/* Sélection du mode de paiement */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-gray-700">Choisir le mode de paiement</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={isProcessing}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="tmoney">T-Money (Simulé)</option>
            <option value="flooz">Flooz (Simulé)</option>
            <option value="stripe">Carte Bancaire / Stripe (Simulé)</option>
          </select>
        </div>

        {/* Boutons d'action */}
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            Annuler
          </button>
          
          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium flex items-center justify-center min-w-[140px] hover:bg-emerald-700 transition-colors disabled:opacity-70"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Traitement...</span>
              </div>
            ) : (
              "Confirmer le paiement"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
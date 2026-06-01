import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Support Technique');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !message) {
      alert("Veuillez saisir votre nom et votre message.");
      return;
    }
    alert(`Merci ${name} ! Votre demande concernant "${subject}" a été envoyée. Notre équipe de Lomé vous contactera dans les plus brefs délais.`);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="py-16 bg-agri-bg min-h-screen px-4 animate-fade-in text-left">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="mb-12 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-agri-light uppercase tracking-widest block">Contact & Support</span>
          <h1 className="text-3xl md:text-4xl font-bold font-outfit text-agri-dark">Nous sommes à votre écoute</h1>
          <p className="text-xs text-gray-400 font-light">Une question ? Un besoin d'assistance technique sur votre champ ? Contactez nos conseillers territoriaux.</p>
        </div>

        {/* Contact Info and Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Column 1: Info list & WhatsApp */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Direct Information Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-base font-bold font-outfit text-gray-800">Nos coordonnées</h3>
              
              <div className="space-y-4 text-xs text-gray-500 font-light">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-agri-green mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-700 block">Siège principal</span>
                    <span>Quartier Nukafu, Lomé, Togo</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-agri-green mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-700 block">Téléphone direct</span>
                    <span>+228 92 28 99 50</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-agri-green mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-700 block">E-mail support</span>
                    <span>agriloc@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-agri-green mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-700 block">Heures d'ouverture</span>
                    <span>Lundi - Vendredi : 08h00 - 18h00 <br />Samedi : 08h00 - 13h00</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Premium WhatsApp quick connect Card */}
            <div className="bg-gradient-to-br from-green-600 to-[#123118] p-6 rounded-3xl text-white shadow-lg space-y-4">
              <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                <MessageCircle className="h-5.5 w-5.5 text-white" />
              </div>
              <h4 className="text-sm font-bold font-outfit">Conseiller WhatsApp Direct</h4>
              <p className="text-[11px] text-green-100 font-light leading-relaxed">
                Idéal pour les agriculteurs sur le terrain. Envoyez-nous un message vocal WhatsApp pour une prise de contact immédiate.
              </p>
              <a 
                href="https://wa.me/22892289950" 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-2.5 bg-white text-green-700 hover:bg-green-50 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow transition-all active:scale-95"
              >
                <span>Discuter sur WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Column 2: Modern Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-base font-bold font-outfit text-gray-800">Envoyer un message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Votre nom complet *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jean Kossi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-agri-light"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Votre adresse e-mail</label>
                    <input 
                      type="email" 
                      placeholder="jean.kossi@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-agri-light"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Objet du message *</label>
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-agri-light"
                  >
                    <option value="Support Technique">Assistance technique (Panne machine, Chauffeur...)</option>
                    <option value="Partenariat Flotte">Devenir Fournisseur (Proposer mes tracteurs)</option>
                    <option value="Paiements">Problème de facturation (T-Money, Flooz...)</option>
                    <option value="Investissement">Investir / Presse & Partenariat</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Votre message *</label>
                  <textarea 
                    rows="5"
                    required
                    placeholder="Décrivez précisément votre besoin..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-agri-light"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-agri-green to-agri-light hover:scale-102 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <Send className="h-4 w-4" />
                  <span>Envoyer ma demande</span>
                </button>
              </form>

            </div>
          </div>

        </div>

        {/* Section: Stylized Map Card mockup */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-800 font-outfit">Localisation de notre agence</h3>
              <p className="text-[10px] text-gray-400 font-light">Nukafu, Lomé, Togo</p>
            </div>
            <span className="text-[10px] bg-agri-green/5 text-agri-green font-bold px-2 py-0.5 rounded flex items-center">
              <Globe className="h-3.5 w-3.5 mr-1" />
              Togo National Hub
            </span>
          </div>

          <div className="h-64 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center relative">
            
            {/* Styled Map Background Grid representation */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] bg-[size:24px_24px]"></div>
            
            {/* Styled Streets Representation */}
            <div className="absolute top-1/2 left-0 right-0 h-4 bg-gray-200"></div>
            <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-gray-200"></div>

            {/* Bouncing office locator marker */}
            <div className="absolute top-[45%] left-[30%] flex flex-col items-center marker-animate z-10">
              <div className="p-2.5 bg-agri-green border-2 border-white rounded-full shadow-lg text-white">
                <MapPin className="h-5 w-5 fill-current" />
              </div>
              <span className="text-[9px] font-black bg-agri-dark text-white px-2 py-0.5 rounded border border-agri-light/30 shadow mt-1">
                BUREAU AGRILOC (NUKAFU)
              </span>
            </div>

            <span className="text-[10px] text-gray-400 select-none font-light z-0 uppercase tracking-widest">
              Avenue de la libération / Boulevard circulaire
            </span>

          </div>
        </div>

      </div>
    </div>
  );
}

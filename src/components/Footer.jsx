import React from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, ArrowUpRight } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-agri-dark text-gray-300 pt-16 pb-8 border-t border-agri-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center cursor-pointer" onClick={() => handleLinkClick('home')}>
              <img
                src="/logo.png"
                alt="AGRILOC"
                className="h-10 w-auto object-contain mr-3"
              />
              <span className="text-xl font-bold font-outfit text-white tracking-wide">
                AGRI<span className="text-agri-light">LOC</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              La première marketplace agritech intelligente au Togo. Nous connectons les producteurs aux équipements modernes pour transformer l'agriculture locale.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              <a href="#" className="p-2 bg-white/5 hover:bg-agri-light rounded-xl hover:text-white transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-agri-light rounded-xl hover:text-white transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-agri-light rounded-xl hover:text-white transition-all">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base font-outfit">Liens rapides</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleLinkClick('home')} className="hover:text-agri-light transition-colors flex items-center">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('marketplace')} className="hover:text-agri-light transition-colors flex items-center">
                  Marketplace <ArrowUpRight className="h-3 w-3 ml-1 text-agri-gold" />
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-agri-light transition-colors flex items-center">
                  À Propos
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('contact')} className="hover:text-agri-light transition-colors flex items-center">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Info */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base font-outfit">Siège & Bureau</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2.5 text-agri-light flex-shrink-0 mt-0.5" />
                <span>Quartier Nukafu, Lomé, Togo</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4.5 w-4.5 mr-2.5 text-agri-light flex-shrink-0" />
                <span>+228 92 28 99 50</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4.5 w-4.5 mr-2.5 text-agri-light flex-shrink-0" />
                <span>agriloc@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base font-outfit">Restez connecté</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Inscrivez-vous pour recevoir les dernières offres d'équipements et les conseils de récolte.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-agri-light focus:ring-1 focus:ring-agri-light transition-all"
              />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1.5 p-2 bg-agri-light hover:bg-agri-light/85 text-white rounded-lg transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-4 md:space-y-0">
          <p>© {currentYear} AGRILOC TG. Slogan : “La mécanisation agricole accessible partout”</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gray-400 transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Conditions générales d'utilisation</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

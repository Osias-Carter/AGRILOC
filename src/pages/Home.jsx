import React, { useState } from 'react';
import { Search, MapPin, Tractor, Compass, ArrowRight, ShieldCheck, CreditCard, Award, UserCheck, Star, Sparkles } from 'lucide-react';

export default function Home({ setActivePage, setFilters }) {
  const [searchCategory, setSearchCategory] = useState('');
  const [searchRegion, setSearchRegion] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({
      category: searchCategory,
      region: searchRegion,
      maxPrice: ''
    });
    setActivePage('marketplace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { id: 'Tracteur', name: 'Tracteurs', icon: Tractor, desc: 'Pour les grands labours et la préparation des sols' },
    { id: 'Motoculteur', name: 'Motoculteurs', icon: Compass, desc: 'Idéal pour le maraîchage et les parcelles moyennes' },
    { id: 'Moissonneuse', name: 'Moissonneuses', icon: Sparkles, desc: 'Optimisez vos récoltes de riz, maïs et soja' },
    { id: 'Pulvérisateur', name: 'Pulvérisateurs', icon: ShieldCheck, desc: 'Protection des cultures et épandage de précision' },
  ];

  return (
    <div className="animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-agri-dark via-[#112d17] to-agri-dark text-white overflow-hidden py-20 px-4">
        
        {/* Dynamic Glowing Circles */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-agri-light/10 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-agri-gold/10 rounded-full blur-3xl"></div>

        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-agri-light animate-ping"></span>
            <span className="text-xs font-semibold text-agri-gold uppercase tracking-wider">Le Futur de l'Agritech au Togo</span>
          </div>

          {/* Slogan & Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold font-outfit tracking-tight leading-[1.15]">
            La mécanisation agricole <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-agri-light to-agri-gold">
              accessible partout
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-300 font-light leading-relaxed">
            Louez des tracteurs, motoculteurs et équipements de pointe en quelques clics. Payez simplement par Mobile Money et transformez vos rendements de récolte.
          </p>

          {/* 2. SEARCH BAR BARRE DE RECHERCHE D'EQUIPEMENTS */}
          <div className="max-w-4xl mx-auto pt-4">
            <form onSubmit={handleSearch} className="bg-white/95 p-4 md:p-3.5 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-3.5 md:items-center border border-white/20 backdrop-blur-xl">
              
              {/* Category Search */}
              <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
                <Tractor className="h-5 w-5 text-agri-light mr-3 flex-shrink-0" />
                <div className="w-full text-left">
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Équipement</label>
                  <select 
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full bg-transparent text-gray-800 text-sm font-semibold focus:outline-none cursor-pointer py-1"
                  >
                    <option value="">Tous les équipements</option>
                    <option value="Tracteur">Tracteur</option>
                    <option value="Motoculteur">Motoculteur</option>
                    <option value="Moissonneuse">Moissonneuse-batteuse</option>
                    <option value="Pulvérisateur">Pulvérisateur</option>
                    <option value="Pompe">Pompe d'irrigation</option>
                  </select>
                </div>
              </div>

              {/* Region Search */}
              <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
                <MapPin className="h-5 w-5 text-agri-light mr-3 flex-shrink-0" />
                <div className="w-full text-left">
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Région du Togo</label>
                  <select
                    value={searchRegion}
                    onChange={(e) => setSearchRegion(e.target.value)}
                    className="w-full bg-transparent text-gray-800 text-sm font-semibold focus:outline-none cursor-pointer py-1"
                  >
                    <option value="">Toutes les régions</option>
                    <option value="Maritime">Maritime (Lomé, Tsévié)</option>
                    <option value="Plateaux">Plateaux (Atakpamé, Kpalimé)</option>
                    <option value="Centrale">Centrale (Sokodé)</option>
                    <option value="Kara">Kara (Kara)</option>
                    <option value="Savanes">Savanes (Dapaong)</option>
                  </select>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                type="submit" 
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-agri-green to-agri-light hover:from-agri-light hover:to-agri-green text-white font-bold rounded-2xl md:rounded-full shadow-lg shadow-agri-green/30 flex items-center justify-center space-x-2 transition-all hover:scale-105 active:scale-95"
              >
                <Search className="h-5 w-5" />
                <span>Réserver maintenant</span>
              </button>

            </form>
          </div>

        </div>

      </section>

      {/* 3. KEY STATS SECTION */}
      <section className="-mt-10 relative z-20 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white rounded-3xl shadow-xl border border-gray-100/50">
          
          <div className="text-center p-4 border-r border-gray-100 last:border-0">
            <p className="text-3xl md:text-4xl font-extrabold font-outfit text-agri-green">350+</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1.5">Machines Disponibles</p>
          </div>

          <div className="text-center p-4 md:border-r border-gray-100 last:border-0">
            <p className="text-3xl md:text-4xl font-extrabold font-outfit text-agri-green">5/5</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1.5">Régions Couvertes</p>
          </div>

          <div className="text-center p-4 border-r border-gray-100 last:border-0">
            <p className="text-3xl md:text-4xl font-extrabold font-outfit text-agri-green">98%</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1.5">Satisfaction Client</p>
          </div>

          <div className="text-center p-4 last:border-0">
            <p className="text-3xl md:text-4xl font-extrabold font-outfit text-agri-green">12 000</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1.5">Hectares Labourés</p>
          </div>

        </div>
      </section>

      {/* 4. PRESENTATION DU FONCTIONNEMENT */}
      <section className="py-24 bg-agri-bg px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-agri-light uppercase tracking-widest">Fonctionnement</span>
            <h2 className="text-3xl md:text-4xl font-bold font-outfit text-agri-dark">
              Comment louer avec AGRILOC ?
            </h2>
            <p className="text-sm text-gray-500 font-light">
              Une mise en relation intelligente, fluide et sécurisée en 3 étapes simples.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative group hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-agri-green/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-agri-green group-hover:bg-agri-green group-hover:text-white transition-colors duration-300">
                <Search className="h-6 w-6" />
              </div>
              <span className="absolute top-6 right-8 text-4xl font-black font-outfit text-gray-100">01</span>
              <h3 className="text-lg font-bold text-gray-800 mb-3 font-outfit">1. Recherchez l'équipement</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Sélectionnez le type de machine et votre région (Maritime, Plateaux, Centrale...) pour filtrer les offres disponibles à proximité de votre champ.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative group hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-agri-green/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-agri-green group-hover:bg-agri-green group-hover:text-white transition-colors duration-300">
                <CreditCard className="h-6 w-6" />
              </div>
              <span className="absolute top-6 right-8 text-4xl font-black font-outfit text-gray-100">02</span>
              <h3 className="text-lg font-bold text-gray-800 mb-3 font-outfit">2. Réservez et Payez</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Validez vos dates de travaux. Calculez votre devis et payez de manière 100% sécurisée via votre compte **T-Money** ou **Flooz**.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative group hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-agri-green/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-agri-green group-hover:bg-agri-green group-hover:text-white transition-colors duration-300">
                <Tractor className="h-6 w-6" />
              </div>
              <span className="absolute top-6 right-8 text-4xl font-black font-outfit text-gray-100">03</span>
              <h3 className="text-lg font-bold text-gray-800 mb-3 font-outfit">3. Travaillez sereinement</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Le chauffeur certifié achemine l'équipement sur votre champ. Vous effectuez vos travaux agricoles et évaluez la prestation à la fin.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CATEGORIES DE MACHINES */}
      <section className="py-16 bg-white px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-bold text-agri-light uppercase tracking-widest">Notre Catalogue</span>
              <h2 className="text-3xl font-bold font-outfit text-agri-dark">Des équipements adaptés à chaque étape</h2>
              <p className="text-sm text-gray-500 font-light">
                Du labour au battage, accédez à une gamme variée de machines agricoles modernes de haute qualité.
              </p>
            </div>
            <button 
              onClick={() => { setActivePage('marketplace'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="mt-4 md:mt-0 flex items-center space-x-2 text-agri-light font-bold hover:text-agri-green transition-all"
            >
              <span>Voir tout le catalogue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div 
                  key={cat.id} 
                  onClick={() => {
                    setFilters({ category: cat.id, region: '', maxPrice: '' });
                    setActivePage('marketplace');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-6 bg-agri-bg rounded-2xl border border-gray-100 cursor-pointer transition-all hover:scale-105 hover:bg-agri-green hover:text-white group"
                >
                  <div className="p-3.5 bg-white/80 rounded-xl w-fit text-agri-green mb-6 shadow-sm group-hover:bg-white/10 group-hover:text-white transition-all">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold font-outfit text-gray-800 group-hover:text-white mb-2">{cat.name}</h3>
                  <p className="text-xs text-gray-500 font-light group-hover:text-white/80 leading-relaxed">{cat.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. CARTE DES ZONES COUVERTES DU TOGO */}
      <section className="py-24 bg-gradient-to-br from-[#0c1c10] to-[#040805] text-white px-4 relative overflow-hidden">
        <div className="absolute top-1/3 right-1/10 w-80 h-80 bg-agri-light/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-6">
            <span className="text-xs font-bold text-agri-gold uppercase tracking-widest">Couverture Nationale</span>
            <h2 className="text-3xl md:text-4xl font-bold font-outfit leading-tight">
              Une présence forte dans les <span className="text-agri-light">5 régions du Togo</span>
            </h2>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              AGRILOC se déploie à travers tout le territoire togolais pour garantir qu'aucun producteur ne soit freiné par le manque d'équipements. Nos experts régionaux et nos flottes partenaires couvrent :
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="h-3 w-3 rounded-full bg-agri-light"></div>
                <div className="text-sm font-semibold">Maritime (Tsévié, Aného) : <span className="text-gray-400 font-normal">Maraîchage et riziculture côtière</span></div>
              </div>
              <div className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="h-3 w-3 rounded-full bg-agri-gold"></div>
                <div className="text-sm font-semibold">Plateaux (Kpalimé, Atakpamé) : <span className="text-gray-400 font-normal">Cacao, café, céréales et grandes cultures</span></div>
              </div>
              <div className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="h-3 w-3 rounded-full bg-agri-light"></div>
                <div className="text-sm font-semibold">Centrale & Kara (Sokodé, Kara) : <span className="text-gray-400 font-normal">Cultures cotonnières, riz, sorgho et igname</span></div>
              </div>
              <div className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="h-3 w-3 rounded-full bg-agri-gold"></div>
                <div className="text-sm font-semibold">Savanes (Dapaong, Mango) : <span className="text-gray-400 font-normal">Systèmes d'irrigation solaire et mécanisation du mil</span></div>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="relative p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md flex flex-col items-center justify-center min-h-[480px]">
            
            {/* Styled Toggle Region Markers */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-4 text-center">
              <span className="text-[10px] text-agri-gold uppercase tracking-widest font-bold">Visualisation de la couverture</span>
              <div className="w-1.5 h-72 bg-gradient-to-b from-agri-light to-transparent rounded-full mx-auto relative">
                
                {/* Region Dot 1: Savanes */}
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center marker-animate">
                  <div className="h-4 w-4 bg-agri-gold border-2 border-white rounded-full flex items-center justify-center shadow-lg"></div>
                  <span className="text-[10px] font-bold bg-agri-dark/90 px-2 py-0.5 border border-white/10 rounded mt-1 whitespace-nowrap">Région des Savanes</span>
                </div>

                {/* Region Dot 2: Kara */}
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2 flex flex-col items-center marker-animate" style={{ animationDelay: '0.6s' }}>
                  <div className="h-4 w-4 bg-agri-light border-2 border-white rounded-full flex items-center justify-center shadow-lg"></div>
                  <span className="text-[10px] font-bold bg-agri-dark/90 px-2 py-0.5 border border-white/10 rounded mt-1 whitespace-nowrap">Région de la Kara</span>
                </div>

                {/* Region Dot 3: Centrale */}
                <div className="absolute top-[55%] left-1/2 -translate-x-1/2 flex flex-col items-center marker-animate" style={{ animationDelay: '1.2s' }}>
                  <div className="h-4 w-4 bg-agri-gold border-2 border-white rounded-full flex items-center justify-center shadow-lg"></div>
                  <span className="text-[10px] font-bold bg-agri-dark/90 px-2 py-0.5 border border-white/10 rounded mt-1 whitespace-nowrap">Région Centrale</span>
                </div>

                {/* Region Dot 4: Plateaux */}
                <div className="absolute top-[75%] left-1/2 -translate-x-1/2 flex flex-col items-center marker-animate" style={{ animationDelay: '1.8s' }}>
                  <div className="h-4 w-4 bg-agri-light border-2 border-white rounded-full flex items-center justify-center shadow-lg"></div>
                  <span className="text-[10px] font-bold bg-agri-dark/90 px-2 py-0.5 border border-white/10 rounded mt-1 whitespace-nowrap">Région des Plateaux</span>
                </div>

                {/* Region Dot 5: Maritime */}
                <div className="absolute bottom-[0%] left-1/2 -translate-x-1/2 flex flex-col items-center marker-animate" style={{ animationDelay: '2.4s' }}>
                  <div className="h-4 w-4 bg-agri-gold border-2 border-white rounded-full flex items-center justify-center shadow-lg"></div>
                  <span className="text-[10px] font-bold bg-agri-dark/90 px-2 py-0.5 border border-white/10 rounded mt-1 whitespace-nowrap">Région Maritime (Lomé)</span>
                </div>

              </div>
            </div>

            {/* Background Togo map placeholder graphic */}
            <span className="text-gray-600/20 text-9xl font-black select-none pointer-events-none font-outfit uppercase">
              TOGO
            </span>
            <span className="text-xs text-gray-500 font-light select-none pointer-events-none mt-10">
              Cartographie Interactive et Suivi GPS des Chantiers
            </span>

          </div>

        </div>
      </section>

      {/* 7. AVANTAGES DE LA PLATEFORME (POURQUOI AGRILOC) */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-agri-light uppercase tracking-widest">Nos Avantages</span>
            <h2 className="text-3xl font-bold font-outfit text-agri-dark">Pourquoi choisir AGRILOC ?</h2>
            <p className="text-sm text-gray-500 font-light">La garantie d'une prestation de qualité, encadrée par la technologie.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 bg-agri-bg rounded-3xl border border-gray-100 flex flex-col space-y-4">
              <div className="w-12 h-12 bg-agri-green/5 rounded-2xl flex items-center justify-center text-agri-green">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-outfit text-gray-800">Équipements certifiés</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Toutes nos machines partenaires subissent une inspection rigoureuse avant d'être référencées sur la marketplace afin de garantir une fiabilité maximale au champ.
              </p>
            </div>

            <div className="p-8 bg-agri-bg rounded-3xl border border-gray-100 flex flex-col space-y-4">
              <div className="w-12 h-12 bg-agri-green/5 rounded-2xl flex items-center justify-center text-agri-green">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-outfit text-gray-800">Paiement Mobile Money Sécurisé</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Pas besoin de carte de crédit. Utilisez vos comptes Moov Flooz ou Togocom T-Money. Les fonds sont bloqués en séquestre sécurisé et versés après service fait.
              </p>
            </div>

            <div className="p-8 bg-agri-bg rounded-3xl border border-gray-100 flex flex-col space-y-4">
              <div className="w-12 h-12 bg-agri-green/5 rounded-2xl flex items-center justify-center text-agri-green">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-outfit text-gray-800">Chauffeurs et Mécaniciens</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                La location intègre par défaut un conducteur qualifié togolais et une assistance mécanique en cas de panne technique pour minimiser les interruptions de travail.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section className="py-24 bg-agri-bg border-t border-gray-100 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-agri-light uppercase tracking-widest">Témoignages</span>
            <h2 className="text-3xl font-bold font-outfit text-agri-dark">Ils font confiance à AGRILOC</h2>
            <p className="text-sm text-gray-500 font-light">Découvrez les retours d'expérience de nos producteurs et fournisseurs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex text-agri-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs md:text-sm text-gray-600 font-light italic leading-relaxed">
                  "Grâce à AGRILOC, j'ai pu réserver un tracteur pour labourer mes 4 hectares à Kpalimé en moins de 48 heures. Auparavant, cela me prenait des semaines de négociation. Le paiement par T-Money est tellement pratique."
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-6 border-t border-gray-50 mt-6">
                <div className="h-10 w-10 bg-agri-green/10 rounded-full flex items-center justify-center font-bold text-agri-green">
                  KK
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Koffi K.</h4>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Producteur de Maïs - Région des Plateaux</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex text-agri-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs md:text-sm text-gray-600 font-light italic leading-relaxed">
                  "En tant que propriétaire de tracteurs à Lomé, j'avais du mal à rentabiliser mes machines en dehors de ma région. AGRILOC me permet de trouver des clients sérieux partout au Togo et de maximiser mon chiffre d'affaires."
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-6 border-t border-gray-50 mt-6">
                <div className="h-10 w-10 bg-agri-green/10 rounded-full flex items-center justify-center font-bold text-agri-green">
                  AA
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Amina A.</h4>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Propriétaire de Flotte - Région Maritime</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

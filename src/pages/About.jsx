import React from 'react';
import { Target, Leaf, Heart, ShieldCheck, Compass, Sparkles, Award } from 'lucide-react';

export default function About() {
  
  const values = [
    { 
      title: 'Innovation Durable', 
      desc: "Nous mettons le meilleur de la technologie moderne au service du développement agricole togolais pour préserver les sols tout en augmentant les rendements.",
      icon: Leaf 
    },
    { 
      title: 'Simplicité Absolute', 
      desc: "Des interfaces épurées, accessibles en un clic depuis n'importe quel smartphone, couplées à des paiements de proximité familiers (T-Money & Flooz).",
      icon: Compass 
    },
    { 
      title: 'Fiabilité & Confiance', 
      desc: "Des machines minutieusement inspectées, des conducteurs qualifiés formés par nos soins et une assistance continue pour parer à tout incident au champ.",
      icon: ShieldCheck 
    },
  ];

  return (
    <div className="py-16 bg-agri-bg min-h-screen animate-fade-in text-left">
      <div className="max-w-6xl mx-auto px-4 space-y-20">
        
        {/* Section 1: Hero storytelling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs font-bold text-agri-light uppercase tracking-widest">Notre Histoire</span>
            <h1 className="text-3xl md:text-5xl font-black font-outfit text-agri-dark leading-[1.15]">
              Accélérer la mécanisation agricole au Togo
            </h1>
            
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-light">
              L'agriculture togolaise emploie plus de 60% de la population active, pourtant moins de 5% des exploitations agricoles ont accès à des outils de mécanisation modernes. Les producteurs préparent encore majoritairement les terres de manière manuelle, limitant leur rendement potentiel.
            </p>
            
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-light">
              C'est pour lever cette barrière décisive qu'est né **AGRILOC**. Notre ambition n'est pas de posséder une flotte géante de machines, mais de connecter intelligemment les forces : d'un côté, les propriétaires ou entreprises de mécanisation disposant d'équipements parfois sous-utilisés ; de l'autre, des agriculteurs désireux d'adopter des techniques modernes et plus productives.
            </p>
          </div>

          <div className="relative p-10 bg-gradient-to-br from-[#123118] to-black rounded-3xl text-white overflow-hidden shadow-2xl flex flex-col justify-between min-h-[350px]">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(249,168,38,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
            
            <div className="space-y-4">
              <span className="text-xs font-bold text-agri-gold uppercase tracking-widest block">Notre Slogan</span>
              <p className="text-2xl md:text-3xl font-extrabold font-outfit italic leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                “La mécanisation agricole accessible partout.”
              </p>
            </div>

            <div className="border-t border-white/10 pt-6 flex items-center space-x-3.5">
              <div className="h-10 w-10 bg-agri-light rounded-2xl flex items-center justify-center font-bold">
                TG
              </div>
              <div>
                <h4 className="text-xs font-bold font-outfit">Lomé, Togo</h4>
                <p className="text-[10px] text-gray-400 font-medium">Déploiement National Agritech</p>
              </div>
            </div>
          </div>

        </div>

        {/* Section 2: Mission, Vision, Target */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="h-12 w-12 bg-agri-green/5 rounded-2xl flex items-center justify-center text-agri-green">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold font-outfit text-gray-800">Notre Mission</h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Démocratiser l'accès aux équipements agricoles de pointe pour chaque paysan togolais, afin de soulager la pénibilité physique des chantiers et d'accroître les rendements de cultures majeures (riz, maïs, soja, coton) pour sécuriser la souveraineté alimentaire nationale.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="h-12 w-12 bg-agri-gold/5 rounded-2xl flex items-center justify-center text-agri-gold">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold font-outfit text-gray-800">Notre Vision</h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Devenir la référence absolue de l'agritech collaborative en Afrique de l'Ouest, en créant une plateforme de confiance capable d'animer un écosystème florissant où l'innovation technologique s'allie au savoir-faire ancestral de nos terroirs.
            </p>
          </div>

        </div>

        {/* Section 3: Core Values */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-agri-light uppercase tracking-widest block">Nos Fondements</span>
            <h2 className="text-3xl font-bold font-outfit text-agri-dark">Les valeurs qui nous guident</h2>
            <p className="text-xs text-gray-400 font-light">Une éthique forte orientée vers le soutien durable aux coopératives agricoles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => {
              const IconComp = v.icon;
              return (
                <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col space-y-4 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-agri-green/5 rounded-2xl flex items-center justify-center text-agri-green">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-gray-800 font-outfit">{v.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Social Impact Metrics */}
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl font-bold font-outfit text-gray-800">L'impact attendu d'ici 2028</h3>
            <p className="text-xs text-gray-400 font-light">Un alignement parfait avec le Plan National de Développement Agricole du Togo.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-agri-bg rounded-2xl">
              <span className="text-3xl font-extrabold font-outfit text-agri-green block">10 000+</span>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider block mt-1">Producteurs formés</span>
            </div>
            <div className="p-4 bg-agri-bg rounded-2xl">
              <span className="text-3xl font-extrabold font-outfit text-agri-green block">+45%</span>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider block mt-1">Augmentation des revenus</span>
            </div>
            <div className="p-4 bg-agri-bg rounded-2xl">
              <span className="text-3xl font-extrabold font-outfit text-agri-green block">150 000+</span>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider block mt-1">Hectares mécanisés</span>
            </div>
            <div className="p-4 bg-agri-bg rounded-2xl">
              <span className="text-3xl font-extrabold font-outfit text-agri-green block">5 000</span>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider block mt-1">Emplois indirects créés</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

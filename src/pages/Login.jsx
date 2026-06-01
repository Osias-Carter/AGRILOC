import React, { useEffect, useState } from 'react';
import { Lock, UserRound, Briefcase, ShieldCheck, Mail, Phone, MapPin, Building2, User } from 'lucide-react';
import { api } from '../api';

const fallbackAccounts = [
  { role: 'farmer', name: 'Koffi Kouma', email: 'koffi@agriloc.test', password: 'password123', city: 'Atakpamé', region: 'Plateaux' },
  { role: 'supplier', name: 'AgriTech Togo S.A.', email: 'supplier@agriloc.test', password: 'password123', city: 'Lomé', region: 'Maritime' },
  { role: 'admin', name: 'Admin AGRILOC', email: 'admin@agriloc.test', password: 'admin123', city: 'Lomé', region: 'Maritime' }
];

const roleMeta = {
  farmer: { label: 'Client / Agriculteur', icon: UserRound, color: 'text-agri-green', bg: 'bg-agri-green/5' },
  supplier: { label: 'Fournisseur d\'Équipements', icon: Briefcase, color: 'text-agri-dark', bg: 'bg-gray-50' },
  admin: { label: 'Administrateur', icon: ShieldCheck, color: 'text-agri-gold', bg: 'bg-amber-50' }
};

export default function Login({ onLogin, onRegister }) {
  const [accounts, setAccounts] = useState(fallbackAccounts);
  const [selected, setSelected] = useState(fallbackAccounts[0]);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState(fallbackAccounts[0].email);
  const [loginPassword, setLoginPassword] = useState(fallbackAccounts[0].password);
  const [loginError, setLoginError] = useState('');
  
  // Register Form State
  const [regRole, setRegRole] = useState('farmer'); // 'farmer' or 'supplier'
  const [regFullName, setRegFullName] = useState('');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regRegion, setRegRegion] = useState('Maritime');
  const [regError, setRegError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.testAccounts()
      .then((data) => {
        if (!data.length) return;
        setAccounts(data);
        setSelected(data[0]);
        setLoginEmail(data[0].email);
        setLoginPassword(data[0].password);
      })
      .catch(() => {});
  }, []);

  const chooseAccount = (account) => {
    setSelected(account);
    setLoginEmail(account.email);
    setLoginPassword(account.password);
    setLoginError('');
    setActiveTab('login');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');
    try {
      await onLogin(loginEmail, loginPassword);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRegError('');

    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim() || !regCity.trim() || !regRegion.trim()) {
      setRegError('Veuillez remplir tous les champs requis.');
      setIsSubmitting(false);
      return;
    }

    if (regRole === 'supplier' && !regCompanyName.trim()) {
      setRegError('Les fournisseurs doivent renseigner le nom de leur entreprise.');
      setIsSubmitting(false);
      return;
    }

    try {
      await onRegister({
        role: regRole,
        fullName: regFullName,
        companyName: regRole === 'supplier' ? regCompanyName : null,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        city: regCity,
        region: regRegion
      });
    } catch (err) {
      setRegError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-agri-bg px-4 py-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
        
        {/* Left Side: Information & Quick Accounts */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-agri-light uppercase tracking-widest">Accès Sécurisé</span>
            <h1 className="text-3xl font-bold font-outfit text-agri-dark mt-2">Votre Espace AGRILOC</h1>
            <p className="text-sm text-gray-500 mt-2 max-w-xl">
              Connectez-vous pour gérer vos réservations ou publier vos machines. Utilisez les comptes démos ci-dessous pour une connexion instantanée.
            </p>
          </div>

          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Comptes de démonstration rapides</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {accounts.map((account) => {
                const meta = roleMeta[account.role] || roleMeta.farmer;
                const Icon = meta.icon;
                const active = selected?.email === account.email && activeTab === 'login';
                return (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => chooseAccount(account)}
                    className={`text-left bg-white border rounded-2xl p-4 shadow-sm transition-all hover:scale-[1.02] flex flex-col justify-between ${
                      active ? 'border-agri-light ring-2 ring-agri-light/20' : 'border-gray-100 hover:border-agri-light/50'
                    }`}
                  >
                    <div>
                      <div className={`h-9 w-9 rounded-xl ${meta.bg} ${meta.color} flex items-center justify-center mb-3`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400">{meta.label}</span>
                      <h3 className="text-xs font-bold text-gray-800 mt-0.5 leading-snug">{account.companyName || account.name}</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">{account.city}, {account.region}</p>
                    </div>
                    <p className="text-[9px] font-mono text-gray-400 mt-4 break-all">{account.email}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Login / Register Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Tabs Selector */}
          <div className="flex border-b border-gray-100 bg-gray-50/50 p-1">
            <button
              onClick={() => {
                setActiveTab('login');
                setRegError('');
              }}
              className={`flex-1 py-4 text-xs font-bold transition-all rounded-t-2xl ${
                activeTab === 'login' 
                  ? 'bg-white text-agri-green shadow-sm border-b-2 border-agri-green' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Se Connecter
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setLoginError('');
              }}
              className={`flex-1 py-4 text-xs font-bold transition-all rounded-t-2xl ${
                activeTab === 'register' 
                  ? 'bg-white text-agri-green shadow-sm border-b-2 border-agri-green' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Créer un Compte
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'login' ? (
              
              /* 1. LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Adresse Email</label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="exemple@agriloc.test"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-agri-light"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mot de passe</label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-agri-light"
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-semibold">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-agri-green to-agri-light hover:scale-102 text-white rounded-xl font-bold text-xs shadow-md transition-all disabled:opacity-60 mt-2"
                >
                  {isSubmitting ? 'Connexion en cours...' : 'Se Connecter'}
                </button>
              </form>

            ) : (

              /* 2. REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                
                {/* Role Switcher */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vous êtes ?</label>
                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => setRegRole('farmer')}
                      className={`py-3 px-4 border rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                        regRole === 'farmer' 
                          ? 'border-agri-green bg-agri-green/5 text-agri-green ring-1 ring-agri-green' 
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <UserRound className="h-4 w-4 mr-2" />
                      Client (Agriculteur)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('supplier')}
                      className={`py-3 px-4 border rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                        regRole === 'supplier' 
                          ? 'border-agri-dark bg-gray-50 text-agri-dark ring-1 ring-agri-dark' 
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Fournisseur d'Équipements
                    </button>
                  </div>
                </div>

                {/* Common Inputs */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nom complet</label>
                    <div className="relative">
                      <User className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Koffi Kouma"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-agri-light"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Numéro de téléphone</label>
                    <div className="relative">
                      <Phone className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="Ex: +228 90123456"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-agri-light"
                      />
                    </div>
                  </div>
                </div>

                {/* Conditional Company Name Input */}
                {regRole === 'supplier' && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nom de l'entreprise</label>
                    <div className="relative">
                      <Building2 className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: AgriTech Togo S.A."
                        value={regCompanyName}
                        onChange={(e) => setRegCompanyName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-agri-light"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Adresse Email</label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="nom@exemple.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-agri-light"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ville</label>
                    <div className="relative">
                      <MapPin className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Atakpamé"
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-agri-light"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Région du Togo</label>
                    <select
                      value={regRegion}
                      onChange={(e) => setRegRegion(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-agri-light cursor-pointer"
                    >
                      <option value="Maritime">Maritime</option>
                      <option value="Plateaux">Plateaux</option>
                      <option value="Centrale">Centrale</option>
                      <option value="Kara">Kara</option>
                      <option value="Savanes">Savanes</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mot de passe</label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Saisissez un mot de passe sécurisé"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-agri-light"
                    />
                  </div>
                </div>

                {regError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-semibold">
                    {regError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-agri-green to-agri-light hover:scale-102 text-white rounded-xl font-bold text-xs shadow-md transition-all disabled:opacity-60 mt-4"
                >
                  {isSubmitting ? 'Création du compte...' : 'Créer mon compte'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

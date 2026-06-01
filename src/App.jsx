import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import MachineDetail from './pages/MachineDetail';
import FarmerDashboard from './pages/FarmerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import { Eye, Briefcase, User, Sparkles, X } from 'lucide-react';
import { api, setAuthToken } from './api';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [role, setRole] = useState('farmer'); // 'farmer' or 'supplier'
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  
  // Custom toast notification state
  const [toast, setToast] = useState(null);
  const [backendStatus, setBackendStatus] = useState('demo'); // demo, connected

  // Filters for marketplace
  const [filters, setFilters] = useState({
    category: '',
    region: '',
    maxPrice: ''
  });

  // 1. Initial State Database - Machines
  const [machines, setMachines] = useState([
    {
      id: 'm1',
      name: 'Tracteur Massey Ferguson 375',
      category: 'Tracteur',
      brand_model: 'MF-375 (75 HP)',
      power_hp: 75,
      daily_price: 75000,
      location_city: 'Atakpamé',
      location_region: 'Plateaux',
      description: 'Tracteur robuste de 75 chevaux, équipé pour les labours profonds et le hersage de grandes parcelles de maïs et coton dans la région des Plateaux. Chauffeur et carburant de base inclus dans la prestation.',
      images: ['/machines/massey-ferguson-375.png'],
      status: 'available',
      average_rating: 4.8
    },
    {
      id: 'm2',
      name: 'Motoculteur Kubota KRT140',
      category: 'Motoculteur',
      brand_model: 'Kubota-KRT (14 HP)',
      power_hp: 14,
      daily_price: 25000,
      location_city: 'Tsévié',
      location_region: 'Maritime',
      description: 'Idéal pour le maraîchage, la riziculture irriguée ou le fraisage fin des sols. Très agile et peu gourmand en carburant. Livré avec roto-fraise et soc de labour.',
      images: ['/machines/kubota-krt140.png'],
      status: 'available',
      average_rating: 4.6
    },
    {
      id: 'm3',
      name: 'Moissonneuse-batteuse John Deere W330',
      category: 'Moissonneuse',
      brand_model: 'JD-W330 (185 HP)',
      power_hp: 185,
      daily_price: 150000,
      location_city: 'Sokodé',
      location_region: 'Centrale',
      description: 'Moissonneuse-batteuse performante pour la récolte rapide du riz pluvial ou du maïs. Taux de perte minimal, grand bac à grains. Livrée avec chauffeur expert certifié.',
      images: ['/machines/john-deere-w330.png'],
      status: 'available',
      average_rating: 4.9
    },
    {
      id: 'm4',
      name: 'Pulvérisateur Tracté Agrator 1200L',
      category: 'Pulvérisateur',
      brand_model: 'Agrator-1200',
      power_hp: null,
      daily_price: 35000,
      location_city: 'Kara',
      location_region: 'Kara',
      description: 'Pulvérisateur de grande capacité pour la fertilisation ou la protection biologique des cotonniers et céréales. Largeur de rampe de 15 mètres pour couvrir de grands espaces.',
      images: ['/machines/agrator-1200l.png'],
      status: 'available',
      average_rating: 4.5
    },
    {
      id: 'm5',
      name: "Pompe d'irrigation Solaire LORENTZ",
      category: 'Pompe',
      brand_model: 'Lorentz-PS2-150',
      power_hp: null,
      daily_price: 15000,
      location_city: 'Dapaong',
      location_region: 'Savanes',
      description: "Système de pompage solaire complet pour l'irrigation maraîchère dans le nord du Togo. Panneaux photovoltaïques et tuyaux souples d'acheminement fournis.",
      images: ['/machines/lorentz-pompe.png'],
      status: 'available',
      average_rating: 4.7
    }
  ]);

  // 2. Initial State Database - Bookings
  const [bookings, setBookings] = useState([
    {
      id: 'b-9382',
      machineId: 'm5',
      startDate: '2026-05-24',
      endDate: '2026-05-26',
      totalDays: 3,
      totalPrice: 49500, // (15000 * 3) + 10% commission
      status: 'ongoing', // active paying
      deliveryRequired: true,
      deliveryAddress: 'Champ de riz, Dapaong Sud'
    },
    {
      id: 'b-5201',
      machineId: 'm2',
      startDate: '2026-05-15',
      endDate: '2026-05-16',
      totalDays: 2,
      totalPrice: 55000, // (25000 * 2) + 10% commission
      status: 'completed',
      deliveryRequired: false,
      deliveryAddress: ''
    }
  ]);

  // 3. Initial Chat Messages
  const [chatMessages, setChatMessages] = useState([
    { id: 'c1', sender: 'supplier', text: 'Bonjour Koffi. Votre demande de réservation pour le motoculteur à Tsévié a été validée.', time: 'Hier, 15:30' },
    { id: 'c2', sender: 'farmer', text: 'Super, merci ! Le chauffeur a-t-il l\'habitude de travailler les terres argileuses ?', time: 'Hier, 15:42' },
    { id: 'c3', sender: 'supplier', text: 'Oui, aucun problème. Notre chauffeur Yaovi a plus de 5 ans d\'expérience dans la région.', time: 'Hier, 15:45' }
  ]);

  // 4. Initial Notifications
  const [notifications, setNotifications] = useState([
    { id: 'n1', text: 'Bienvenue sur la plateforme AGRILOC Togo !', time: 'Il y a 2 jours', isRead: false, targetPage: 'home' },
    { id: 'n2', text: 'Paiement Flooz validé pour la Pompe LORENTZ !', time: 'Il y a 3 heures', isRead: false, targetPage: 'farmer' }
  ]);

  // Toast alert trigger helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const persistNotification = async (notification) => {
    setNotifications(prev => [notification, ...prev]);
    try {
      if (currentUser) {
        await api.createNotification(notification);
      }
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('demo');
      console.warn('Notification gardée localement:', error.message);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadBootstrapData = async () => {
      try {
        const data = await api.bootstrap(currentUser?.id);
        if (ignore) return;
        setUsers(data.users || []);
        setMachines(data.machines);
        setBookings(data.bookings);
        setNotifications(data.notifications);
        setBackendStatus('connected');
        showToast('Base MySQL connectée. Données chargées depuis le serveur.', 'success');
      } catch (error) {
        if (ignore) return;
        setBackendStatus('demo');
        console.warn('Mode démo local activé:', error.message);
      }
    };

    loadBootstrapData();

    return () => {
      ignore = true;
    };
  }, [currentUser?.id]);

  const handleLogin = async (email, password) => {
    const { user, token } = await api.login(email, password);
    setAuthToken(token);
    setCurrentUser(user);
    setRole(user.role === 'supplier' ? 'supplier' : 'farmer');
    setActivePage(user.role === 'supplier' ? 'supplier' : user.role === 'admin' ? 'supplier' : 'farmer');
    showToast(`Bienvenue ${user.fullName}.`, 'success');
  };

  const handleRegister = async (userData) => {
    const { user, token } = await api.register(userData);
    setAuthToken(token);
    setCurrentUser(user);
    setRole(user.role === 'supplier' ? 'supplier' : 'farmer');
    setActivePage(user.role === 'supplier' ? 'supplier' : user.role === 'admin' ? 'supplier' : 'farmer');
    showToast(`Bienvenue ${user.fullName}. Votre compte a été créé avec succès !`, 'success');
  };

  const handleLogout = () => {
    setAuthToken('');
    setCurrentUser(null);
    setActivePage('home');
    showToast('Session fermée.', 'info');
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Mark all notifications as read
  const markNotificationsAsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    try {
      await api.markNotificationsAsRead();
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('demo');
      console.warn('Lecture notifications non persistée:', error.message);
    }
  };

  // Cross-Role Interaction logic 1: Create a Booking (Farmer)
  const handleCreateBooking = async (bookingData) => {
    if (!currentUser) {
      setActivePage('login');
      return;
    }
    const newId = `b-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: newId,
      ...bookingData,
      farmerId: currentUser.id,
      status: 'pending' // starts pending validation by supplier
    };

    // Add to bookings list
    setBookings(prev => [newBooking, ...prev]);

    try {
      const savedBooking = await api.createBooking(newBooking);
      setBookings(prev => prev.map(b => b.id === newId ? savedBooking : b));
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('demo');
      console.warn('Réservation gardée localement:', error.message);
    }
    
    // Add custom notifications for both roles
    const farmerNotif = {
      id: `n-${Date.now()}`,
      text: `Réservation #${newId.substring(2)} en attente d'approbation.`,
      time: 'À l\'instant',
      isRead: false,
      targetPage: 'farmer'
    };
    persistNotification(farmerNotif);

    // Close detail modal
    setSelectedMachine(null);
    
    // Trigger toast notification
    showToast("Votre demande de réservation a été envoyée au fournisseur !", "success");

    // Redirect to farmer dashboard
    setActivePage('farmer');
  };

  // Cross-Role Interaction logic 2: Supplier Approves booking
  const handleAcceptBooking = async (bookingId) => {
    setBookings(prev => prev.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status: 'confirmed' }; // Ready for payment!
      }
      return b;
    }));

    // Lock machine in database
    const bookingObj = bookings.find(b => b.id === bookingId);
    if (bookingObj) {
      setMachines(prev => prev.map(m => {
        if (m.id === bookingObj.machineId) {
          return { ...m, status: 'rented' };
        }
        return m;
      }));
    }

    try {
      await api.updateBookingStatus(bookingId, 'confirmed');
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('demo');
      console.warn('Validation réservation non persistée:', error.message);
    }

    // Notify farmer
    const notify = {
      id: `n-${Date.now()}`,
      text: `Votre réservation #${bookingId.substring(2)} a été validée ! Procédez au paiement.`,
      time: 'À l\'instant',
      isRead: false,
      targetPage: 'farmer'
    };
    persistNotification(notify);
    
    showToast("Réservation acceptée. En attente de paiement du client.", "info");
  };

  // Cross-Role Interaction logic 3: Supplier Rejects booking
  const handleRejectBooking = async (bookingId) => {
    setBookings(prev => prev.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status: 'cancelled' };
      }
      return b;
    }));

    // Unlock machine
    const bookingObj = bookings.find(b => b.id === bookingId);
    if (bookingObj) {
      setMachines(prev => prev.map(m => {
        if (m.id === bookingObj.machineId) {
          return { ...m, status: 'available' };
        }
        return m;
      }));
    }

    try {
      await api.updateBookingStatus(bookingId, 'cancelled');
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('demo');
      console.warn('Refus réservation non persisté:', error.message);
    }

    // Notify farmer
    const notify = {
      id: `n-${Date.now()}`,
      text: `La réservation #${bookingId.substring(2)} a été déclinée par le fournisseur.`,
      time: 'À l\'instant',
      isRead: false,
      targetPage: 'marketplace'
    };
    persistNotification(notify);

    showToast("Demande de réservation déclinée.", "warning");
  };

  // Cross-Role Interaction logic 4: Farmer pays booking
  const handlePayBooking = async (bookingId, paymentReceipt) => {
    setBookings(prev => prev.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status: 'ongoing', payment: paymentReceipt }; // now active on field!
      }
      return b;
    }));

    try {
      await api.updateBookingStatus(bookingId, 'ongoing', paymentReceipt);
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('demo');
      console.warn('Paiement non persisté:', error.message);
    }

    const methodLabel = paymentReceipt?.method === 'stripe' ? 'Stripe' : 'Mobile Money';
    const notify = {
      id: `n-${Date.now()}`,
      text: `Paiement ${methodLabel} validé ! Prestation active pour le contrat #${bookingId.substring(2)}.`,
      time: 'À l\'instant',
      isRead: false,
      targetPage: 'farmer'
    };
    persistNotification(notify);

    showToast("Paiement validé ! Les fonds sont consignés.", "success");
  };

  // Cross-Role Interaction logic 5: Supplier adds new machine
  const handleAddMachine = async (newMachineData) => {
    const newId = `m-${Date.now()}`;
    const newMachine = {
      id: newId,
      supplierId: currentUser?.id,
      ...newMachineData
    };

    setMachines(prev => [newMachine, ...prev]);

    try {
      const savedMachine = await api.createMachine(newMachine);
      setMachines(prev => prev.map(m => m.id === newId ? savedMachine : m));
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('demo');
      console.warn('Machine gardée localement:', error.message);
    }

    const notify = {
      id: `n-${Date.now()}`,
      text: `Nouvel équipement "${newMachine.name}" publié sur la marketplace !`,
      time: 'À l\'instant',
      isRead: false,
      targetPage: 'marketplace'
    };
    persistNotification(notify);

    showToast("Votre équipement a été mis en ligne avec succès !", "success");
  };

  // Interactive Live Chat response mockup
  const handleSendMessage = (messageText) => {
    const newMsg = {
      id: `c-${Date.now()}`,
      sender: 'farmer',
      text: messageText,
      time: 'À l\'instant'
    };

    setChatMessages([...chatMessages, newMsg]);

    // Simulated supplier response delay after 2 seconds
    setTimeout(() => {
      let replyText = "Bien reçu ! Nos équipes sont mobilisées pour vos travaux.";
      if (messageText.toLowerCase().includes('labour') || messageText.toLowerCase().includes('sol')) {
        replyText = "Absolument, la machine dispose de socs neufs pour labourer en profondeur de manière optimale.";
      } else if (messageText.toLowerCase().includes('payer') || messageText.toLowerCase().includes('prix') || messageText.toLowerCase().includes('money')) {
        replyText = "Le paiement est géré en séquestre par AGRILOC. Dès que vous confirmez sur votre téléphone (USSD Flooz/TMoney), la date est bloquée automatiquement.";
      } else if (messageText.toLowerCase().includes('chauffeur') || messageText.toLowerCase().includes('conducteur')) {
        replyText = "Le chauffeur Yaovi est déjà affecté à votre dossier. Il vous appellera la veille de la prestation.";
      }

      const supplierReply = {
        id: `c-rep-${Date.now()}`,
        sender: 'supplier',
        text: replyText,
        time: 'À l\'instant'
      };
      
      setChatMessages(prev => [...prev, supplierReply]);
      
      // Notify client
      const notify = {
        id: `n-chat-${Date.now()}`,
        text: 'Nouveau message du propriétaire d\'équipement.',
        time: 'À l\'instant',
        isRead: false,
        targetPage: 'farmer'
      };
      setNotifications(prev => [notify, ...prev]);

      showToast("Nouveau message du fournisseur !", "info");

    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      
      {/* 1. TOAST NOTIFICATION FLOATING BANNER */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up max-w-sm w-full bg-agri-dark text-white p-4 rounded-2xl shadow-2xl border border-agri-light/20 backdrop-blur-md flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-agri-light animate-ping"></span>
            <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:bg-white/10 rounded-full">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. NAVBAR */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        role={role}
        setRole={setRole}
        notifications={notifications}
        markNotificationsAsRead={markNotificationsAsRead}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 3. DYNAMIC PAGES ROUTING VIEW */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <Home setActivePage={setActivePage} setFilters={setFilters} />
        )}
        {activePage === 'login' && (
          <Login onLogin={handleLogin} onRegister={handleRegister} />
        )}
        {activePage === 'marketplace' && (
          <Marketplace 
            machines={machines} 
            filters={filters}
            setFilters={setFilters}
            onSelectMachine={setSelectedMachine}
          />
        )}
        {activePage === 'farmer' && (
          <FarmerDashboard 
            bookings={bookings} 
            machines={machines}
            currentUser={currentUser}
            chatMessages={chatMessages}
            onPayBooking={handlePayBooking}
            onSendMessage={handleSendMessage}
            filters={filters}
            setFilters={setFilters}
            onSelectMachine={setSelectedMachine}
          />
        )}
        {activePage === 'supplier' && (
          <SupplierDashboard 
            bookings={bookings} 
            machines={machines}
            currentUser={currentUser}
            users={users}
            onAddMachine={handleAddMachine}
            onAcceptBooking={handleAcceptBooking}
            onRejectBooking={handleRejectBooking}
          />
        )}
        {activePage === 'about' && (
          <About />
        )}
        {activePage === 'contact' && (
          <Contact />
        )}
      </main>

      {/* 4. DETAIL OVERLAY MODAL */}
      {selectedMachine && (
        <MachineDetail 
          machine={selectedMachine} 
          onClose={() => setSelectedMachine(null)}
          onCreateBooking={handleCreateBooking}
        />
      )}

      {/* 5. FOOTER */}
      <Footer setActivePage={setActivePage} />

      {/* ==================================================== */}
      {/* 6. FLOATING DEMO CONTROLLER TOOLBAR FOR INVESTORS    */}
      {/* ==================================================== */}
      <div className="fixed bottom-6 left-6 z-40 bg-white/90 backdrop-blur border border-gray-200 shadow-2xl p-4 rounded-3xl max-w-sm hidden sm:flex items-center space-x-4 animate-fade-in hover:shadow-agri-green/10 transition-shadow">
        <div className="p-2 bg-gradient-to-br from-agri-green to-agri-light rounded-xl text-white">
          <Eye className="h-5 w-5" />
        </div>
        <div className="text-left">
          <div className="flex items-center space-x-1">
            <span className="text-[9px] bg-agri-green/10 text-agri-green font-bold px-2 py-0.5 rounded uppercase">Démo Interactive</span>
            <span className="h-1.5 w-1.5 rounded-full bg-agri-light animate-ping"></span>
          </div>
          <h4 className="text-[11px] font-bold text-gray-800 font-outfit mt-0.5">Simulateur de rôle AGRILOC</h4>
          <p className="text-[9px] text-gray-400 font-light mt-0.5 leading-tight">Basculez de rôle pour tester le flux de réservation en temps réel.</p>
          
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => {
                setRole('farmer');
                setActivePage('farmer');
                showToast("Bascule en mode Agriculteur (Koffi)", "info");
              }}
              className={`flex-1 py-1 rounded-lg text-[9px] font-bold flex items-center justify-center border transition-all ${
                role === 'farmer' 
                  ? 'bg-agri-light border-transparent text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="h-3 w-3 mr-1" />
              Agriculteur
            </button>
            <button 
              onClick={() => {
                setRole('supplier');
                setActivePage('supplier');
                showToast("Bascule en mode Fournisseur (AgriTech)", "info");
              }}
              className={`flex-1 py-1 rounded-lg text-[9px] font-bold flex items-center justify-center border transition-all ${
                role === 'supplier' 
                  ? 'bg-agri-dark border-transparent text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="h-3 w-3 mr-1" />
              Fournisseur
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

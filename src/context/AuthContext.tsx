import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { 
  syncUserProfile, 
  getUserFavorites, 
  addFavorite, 
  removeFavorite, 
  addVisitBooking, 
  fetchUserVisits,
  VisitRecord,
  getAdminUser,
  createAdminUser,
  fetchProperties,
  saveProperty,
  deleteProperty,
  seedProperties,
  fetchRooms,
  saveRoom,
  deleteRoom,
  fetchAllBookings,
  saveBooking,
  deleteBooking,
  fetchInquiries,
  saveInquiry,
  deleteInquiry,
  fetchNotifications,
  saveNotification,
} from "../lib/firestoreUtils";
import { Property, Room, Booking, Inquiry, AppNotification, AdminUser } from "../types";
import { PROPERTIES_DATA } from "../data";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userFullName: string | null;
  adminRole: 'Super Admin' | 'Property Manager' | null;
  isAdmin: boolean;
  savedOfflineProperties: string[];
  dbSavedProperties: string[];
  userVisits: VisitRecord[];
  
  // Custom states
  properties: Property[];
  rooms: Room[];
  bookings: Booking[];
  inquiries: Inquiry[];
  notifications: AppNotification[];

  // Actions
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, fullName: string) => Promise<User>;
  logOut: () => Promise<void>;
  toggleFavorite: (propertyId: string) => Promise<void>;
  bookVisit: (
    propertyId: string, 
    visitorName: string, 
    visitorPhone: string, 
    visitDate: string, 
    visitTimeSlot: string
  ) => Promise<string>;
  refreshVisits: () => Promise<void>;
  
  // Custom Admin CRUD triggers
  refreshAllData: (forceAdminLoad?: boolean) => Promise<void>;
  updateProperty: (property: Property) => Promise<void>;
  removeProperty: (propertyId: string) => Promise<void>;
  updateRoom: (room: Room) => Promise<void>;
  removeRoom: (roomId: string) => Promise<void>;
  updateBooking: (booking: Booking) => Promise<void>;
  removeBooking: (bookingId: string) => Promise<void>;
  updateInquiry: (inquiry: Inquiry) => Promise<void>;
  removeInquiry: (inquiryId: string) => Promise<void>;
  markNotiRead: (notiId: string) => Promise<void>;
  addInquiry: (name: string, phone: string, email: string, message: string, type: 'contact' | 'whatsapp' | 'property', propertyId?: string, propertyTitle?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<'Super Admin' | 'Property Manager' | null>(null);
  
  const [dbSavedProperties, setDbSavedProperties] = useState<string[]>([]);
  const [userVisits, setUserVisits] = useState<VisitRecord[]>([]);

  // States
  const [properties, setProperties] = useState<Property[]>(PROPERTIES_DATA);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Function to refresh all data loaded into standard state
  const refreshAllData = async (forceAdminLoad: boolean = false) => {
    const currentUser = auth.currentUser;
    const isSpecialAdminMail = currentUser && (
      currentUser.email === "admin@pgphagwara.com" || 
      currentUser.email === "manager@pgphagwara.com" ||
      currentUser.email === "blackhorse123@gmail.com"
    );

    // 1. Properties
    try {
      let loadedProps = await fetchProperties();
      if (!loadedProps || loadedProps.length === 0) {
        // Only auto-seed if empty AND user is an authorized admin / manager
        if (forceAdminLoad || adminRole || isSpecialAdminMail) {
          await seedProperties(PROPERTIES_DATA);
          loadedProps = await fetchProperties();
        }
      }
      if (loadedProps && loadedProps.length > 0) {
        setProperties(loadedProps);
      }
    } catch (err) {
      console.warn("Failed to load properties:", err);
    }

    // 2. Rooms
    try {
      const loadedRooms = await fetchRooms();
      setRooms(loadedRooms || []);
    } catch (err) {
      console.warn("Failed to load rooms:", err);
    }

    // Only load admin-related data if requested, or if the current user profile has admin role
    if (forceAdminLoad || isSpecialAdminMail || adminRole) {
      // 3. Bookings
      try {
        const loadedBookings = await fetchAllBookings();
        setBookings(loadedBookings || []);
      } catch (err) {
        console.warn("Failed to load bookings:", err);
      }

      // 4. Inquiries
      try {
        const loadedInquiries = await fetchInquiries();
        setInquiries(loadedInquiries || []);
      } catch (err) {
        console.warn("Failed to load inquiries:", err);
      }

      // 5. Notifications
      try {
        const loadedNotis = await fetchNotifications();
        setNotifications(loadedNotis || []);
      } catch (err) {
        console.warn("Failed to load notifications:", err);
      }
    }
  };

  // Monitor auth state changes on initial load
  useEffect(() => {
    // Fire off async data load on start (only public data initially)
    refreshAllData(false);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserFullName(currentUser.displayName);
        
        // 1. Fetch saved favorites & visits
        try {
          const favs = await getUserFavorites(currentUser.uid);
          setDbSavedProperties(favs);
          const visits = await fetchUserVisits(currentUser.uid);
          setUserVisits(visits);
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          if (errMsg.toLowerCase().includes("permission") || errMsg.toLowerCase().includes("insufficient")) {
            console.warn("[Firestore Notice] Database rules restricted reading user favorites/visits. This is normal if custom rules are not pasted in the Firebase Console.");
          } else {
            console.error("Error loading user firestore data on login:", err);
          }
        }

        // 2. Check if admin
        const isSpecialAdminMail = currentUser.email === "admin@pgphagwara.com" || 
                                   currentUser.email === "manager@pgphagwara.com" ||
                                   currentUser.email === "blackhorse123@gmail.com";
        try {
          let adminProfile = null;
          try {
            adminProfile = await getAdminUser(currentUser.uid);
          } catch (readErr) {
            console.warn("Could not read admin profile from Firestore, checking local override:", readErr);
          }

          if (adminProfile) {
            setAdminRole(adminProfile.role);
            // Refresh with admin-only collections because the user is an admin
            await refreshAllData(true);
          } else {
            // Auto seed default credentials if signed up with special admin emails
            if (currentUser.email === "admin@pgphagwara.com" || currentUser.email === "blackhorse123@gmail.com") {
              try {
                await createAdminUser(currentUser.uid, currentUser.email, "System Admin", "Super Admin");
              } catch (writeErr) {
                console.warn("Failed to register admin in custom Firestore, continuing with local superadmin privilege:", writeErr);
              }
              setAdminRole("Super Admin");
              await refreshAllData(true);
            } else if (currentUser.email === "manager@pgphagwara.com") {
              try {
                await createAdminUser(currentUser.uid, currentUser.email, "Property Manager", "Property Manager");
              } catch (writeErr) {
                console.warn("Failed to register manager in custom Firestore, continuing with local manager privilege:", writeErr);
              }
              setAdminRole("Property Manager");
              await refreshAllData(true);
            } else {
              setAdminRole(null);
            }
          }
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          if (errMsg.toLowerCase().includes("permission") || errMsg.toLowerCase().includes("insufficient")) {
            console.warn("[Firestore Notice] Checking or auto-bootstrapping admin roles was restricted by security rules. Proceeding with local admin credentials.");
          } else {
            console.error("Error checking or auto-bootstrapping admin roles:", err);
          }
          if (isSpecialAdminMail) {
            if (currentUser.email === "admin@pgphagwara.com" || currentUser.email === "blackhorse123@gmail.com") {
              setAdminRole("Super Admin");
            } else if (currentUser.email === "manager@pgphagwara.com") {
              setAdminRole("Property Manager");
            }
            await refreshAllData(true);
          } else {
            setAdminRole(null);
          }
        }
      } else {
        setUserFullName(null);
        setAdminRole(null);
        setDbSavedProperties([]);
        setUserVisits([]);
        // Reset admin collections state when logging out
        setBookings([]);
        setInquiries([]);
        setNotifications([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [adminRole]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Self-healing Bootstrap for Demo Admin User accounts
      let isSpecialAdmin = false;
      let specialRole: 'Super Admin' | 'Property Manager' = "Super Admin";
      let specialName = "System Admin";

      if (email === "admin@pgphagwara.com" && password === "admin123") {
        isSpecialAdmin = true;
        specialRole = "Super Admin";
        specialName = "Main System Admin";
      } else if (email === "manager@pgphagwara.com" && password === "manager123") {
        isSpecialAdmin = true;
        specialRole = "Property Manager";
        specialName = "Regional Manager";
      }

      let userCred;
      try {
        userCred = await signInWithEmailAndPassword(auth, email, password);
      } catch (authErr: any) {
        // If special accounts do not exist in Firebase Auth yet, auto-create them dynamically
        if (isSpecialAdmin && (authErr.code === "auth/user-not-found" || authErr.code === "auth/invalid-credential" || authErr.code === "auth/invalid-email" || true)) {
          try {
            userCred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCred.user, { displayName: specialName });
          } catch (signUpErr) {
            throw authErr;
          }
        } else {
          throw authErr;
        }
      }

      const verifiedUser = userCred.user;

      // Ensure they have matching document inside Firestore 'admins' database collection
      if (isSpecialAdmin) {
        await createAdminUser(verifiedUser.uid, email, specialName, specialRole);
        setAdminRole(specialRole);
      } else {
        const adminProfile = await getAdminUser(verifiedUser.uid);
        if (adminProfile) {
          setAdminRole(adminProfile.role);
        } else {
          setAdminRole(null);
        }
      }

      setUser(verifiedUser);
      setUserFullName(verifiedUser.displayName);

      // Fetch user data
      const favs = await getUserFavorites(verifiedUser.uid);
      setDbSavedProperties(favs);
      const visits = await fetchUserVisits(verifiedUser.uid);
      setUserVisits(visits);

      // Refresh data
      refreshAllData();

      return verifiedUser;
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: fullName });
      await syncUserProfile(result.user.uid, email, fullName);
      setUserFullName(fullName);
      setAdminRole(null);
      
      // Auto seed custom checks if they used special emails
      if (email === "admin@pgphagwara.com") {
        await createAdminUser(result.user.uid, email, fullName, "Super Admin");
        setAdminRole("Super Admin");
      } else if (email === "manager@pgphagwara.com") {
        await createAdminUser(result.user.uid, email, fullName, "Property Manager");
        setAdminRole("Property Manager");
      }

      return result.user;
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setDbSavedProperties([]);
      setUserVisits([]);
      setAdminRole(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      console.warn("Cannot save favorite: User not logged in.");
      return;
    }

    const isCurrentlyAdored = dbSavedProperties.includes(propertyId);
    let updatedFavs: string[];
    
    if (isCurrentlyAdored) {
      updatedFavs = dbSavedProperties.filter(id => id !== propertyId);
      setDbSavedProperties(updatedFavs);
      await removeFavorite(user.uid, propertyId);
    } else {
      updatedFavs = [...dbSavedProperties, propertyId];
      setDbSavedProperties(updatedFavs);
      await addFavorite(user.uid, propertyId);
    }
  };

  const bookVisit = async (
    propertyId: string, 
    visitorName: string, 
    visitorPhone: string, 
    visitDate: string, 
    visitTimeSlot: string
  ): Promise<string> => {
    if (!user) {
      throw new Error("You must be logged in to book a property visit.");
    }
    const id = await addVisitBooking(user.uid, propertyId, visitorName, visitorPhone, visitDate, visitTimeSlot);
    const visits = await fetchUserVisits(user.uid);
    setUserVisits(visits);
    return id;
  };

  const refreshVisits = async () => {
    if (user) {
      const visits = await fetchUserVisits(user.uid);
      setUserVisits(visits);
    }
  };

  // ==========================================
  // Administrative Operations
  // ==========================================

  const updateProperty = async (property: Property) => {
    await saveProperty(property);
    await refreshAllData();
  };

  const removeProperty = async (propertyId: string) => {
    await deleteProperty(propertyId);
    await refreshAllData();
  };

  const updateRoom = async (room: Room) => {
    await saveRoom(room);
    await refreshAllData();
  };

  const removeRoom = async (roomId: string) => {
    await deleteRoom(roomId);
    await refreshAllData();
  };

  const updateBooking = async (booking: Booking) => {
    await saveBooking(booking);
    await refreshAllData();
  };

  const removeBooking = async (bookingId: string) => {
    await deleteBooking(bookingId);
    await refreshAllData();
  };

  const updateInquiry = async (inquiry: Inquiry) => {
    await saveInquiry(inquiry);
    await refreshAllData();
  };

  const removeInquiry = async (inquiryId: string) => {
    await deleteInquiry(inquiryId);
    await refreshAllData();
  };

  const markNotiRead = async (notiId: string) => {
    const matched = notifications.find(n => n.id === notiId);
    if (matched) {
      await saveNotification({ ...matched, read: true });
      await refreshAllData();
    }
  };

  const addInquiry = async (
    name: string, 
    phone: string, 
    email: string, 
    message: string, 
    type: 'contact' | 'whatsapp' | 'property',
    propertyId?: string,
    propertyTitle?: string
  ) => {
    const id = Math.random().toString(36).substring(2, 10);
    const inquiry: Inquiry = {
      id,
      name,
      phone,
      email,
      message,
      propertyId: propertyId || 'general_inquiry',
      propertyTitle: propertyTitle || '',
      type,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    await saveInquiry(inquiry);
    
    // Add real notification document
    const notiId = Math.random().toString(36).substring(2, 10);
    const noti: AppNotification = {
      id: notiId,
      title: `New Inquiry Received`,
      message: `From ${name} regarding ${propertyTitle || 'General Support'}`,
      type: 'inquiry',
      read: false,
      createdAt: new Date().toISOString()
    };
    await saveNotification(noti);
    
    await refreshAllData();
  };

  const value: AuthContextType = {
    user,
    loading,
    userFullName,
    adminRole,
    isAdmin: adminRole !== null,
    savedOfflineProperties: [],
    dbSavedProperties,
    userVisits,
    properties,
    rooms,
    bookings,
    inquiries,
    notifications,
    signIn,
    signUp,
    logOut,
    toggleFavorite,
    bookVisit,
    refreshVisits,
    refreshAllData,
    updateProperty,
    removeProperty,
    updateRoom,
    removeRoom,
    updateBooking,
    removeBooking,
    updateInquiry,
    removeInquiry,
    markNotiRead,
    addInquiry
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}

import { db, auth } from "./firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query,
  getDoc,
  writeBatch
} from "firebase/firestore";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  
  const isPermissionError = errMessage.toLowerCase().includes("permission") || 
                            errMessage.toLowerCase().includes("insufficient") ||
                            errMessage.toLowerCase().includes("unauthenticated");
                            
  if (isPermissionError) {
    console.warn(
      `[Firestore Note] Operation '${operationType}' on path '${path}' failed due to permission rules. ` +
      `Since you are using a custom Firebase project (pg-in-phagwara), please make sure you copy the rules from firestore.rules and paste them into your Firebase Web Console > Firestore > Rules.`
    );
  } else {
    console.error('Firestore Error Raised:', JSON.stringify(errInfo));
  }
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Sync user profile to Firestore
 */
export async function syncUserProfile(uid: string, email: string, fullName: string) {
  const path = `users/${uid}`;
  try {
    await setDoc(doc(db, "users", uid), {
      userId: uid,
      email: email,
      fullName: fullName,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Fetch user saved property favorites
 */
export async function getUserFavorites(uid: string): Promise<string[]> {
  const path = `users/${uid}/favorites`;
  try {
    const q = query(collection(db, "users", uid, "favorites"));
    const snapshot = await getDocs(q);
    const favorites: string[] = [];
    snapshot.forEach((doc) => {
      favorites.push(doc.id); // document ID is the propertyId
    });
    return favorites;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

/**
 * Add target propertyId to user favorites
 */
export async function addFavorite(uid: string, propertyId: string) {
  const path = `users/${uid}/favorites/${propertyId}`;
  try {
    await setDoc(doc(db, "users", uid, "favorites", propertyId), {
      propertyId,
      addedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Remove target propertyId from user favorites
 */
export async function removeFavorite(uid: string, propertyId: string) {
  const path = `users/${uid}/favorites/${propertyId}`;
  try {
    await deleteDoc(doc(db, "users", uid, "favorites", propertyId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

/**
 * Book Property Visit inside Firestore subcollection
 */
export interface VisitRecord {
  id: string;
  propertyId: string;
  visitorName: string;
  visitorPhone: string;
  visitDate: string;
  visitTimeSlot: string;
  createdAt: string;
}

export async function addVisitBooking(
  uid: string, 
  propertyId: string, 
  visitorName: string, 
  visitorPhone: string, 
  visitDate: string, 
  visitTimeSlot: string
): Promise<string> {
  const id = Math.random().toString(36).substring(2, 10);
  const path = `users/${uid}/visits/${id}`;
  try {
    await setDoc(doc(db, "users", uid, "visits", id), {
      propertyId,
      visitorName,
      visitorPhone,
      visitDate,
      visitTimeSlot,
      createdAt: new Date().toISOString()
    });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Get all visit appointments booked by user
 */
export async function fetchUserVisits(uid: string): Promise<VisitRecord[]> {
  const path = `users/${uid}/visits`;
  try {
    const snapshot = await getDocs(collection(db, "users", uid, "visits"));
    const visits: VisitRecord[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      visits.push({
        id: doc.id,
        propertyId: data.propertyId,
        visitorName: data.visitorName,
        visitorPhone: data.visitorPhone,
        visitDate: data.visitDate,
        visitTimeSlot: data.visitTimeSlot,
        createdAt: data.createdAt
      });
    });
    return visits;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

// ==========================================
// Administrative Firestore Helper Utilities
// ==========================================

import { Property, Room, Booking, Inquiry, AppNotification, AdminUser } from "../types";

// Admins Collection Operations
export async function getAdminUser(uid: string): Promise<AdminUser | null> {
  try {
    const docSnap = await getDoc(doc(db, "admins", uid));
    if (docSnap.exists()) {
      return docSnap.data() as AdminUser;
    }
    return null;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    if (errMsg.toLowerCase().includes("permission") || errMsg.toLowerCase().includes("insufficient")) {
      console.warn("Lacking permission to query 'admins' collection. Expected if rules are not pasted in the Firebase Console.");
    } else {
      console.error("Error fetching admin status:", err);
    }
    return null;
  }
}

export async function createAdminUser(uid: string, email: string, fullName: string, role: 'Super Admin' | 'Property Manager') {
  const path = `admins/${uid}`;
  try {
    await setDoc(doc(db, "admins", uid), {
      uid,
      email,
      fullName,
      role,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Properties Collection Operations
export async function fetchProperties(): Promise<Property[]> {
  const path = "properties";
  try {
    const snapshot = await getDocs(collection(db, "properties"));
    const properties: Property[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      properties.push({ 
        id: doc.id, 
        ...data,
        hostPhone: "+91 99580 16911",
        hostWhatsApp: "919958016911"
      } as Property);
    });
    return properties;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveProperty(property: Property) {
  const path = `properties/${property.id}`;
  try {
    await setDoc(doc(db, "properties", property.id), property, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteProperty(propertyId: string) {
  const path = `properties/${propertyId}`;
  try {
    await deleteDoc(doc(db, "properties", propertyId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function seedProperties(properties: Property[]) {
  const path = "properties/seed";
  try {
    const batch = writeBatch(db);
    properties.forEach((property) => {
      const docRef = doc(db, "properties", property.id);
      batch.set(docRef, property);
    });
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Rooms Collection Operations
export async function fetchRooms(): Promise<Room[]> {
  const path = "rooms";
  try {
    const snapshot = await getDocs(collection(db, "rooms"));
    const rooms: Room[] = [];
    snapshot.forEach((doc) => {
      rooms.push({ id: doc.id, ...doc.data() } as Room);
    });
    return rooms;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveRoom(room: Room) {
  const path = `rooms/${room.id}`;
  try {
    await setDoc(doc(db, "rooms", room.id), room, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteRoom(roomId: string) {
  const path = `rooms/${roomId}`;
  try {
    await deleteDoc(doc(db, "rooms", roomId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Bookings Collection Operations
export async function fetchAllBookings(): Promise<Booking[]> {
  const path = "bookings";
  try {
    const snapshot = await getDocs(collection(db, "bookings"));
    const bookings: Booking[] = [];
    snapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() } as Booking);
    });
    return bookings;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveBooking(booking: Booking) {
  const path = `bookings/${booking.id}`;
  try {
    await setDoc(doc(db, "bookings", booking.id), booking, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteBooking(bookingId: string) {
  const path = `bookings/${bookingId}`;
  try {
    await deleteDoc(doc(db, "bookings", bookingId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Inquiries Collection Operations
export async function fetchInquiries(): Promise<Inquiry[]> {
  const path = "inquiries";
  try {
    const snapshot = await getDocs(collection(db, "inquiries"));
    const inquiries: Inquiry[] = [];
    snapshot.forEach((doc) => {
      inquiries.push({ id: doc.id, ...doc.data() } as Inquiry);
    });
    return inquiries;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveInquiry(inquiry: Inquiry) {
  const path = `inquiries/${inquiry.id}`;
  try {
    const sanitizedInquiry = {
      ...inquiry,
      propertyId: inquiry.propertyId || 'general_inquiry',
      propertyTitle: inquiry.propertyTitle || ''
    };
    await setDoc(doc(db, "inquiries", inquiry.id), sanitizedInquiry, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteInquiry(inquiryId: string) {
  const path = `inquiries/${inquiryId}`;
  try {
    await deleteDoc(doc(db, "inquiries", inquiryId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// App Notifications Operations
export async function fetchNotifications(): Promise<AppNotification[]> {
  const path = "notifications";
  try {
    const snapshot = await getDocs(collection(db, "notifications"));
    const notifications: AppNotification[] = [];
    snapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() } as AppNotification);
    });
    return notifications;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveNotification(notification: AppNotification) {
  const path = `notifications/${notification.id}`;
  try {
    await setDoc(doc(db, "notifications", notification.id), notification, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function addNotification(title: string, message: string, type: 'property' | 'booking' | 'inquiry' | 'system') {
  const id = Math.random().toString(36).substring(2, 10);
  const notification: AppNotification = {
    id,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString()
  };
  await saveNotification(notification);
}


import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc, setDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userAccess, setUserAccess] = useState({ 
    accessGranted: false, 
    role: null 
  });

  // --- 2. CONFIGURATION VARIABLES ---
  const appId = import.meta.env.VITE_PROJECT_ID;

  const SUPER_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "cptlover11@gmail.com";

  // --- 3. SECURITY LOGGING ---
  const logLoginAttempt = async (user, accessStatus) => {
    try {
      if (!user) return;
      // Logs are stored in: artifacts/{appId}/security_audit_logs
      await addDoc(collection(db, 'artifacts', appId, 'security_audit_logs'), {
        uid: user.uid,
        email: user.email,
        timestamp: new Date().toISOString(),
        accessGranted: accessStatus.accessGranted,
        role: accessStatus.role,
        userAgent: navigator.userAgent || 'unknown'
      });
    } catch (e) {
      console.error("Failed to log security audit:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setUserLoggedIn(!!user);

      if (user) {
        // --- A. SUPER ADMIN BYPASS ---
        if (user.email === SUPER_ADMIN_EMAIL) {
           const adminAccess = { accessGranted: true, role: 'admin' };
           setUserAccess(adminAccess);
           setLoading(false);
           logLoginAttempt(user, adminAccess);
           return; 
        }

        // --- B. STANDARD USER CHECK (With Self-Healing) ---
        try {
          const docRef = doc(db, 'artifacts', appId, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // User found in database -> Load permissions
            const data = docSnap.data();
            const accessData = {
              accessGranted: data.accessGranted || false,
              role: data.role || 'pending'
            };
            setUserAccess(accessData);
            logLoginAttempt(user, accessData);
          } else {
            // FIX: User in Auth but NOT in DB (Orphaned) -> Create Profile
            console.log("Orphaned user detected. Creating profile for:", user.email);
            
            const newUserData = {
                email: user.email,
                createdAt: new Date().toISOString(),
                accessGranted: false, // Default to locked
                role: 'pending'       // Default to pending list
            };
            
            await setDoc(docRef, newUserData);

            const noAccess = { accessGranted: false, role: 'pending' };
            setUserAccess(noAccess);
            logLoginAttempt(user, noAccess);
          }
        } catch (error) {
          console.error("Error fetching/syncing user access data:", error);
          setUserAccess({ accessGranted: false, role: 'error' });
        }
      } else {
        // User logged out
        setUserAccess({ accessGranted: false, role: null });
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    db, 
    auth, // Export auth instance for other components
    userAccess,
    isAdmin: userAccess.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const TeacherContext = createContext();

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error('useTeacher must be used within a TeacherProvider');
  }
  return context;
};

export const TeacherProvider = ({ children }) => {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load teacher data from localStorage on mount
  useEffect(() => {
    const loadTeacherData = () => {
      try {
        const storedData = localStorage.getItem('teacherData');
        const storedEmail = localStorage.getItem('teacherEmail');
        const storedName = localStorage.getItem('teacherName');
        const storedId = localStorage.getItem('teacherId');

        if (storedData && storedEmail && storedName && storedId) {
          setTeacherData(JSON.parse(storedData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading teacher data from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeacherData();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch teacher data from Firestore
          const q = query(collection(db, 'teachers'), where('uid', '==', user.uid));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const teacherDoc = querySnapshot.docs[0];
            const data = teacherDoc.data();
            
            // Update last login info
            await updateDoc(doc(db, 'teachers', teacherDoc.id), {
              lastLoginAt: serverTimestamp(),
              loginCount: (data.loginCount || 0) + 1,
              updatedAt: serverTimestamp(),
            });

            // Update local state and localStorage
            setTeacherData(data);
            setIsAuthenticated(true);
            localStorage.setItem('teacherData', JSON.stringify(data));
            localStorage.setItem('teacherEmail', data.email);
            localStorage.setItem('teacherName', data.fullName || `${data.firstName} ${data.lastName}`);
            localStorage.setItem('teacherId', user.uid);
          } else {
            // Teacher data doesn't exist in Firestore, create basic entry
            const basicTeacherData = {
              uid: user.uid,
              email: user.email,
              fullName: user.displayName || 'Unknown Teacher',
              firstName: user.displayName?.split(' ')[0] || 'Unknown',
              lastName: user.displayName?.split(' ').slice(1).join(' ') || 'Teacher',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
              loginCount: 1,
              isActive: true,
              role: 'teacher',
              department: 'general',
              designation: 'Teacher',
            };

            await updateDoc(doc(db, 'teachers', user.uid), basicTeacherData);

            setTeacherData(basicTeacherData);
            setIsAuthenticated(true);
            localStorage.setItem('teacherData', JSON.stringify(basicTeacherData));
            localStorage.setItem('teacherEmail', user.email);
            localStorage.setItem('teacherName', basicTeacherData.fullName);
            localStorage.setItem('teacherId', user.uid);
          }
        } catch (error) {
          console.error('Error fetching teacher data:', error);
        }
      } else {
        // User is not authenticated
        setTeacherData(null);
        setIsAuthenticated(false);
        localStorage.removeItem('teacherData');
        localStorage.removeItem('teacherEmail');
        localStorage.removeItem('teacherName');
        localStorage.removeItem('teacherId');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateTeacherData = async (newData) => {
    try {
      if (!teacherData?.uid) return;

      const updatedData = {
        ...teacherData,
        ...newData,
        updatedAt: serverTimestamp(),
      };

      // Update in Firestore
      await updateDoc(doc(db, 'teachers', teacherData.uid), updatedData);

      // Update local state and localStorage
      setTeacherData(updatedData);
      localStorage.setItem('teacherData', JSON.stringify(updatedData));
      
      if (newData.fullName) {
        localStorage.setItem('teacherName', newData.fullName);
      }

      return true;
    } catch (error) {
      console.error('Error updating teacher data:', error);
      return false;
    }
  };

  const logout = () => {
    setTeacherData(null);
    setIsAuthenticated(false);
    localStorage.removeItem('teacherData');
    localStorage.removeItem('teacherEmail');
    localStorage.removeItem('teacherName');
    localStorage.removeItem('teacherId');
  };

  const getTeacherInfo = () => {
    if (!teacherData) return null;
    
    return {
      id: teacherData.uid,
      email: teacherData.email,
      name: teacherData.fullName || `${teacherData.firstName} ${teacherData.lastName}`,
      firstName: teacherData.firstName,
      lastName: teacherData.lastName,
      department: teacherData.department,
      designation: teacherData.designation,
      subject: teacherData.subject,
      employeeId: teacherData.employeeId,
      phone: teacherData.phone,
      address: teacherData.address,
      city: teacherData.city,
      state: teacherData.state,
      pincode: teacherData.pincode,
      qualification: teacherData.qualification,
      experience: teacherData.experience,
      joiningDate: teacherData.joiningDate,
      salary: teacherData.salary,
      isActive: teacherData.isActive,
      role: teacherData.role,
      createdAt: teacherData.createdAt,
      lastLoginAt: teacherData.lastLoginAt,
      loginCount: teacherData.loginCount,
    };
  };

  const value = {
    teacherData,
    loading,
    isAuthenticated,
    updateTeacherData,
    logout,
    getTeacherInfo,
  };

  return (
    <TeacherContext.Provider value={value}>
      {children}
    </TeacherContext.Provider>
  );
};

export default TeacherContext;

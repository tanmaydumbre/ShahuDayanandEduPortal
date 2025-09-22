import { db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Fetch fee structure for specific department, class, and year
export const fetchFeeStructure = async (department, className, academicYear) => {
  try {
    const q = query(
      collection(db, 'fee-structures'),
      where('department', '==', department),
      where('class', '==', className),
      where('academicYear', '==', academicYear)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const feeStructure = querySnapshot.docs[0].data();
      return {
        success: true,
        data: feeStructure
      };
    } else {
      return {
        success: false,
        message: 'No fee structure found for the selected criteria'
      };
    }
  } catch (error) {
    console.error('Error fetching fee structure:', error);
    return {
      success: false,
      message: 'Error fetching fee structure'
    };
  }
};

// Fetch all fee structures for a department and year
export const fetchFeeStructuresByDepartment = async (department, academicYear) => {
  try {
    const q = query(
      collection(db, 'fee-structures'),
      where('department', '==', department),
      where('academicYear', '==', academicYear)
    );
    
    const querySnapshot = await getDocs(q);
    const feeStructures = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      success: true,
      data: feeStructures
    };
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    return {
      success: false,
      message: 'Error fetching fee structures'
    };
  }
};

// Calculate total fee from fee structure
export const calculateTotalFee = (feeStructure) => {
  if (!feeStructure) return 0;
  
  const feeCategories = [
    'admissionFee', 'academicFee', 'examFee', 'tutorialFee', 'libraryFee', 
    'laboratoryFee', 'gymFee', 'developmentFee', 'idCardFee', 'bonafideFee', 
    'leavingCertFee', 'duplicateLeavingFee', 'transportationFee', 'penaltyFee', 
    'trainingFee', 'sportsFee'
  ];
  
  return feeCategories.reduce((total, category) => {
    return total + (parseFloat(feeStructure[category]) || 0);
  }, 0);
};

// Get fee breakdown for display
export const getFeeBreakdown = (feeStructure) => {
  if (!feeStructure) return [];
  
  const feeCategories = [
    { key: 'admissionFee', label: 'Admission Fee' },
    { key: 'academicFee', label: 'Academic Fee' },
    { key: 'examFee', label: 'Exam Fee' },
    { key: 'tutorialFee', label: 'Tutorial Fee' },
    { key: 'libraryFee', label: 'Library Fee' },
    { key: 'laboratoryFee', label: 'Laboratory Fee' },
    { key: 'gymFee', label: 'Gym Fee' },
    { key: 'developmentFee', label: 'Development Fee' },
    { key: 'idCardFee', label: 'ID Card Fee' },
    { key: 'bonafideFee', label: 'Bonafide Certificate Fee' },
    { key: 'leavingCertFee', label: 'Leaving Certificate Fee' },
    { key: 'duplicateLeavingFee', label: 'Duplicate Leaving Certificate Fee' },
    { key: 'transportationFee', label: 'Transportation Fee' },
    { key: 'penaltyFee', label: 'Penalty Fee' },
    { key: 'trainingFee', label: 'Training Program Fee' },
    { key: 'sportsFee', label: 'Sports Day & Cultural Day Fee' }
  ];
  
  return feeCategories
    .map(category => ({
      ...category,
      amount: parseFloat(feeStructure[category.key]) || 0
    }))
    .filter(item => item.amount > 0);
};

// Default fee structure template
export const getDefaultFeeStructure = () => {
  return {
    admissionFee: 0,
    academicFee: 0,
    examFee: 0,
    tutorialFee: 0,
    libraryFee: 0,
    laboratoryFee: 0,
    gymFee: 0,
    developmentFee: 0,
    idCardFee: 0,
    bonafideFee: 0,
    leavingCertFee: 0,
    duplicateLeavingFee: 0,
    transportationFee: 0,
    penaltyFee: 0,
    trainingFee: 0,
    sportsFee: 0,
    totalFee: 0
  };
};

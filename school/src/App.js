import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NewsTicker from './components/NewsTicker';
import Home from './pages/Home';
import About from "./pages/About";
import Academics from './pages/Academics';
import Contact from './pages/Contact';
import TeachersPortal from './pages/TeachersPortal';
import TeacherLogin from './components/TeacherLogin';
import TeacherSignUp from './components/TeacherSignUp';
import TeacherDashboard from './TeacherDashboard';
import GeneralRegister from './modules/GeneralRegister';
import FeeCollection from './modules/FeeCollection';
import { LanguageProvider } from './context/LanguageContext';
import { TeacherProvider } from './context/TeacherContext';
import BonafideCertificateForm from './modules/BonafideCertificateForm';
import LeavingCertificate from './modules/LeavingCertificate';
import SlideManager from './components/SlideManager';
import Gallery from './pages/Gallery';
import Attendance from './modules/Attendance';
import AdmissionForm from './modules/AdmissionForm';
import TeachersProfile from './modules/TeachersProfile';
import Events from './modules/Events';
import FeeStructureMaster from './modules/FeeStructureMaster';
import ModuleLayout from './layouts/ModuleLayout';
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // School's primary color
    },
    secondary: {
      main: '#dc004e', // School's secondary color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
});

function App() {
  // Layout component for public pages (with navbar and footer)
  const PublicLayout = () => (
    <div className="App">
      <Navbar />
      <NewsTicker />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <TeacherProvider>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Public routes with navbar and footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/academics" element={<Academics />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/teachers-portal" element={<TeachersPortal />} />
                <Route path="/teacher-login" element={<TeacherLogin />} />
                <Route path="/teacher-signup" element={<TeacherSignUp />} />
                <Route path="/gallery" element={<Gallery />} />
              </Route>

              {/* Module routes without navbar and footer */}
              <Route element={<ModuleLayout><Outlet /></ModuleLayout>}>
                <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
                <Route path="/general-register" element={<GeneralRegister />} />
                <Route path="/fee-collection" element={<FeeCollection />} />
                <Route path="/bonafide-certificate-form" element={<BonafideCertificateForm />} />
                <Route path="/fee-collection-form" element={<FeeCollection />} />
                <Route path="/leaving-certificate" element={<LeavingCertificate />} />
                <Route path="/slide-manager" element={<SlideManager />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/admission-form" element={<AdmissionForm />} />
                <Route path="/teachers-profile" element={<TeachersProfile />} />
                <Route path="/events" element={<Events />} />
                <Route path="/fee-structure-master" element={<FeeStructureMaster />} />
              </Route>
            </Routes>
          </Router>
        </TeacherProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

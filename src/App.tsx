import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext";
import { PlatformProvider } from "./context/PlatformContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { BottomNav } from "./components/layout/BottomNav";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AuthPage } from "./pages/AuthPage";
import { DriverPortalPage } from "./pages/DriverPortalPage";
import { StudentPortalPage } from "./pages/StudentPortalPage";
import { MessagesPage } from "./pages/MessagesPage";
import { AddLineModal } from "./components/modals/AddLineModal";
import { RequestCoverageModal } from "./components/modals/RequestCoverageModal";

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [addLineModalOpen, setAddLineModalOpen] = useState(false);
  const [coverageModalOpen, setCoverageModalOpen] = useState(false);

  // If not authenticated, show role-selection & login screen directly on launch
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Toaster position="top-center" dir="rtl" richColors closeButton />
        <AuthPage />
      </div>
    );
  }

  const isDriver = user?.role === "driver";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground pb-16 lg:pb-0">
      <Toaster position="top-center" dir="rtl" richColors closeButton />
      <Navbar onOpenAddLine={() => setAddLineModalOpen(true)} />

      <div className="flex flex-1 flex-col">
        <Routes>
          {/* Driver lands on DriverPortal by default, Student lands on HomePage */}
          <Route
            path="/"
            element={isDriver ? <DriverPortalPage /> : <HomePage />}
          />
          <Route path="/home" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/driver" element={<DriverPortalPage />} />
          <Route path="/student" element={<StudentPortalPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Footer />

      {/* Mobile-first bottom navigation bar */}
      <BottomNav
        onOpenAddLine={() => setAddLineModalOpen(true)}
        onOpenCoverage={() => setCoverageModalOpen(true)}
      />

      {/* Global Modals */}
      <AddLineModal
        open={addLineModalOpen}
        onOpenChange={setAddLineModalOpen}
      />
      <RequestCoverageModal
        open={coverageModalOpen}
        onOpenChange={setCoverageModalOpen}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <PlatformProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </PlatformProvider>
    </ThemeProvider>
  );
}

export default App;

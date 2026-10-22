import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { HardwareProvider } from "./context/HardwareContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Discrete Multi-Page Components
import HomePage from "./pages/HomePage";
import PredictorPage from "./pages/PredictorPage";
import ArenaPage from "./pages/ArenaPage";
import ManifoldPage from "./pages/ManifoldPage";
import ResalePage from "./pages/ResalePage";
import VivaGuidePage from "./pages/VivaGuidePage";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error in:", this.props.name, error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 font-mono text-xs text-rose-200">
            <p className="font-bold">Page Telemetry Exception Handled Safely</p>
            <p className="mt-1 opacity-80">{this.state.error?.message || "Render exception handled"}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Automatically scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <HardwareProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-[#05070B] text-[#F1EFEA] selection:bg-[#00F5D4] selection:text-black">
          {/* Global Sticky Glowing Navbar */}
          <Navbar />

          {/* Route Outlet */}
          <main className="min-h-[calc(100vh-140px)]">
            <ErrorBoundary name="Route Outlet">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/predict" element={<PredictorPage />} />
                <Route path="/arena" element={<ArenaPage />} />
                <Route path="/manifold" element={<ManifoldPage />} />
                <Route path="/resale" element={<ResalePage />} />
                <Route path="/guide" element={<VivaGuidePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </HardwareProvider>
    </BrowserRouter>
  );
}

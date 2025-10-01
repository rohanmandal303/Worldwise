import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ContextProvider } from "./contexts/ContextProvider.jsx";

import CityList from "./Components/CityList";
import CountryList from "./Components/CountryList";
import City from "./Components/City.jsx";
import Form from "./Components/Form.jsx";
import { AuthProvider } from "./contexts/FakeAuthContext.jsx";
import ProtectedRoutes from "./pages/ProtectedRoutes.jsx";
import SpinnerFullPage from "./Components/SpinnerFullPage.jsx";

// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import HomePage from "./pages/HomePage";
// import PageNotFound from "./pages/PageNotFound";
// import AppLayout from "./pages/AppLayout";
// import Login from "./pages/Login";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const Product = lazy(() => import("./pages/Product.jsx"));
const Pricing = lazy(() => import("./pages/Pricing.jsx"));
const PageNotFound = lazy(() => import("./pages/PageNotFound.jsx"));
const AppLayout = lazy(() => import("./pages/AppLayout.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<SpinnerFullPage />}>
        <ContextProvider>
          <AuthProvider>
            <div>
              <Routes>
                <Route index element={<HomePage />} />
                <Route path="/product" element={<Product />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route
                  path="/app"
                  element={
                    <ProtectedRoutes>
                      <AppLayout />
                    </ProtectedRoutes>
                  }
                >
                  <Route index element={<Navigate replace to="cities" />} />
                  <Route path="cities" element={<CityList />} />
                  <Route path="cities/:id" element={<City />} />
                  <Route path="countries" element={<CountryList />} />
                  <Route path="form" element={<Form />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </div>
          </AuthProvider>
        </ContextProvider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

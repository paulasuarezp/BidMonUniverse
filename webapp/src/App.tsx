import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/system';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import { AccessLevel } from './shared/sharedTypes';
import { darkTheme, lightTheme } from './themes';
import { RouteRedirector } from './utils/RouteRedirector';
import CardDetail from './views/components/cardDetail/CardDetail';
import AuctionCardDetail from './views/components/cardDetail/auction/AuctionCardDetail';
import BidCardDetail from './views/components/cardDetail/bid/BidCardDetail';
import ActiveAuctions from './views/pages/ActiveAuctions';
import ActiveBids from './views/pages/ActiveBids';
import BasePage from './views/pages/BasePage';
import Home from './views/pages/Home';
import Login from './views/pages/Login';
import Logueado from './views/pages/Logueado';
import MyCollection from './views/pages/MyCollection';
import NotFoundPage from './views/pages/NotFoundPage';
import RechargeBalance from './views/pages/RechargeBalance';
import Shop from './views/pages/Shop';
import Signup from './views/pages/Signup';
import UserTransactions from './views/pages/UserTransactions';
import AdminAuctionDetail from './views/pages/admin/AdminAuctionDetail';
import AdminPage from './views/pages/admin/AdminPage';
import AuctionsAdmin from './views/pages/admin/AuctionsAdmin';




function App() {
  const [mode, setMode] = React.useState('light'); // Tema claro por defecto

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };


  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
          <CssBaseline />
          <Router>
            <BasePage toggleTheme={toggleMode} >
              <>
                <Routes>
                  <Route path="/" element={<RouteRedirector initRoute={<Home />} redirectPath="/logued" accessLevel={AccessLevel.Guest} />} />
                  <Route path="/login" element={<RouteRedirector initRoute={<Login />} redirectPath="/logued" accessLevel={AccessLevel.Guest} />} />
                  <Route path="/signup" element={<RouteRedirector initRoute={<Signup />} redirectPath="/login" accessLevel={AccessLevel.Guest} />} />
                  {/* Rutas protegidas */}
                  <Route path="/logued" element={<RouteRedirector initRoute={<Logueado />} redirectPath="/login" accessLevel={AccessLevel.Standard} />} />
                  <Route path="/album" element={<RouteRedirector initRoute={<MyCollection />} redirectPath="/login" accessLevel={AccessLevel.Standard} />} />
                  <Route path="/recharge" element={<RouteRedirector initRoute={<RechargeBalance />} redirectPath="/login" accessLevel={AccessLevel.Standard} />} />
                  <Route path="/shop" element={<RouteRedirector initRoute={<Shop />} redirectPath="/login" accessLevel={AccessLevel.Standard} />} />
                  <Route path="/transactions" element={<RouteRedirector initRoute={<UserTransactions />} redirectPath="/login" accessLevel={AccessLevel.Standard} />} />
                  <Route path="/auctions" element={<RouteRedirector initRoute={<ActiveAuctions />} redirectPath="/login" accessLevel={AccessLevel.Standard} />} />
                  <Route path="/auctions/:id" element={<RouteRedirector initRoute={<AuctionCardDetail />} redirectPath="/login" accessLevel={AccessLevel.Standard} />} />
                  <Route path="/bids" element={<RouteRedirector initRoute={<ActiveBids />} redirectPath="/login" accessLevel={AccessLevel.Standard} />} />
                  <Route path="/bids/:id" element={<RouteRedirector initRoute={<BidCardDetail />} redirectPath="/login" accessLevel={AccessLevel.Standard} />} />
                  <Route path="/card/:id" element={<RouteRedirector initRoute={<CardDetail />} redirectPath="/login" accessLevel={AccessLevel.Standard} />} />
                  {/* Rutas administrador */}
                  <Route path="/admin" element={<RouteRedirector initRoute={<AdminPage />} redirectPath="/login" accessLevel={AccessLevel.Admin} />} />
                  <Route path="/admin/auctions" element={<RouteRedirector initRoute={<AuctionsAdmin />} redirectPath="/login" accessLevel={AccessLevel.Admin} />} />
                  <Route path="/admin/auction/:id" element={<RouteRedirector initRoute={<AdminAuctionDetail />} redirectPath="/login" accessLevel={AccessLevel.Admin} />} />
                  {/* Página de Error */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </>
            </BasePage>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;

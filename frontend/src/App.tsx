import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/nav';
import HomePage from './pages/home';
import RelayListPage from './pages/relays/relays';
import RelayCreatePage from './pages/relays/create';
import RelayDetailPage from './pages/relays/view';
import pages from './config/pages';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
              <Route path={pages.home} element={<HomePage />} />
              <Route path={pages.relays.inspector} element={<HomePage />} />
              <Route path={pages.relays.list} element={<RelayListPage />} />
              <Route path={pages.relays.create} element={<RelayCreatePage />} />
              <Route path={pages.relays.view} element={<RelayDetailPage />} />
            </Routes>
        </Router>
    );
}

export default App;

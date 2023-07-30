import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/nav/nav';
import InspectorPage from './pages/inspector';
import RelayListPage from './pages/relays/relays';
import RelayCreatePage from './pages/relays/create';
import RelayDetailPage from './pages/relays/view';
import pages from './config/pages';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
              <Route path={pages.getHome()} element={<RelayListPage />} />
              <Route path={pages.getInspector()} element={<InspectorPage />} />
              <Route path={pages.getRelaysList()} element={<RelayListPage />} />
              <Route path={pages.getRelaysCreate()} element={<RelayCreatePage />} />
              <Route path={pages.getRelaysViewRaw()} element={<RelayDetailPage />} />
            </Routes>
        </Router>
    );
}

export default App;

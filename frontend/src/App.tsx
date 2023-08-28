import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/nav/nav';
import HomePage from './pages/home';
import InspectorPage from './pages/inspector';
import RelaySearchPage from './pages/relays/search';
import RelayListsPage from './pages/relays/lists';
import RelayCreatePage from './pages/relays/create';
import RelayDetailPage from './pages/relays/view';
import pages from './config/pages';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
              <Route path={pages.getHome()} element={<HomePage />} />
              <Route path={pages.getInspector()} element={<InspectorPage />} />
              <Route path={pages.getRelaySearch()} element={<RelaySearchPage />} />
              <Route path={pages.getRelaysCreate()} element={<RelayCreatePage />} />
              <Route path={pages.getRelaysViewRaw()} element={<RelayDetailPage />} />
              <Route path={pages.getRelayLists()} element={<RelayListsPage />} />
            </Routes>
        </Router>
    );
}

export default App;

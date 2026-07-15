import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import CreditsPage from './pages/CreditsPage';
import DeparturesPage from './pages/DeparturesPage';
import TicketsPage from './pages/TicketsPage';

const navItems = [
  { to: '/credits', label: 'Credits' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/tickets', label: 'Tickets' },
];

function Shell({ children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Transit operations</p>
          <h1>Booking App</h1>
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Navigate to="/credits" replace />} />
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="/schedule" element={<DeparturesPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
      </Routes>
    </Shell>
  );
}
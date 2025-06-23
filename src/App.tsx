import { useState, useEffect } from 'react';
import { Home, BookOpenCheck, Settings } from 'lucide-react';
import { useGrades } from './hooks/useGrades';
import { OverviewStats } from './components/OverviewStats';
import { GradesList } from './components/GradesList';
import { SettingsPage } from './components/SettingsPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';

function App() {
  const { grades, loading, error, refetch } = useGrades();
  const [activeTab, setActiveTab] = useState('overview');

  // Initialize theme on app startup
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const tabs = [
    {
      name: "Overzicht",
      value: "overview",
      icon: Home,
    },
    {
      name: "Cijfers",
      value: "grades",
      icon: BookOpenCheck,
    },
    {
      name: "Instellingen",
      value: "settings",
      icon: Settings,
    },
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <ErrorMessage message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewStats grades={grades} />;
      case 'grades':
        return <GradesList grades={grades} />;
      case 'settings':
        return <SettingsPage grades={grades} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-6 pb-32">
        {renderContent()}
      </main>

      {/* Bottom Dock Navigation using DaisyUI */}
      <div className="btm-nav">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.value}
              className={`${activeTab === tab.value ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.value)}
            >
              <IconComponent className="h-5 w-5" />
              <span className="btm-nav-label">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;
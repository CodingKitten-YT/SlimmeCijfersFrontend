import { useState } from 'react';
import { BarChart3, BookOpen, Home, List } from "lucide-react";
import { useGrades } from '@/hooks/useGrades';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { OverviewStats } from '@/components/OverviewStats';
import { SubjectsOverview } from '@/components/SubjectsOverview';
import { GradesList } from '@/components/GradesList';

function App() {
  const { grades, loading, error, refetch } = useGrades();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      name: "Overzicht",
      value: "overview",
      icon: Home,
    },
    {
      name: "Vakken",
      value: "subjects",
      icon: BookOpen,
    },
    {
      name: "Cijfers",
      value: "grades",
      icon: List,
    },
    {
      name: "Statistieken",
      value: "stats",
      icon: BarChart3,
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

  const studentName = grades.length > 0 ? grades[0].leerling.roepnaam : 'Student';

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <OverviewStats grades={grades} />
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-base-content">Recente cijfers</h2>
              <div className="space-y-3">
                {grades
                  .sort((a, b) => new Date(b.datumInvoer).getTime() - new Date(a.datumInvoer).getTime())
                  .slice(0, 3)
                  .map((grade, index) => (
                    <div key={`recent-${index}`} className="card bg-base-100 shadow-md">
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-base-content">{grade.vak.naam}</h3>
                            <p className="text-sm text-base-content/70">
                              {new Date(grade.datumInvoer).toLocaleDateString('nl-NL')}
                            </p>
                          </div>
                          <div className={`text-lg font-bold ${
                            parseFloat(grade.resultaat) >= 6.0 ? 'text-success' : 'text-error'
                          }`}>
                            {grade.resultaat}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );
      case 'subjects':
        return <SubjectsOverview grades={grades} />;
      case 'grades':
        return <GradesList grades={grades} />;
      case 'stats':
        return <OverviewStats grades={grades} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <header className="navbar bg-base-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto w-full px-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-base-content">Mijn Cijfers</h1>
          </div>
        </div>
      </header>

      {/* Welcome Message */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="alert alert-info">
          <span>Welkom terug, {studentName}!</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pb-32">
        {renderContent()}
      </main>

      {/* Bottom Dock Navigation using DaisyUI */}
      <div className="btm-nav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`${
                activeTab === tab.value ? 'active text-primary' : 'text-base-content/70'
              }`}
            >
              <Icon className="size-5" />
              <span className="btm-nav-label">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;
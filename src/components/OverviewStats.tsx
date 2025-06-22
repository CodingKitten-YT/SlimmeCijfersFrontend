// Update your existing OverviewStats.tsx to include navigation
import { useState } from 'react';
import { OverviewNavigation, OverviewPage } from './overview/OverviewNavigation';
import { OverviewDashboard } from './overview/OverviewDashboard';
import { AllSubjectsPage } from './overview/AllSubjectsPage';
import { SubjectDetailPage } from './overview/SubjectDetailPage';
import { Grade } from "@/types/grade";

interface OverviewStatsProps {
  grades: Grade[];
}

export function OverviewStats({ grades }: OverviewStatsProps) {
  const [currentPage, setCurrentPage] = useState<OverviewPage>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();

  const handleNavigate = (page: OverviewPage, subject?: string) => {
    setCurrentPage(page);
    setSelectedSubject(subject);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <OverviewDashboard grades={grades} onNavigate={handleNavigate} />;
      case 'all-subjects':
        return (
          <AllSubjectsPage 
            grades={grades} 
            onSubjectClick={(subject) => handleNavigate('subject-detail', subject)} 
          />
        );
      case 'subject-detail':
        return selectedSubject ? (
          <SubjectDetailPage 
            subject={selectedSubject} 
            grades={grades}
          />
        ) : null;
      default:
        return <OverviewDashboard grades={grades} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="space-y-4">
      <OverviewNavigation 
        currentPage={currentPage}
        selectedSubject={selectedSubject}
        onNavigate={handleNavigate}
      />
      {renderCurrentPage()}
    </div>
  );
}
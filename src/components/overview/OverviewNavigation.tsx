import { useEffect } from 'react';

export type OverviewPage = 'dashboard' | 'all-subjects' | 'subject-detail';

interface OverviewNavigationProps {
  currentPage: OverviewPage;
  selectedSubject?: string;
  onNavigate: (page: OverviewPage, subject?: string) => void;
}

export function OverviewNavigation({ currentPage, selectedSubject, onNavigate }: OverviewNavigationProps) {
  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedSubject]);

  const handleNavigate = (page: OverviewPage, subject?: string) => {
    onNavigate(page, subject);
    // Additional scroll to top for immediate feedback
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        label: "Overzicht",
        page: 'dashboard' as OverviewPage,
        active: currentPage === 'dashboard'
      }
    ];

    if (currentPage === 'all-subjects') {
      breadcrumbs.push({
        label: "Alle Vakken",
        page: 'all-subjects' as OverviewPage,
        active: true
      });
    }

    if (currentPage === 'subject-detail' && selectedSubject) {
      breadcrumbs.push(
        {
          label: "Alle Vakken",
          page: 'all-subjects' as OverviewPage,
          active: false
        },
        {
          label: selectedSubject,
          page: 'subject-detail' as OverviewPage,
          active: true
        }
      );
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="breadcrumbs text-sm">
      <ul>
        {breadcrumbs.map((crumb, index) => (
          <li key={index}>
            {crumb.active ? (
              <span className="text-base-content font-medium">{crumb.label}</span>
            ) : (
              <button 
                onClick={() => handleNavigate(crumb.page)}
                className="link link-hover text-base-content/70"
              >
                {crumb.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
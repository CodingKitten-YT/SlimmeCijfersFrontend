import { Grade } from "@/types/grade";
import { BookOpen } from "lucide-react";
import { StatsDisplay } from "./StatsDisplay"; // Corrected import
import { useMemo } from "react";

interface OverviewDashboardProps {
  grades: Grade[];
  onNavigate: (page: 'all-subjects' | 'subject-detail', subject?: string) => void;
}

export function OverviewDashboard({ grades, onNavigate }: OverviewDashboardProps) {
  const subjects = useMemo(() => {
    return Array.from(new Set(grades.map(g => g.vak.naam)))
      .map(subjectName => {
        const subjectGrades = grades.filter(g => g.vak.naam === subjectName);
        const validGrades = subjectGrades
          .filter(g => !g.toetsNietGemaakt && g.teltNietmee === false)
          .map(g => parseFloat(g.resultaat))
          .filter(g => !isNaN(g));
        
        const average = validGrades.length > 0 
          ? validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length 
          : 0;

        return {
          naam: subjectName,
          afkorting: subjectGrades[0]?.vak.afkorting || subjectName,
          count: subjectGrades.length,
          average
        };
      })
      .sort((a, b) => a.naam.localeCompare(b.naam));
  }, [grades]);

  return (
    <div className="space-y-6">
      {/* Main Overview Stats - Corrected Component */}
      <StatsDisplay grades={grades} />

      {/* Quick Actions */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body p-4">
          <h3 className="font-semibold text-base-content mb-3">Verkennen</h3>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => onNavigate('all-subjects')}
              className="btn btn-outline justify-start gap-3"
            >
              <BookOpen className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Alle Vakken</div>
                <div className="text-xs opacity-70">{subjects.length} vakken bekijken</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
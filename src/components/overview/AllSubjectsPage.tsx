// components/overview/AllSubjectsPage.tsx
import { Grade } from "@/types/grade";
import { useMemo } from "react";
import { BookOpen, TrendingUp, Calendar } from "lucide-react";

interface AllSubjectsPageProps {
  grades: Grade[];
  onSubjectClick: (subject: string) => void;
}

export function AllSubjectsPage({ grades, onSubjectClick }: AllSubjectsPageProps) {
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
        
        const highest = validGrades.length > 0 ? Math.max(...validGrades) : 0;
        const latest = subjectGrades
          .sort((a, b) => new Date(b.datumInvoer).getTime() - new Date(a.datumInvoer).getTime())[0];

        return {
          naam: subjectName,
          afkorting: subjectGrades[0]?.vak.afkorting || subjectName,
          count: subjectGrades.length,
          average,
          highest,
          latest: latest ? parseFloat(latest.resultaat) : null,
          latestDate: latest?.datumInvoer
        };
      })
      .sort((a, b) => b.average - a.average);
  }, [grades]);

  const getAverageColor = (avg: number) => {
    if (avg >= 7.5) return "text-success";
    if (avg >= 5.5) return "text-warning";
    return "text-error";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-base-content">Alle Vakken</h2>
          <p className="text-sm text-base-content/70">{subjects.length} vakken • {grades.length} cijfers totaal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {subjects.map((subject) => (
          <div 
            key={subject.naam}
            onClick={() => onSubjectClick(subject.naam)}
            className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <div className="card-body p-4">
              {/* Header section - similar to grade card */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content w-10 h-10 rounded-lg">
                      <span className="text-sm font-bold">{subject.afkorting.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content">{subject.naam}</h3>
                    <p className="text-sm text-base-content/70">{subject.afkorting.toUpperCase()}</p>
                  </div>
                </div>
                
                {/* Main grade display - similar to grade card */}
                <div className={`text-lg font-bold ${getAverageColor(subject.average)}`}>
                  {subject.average > 0 ? subject.average.toFixed(1) : '-'}
                </div>
              </div>

              {/* Stats section - additional info for subject cards */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-base-content/70">
                  <BookOpen className="w-4 h-4" />
                  <span>{subject.count} cijfers</span>
                </div>
                
                <div className="flex items-center gap-1 text-base-content/70">
                  <TrendingUp className="w-4 h-4" />
                  <span>Hoogste: {subject.highest > 0 ? subject.highest.toFixed(1) : '-'}</span>
                </div>
                
                <div className="flex items-center gap-1 text-base-content/70">
                  <Calendar className="w-4 h-4" />
                  <span>Laatste: {formatDate(subject.latestDate)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
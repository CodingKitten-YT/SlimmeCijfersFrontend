// components/overview/AllSubjectsPage.tsx
import { Grade } from "@/types/grade";
import { BookOpen, TrendingUp, Award } from "lucide-react";
import { useMemo } from "react";

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
    if (avg >= 8.0) return "text-success";
    if (avg >= 7.0) return "text-info";
    if (avg >= 6.0) return "text-warning";
    return "text-error";
  };

  const getAverageBg = (avg: number) => {
    if (avg >= 8.0) return "bg-success/10";
    if (avg >= 7.0) return "bg-info/10";
    if (avg >= 6.0) return "bg-warning/10";
    return "bg-error/10";
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
            className={`card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${getAverageBg(subject.average)}`}
          >
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content w-10 h-10 rounded-lg">
                      <span className="text-sm font-bold">{subject.afkorting.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content">{subject.afkorting.toUpperCase()}</h3>
                    <p className="text-xs text-base-content/60">{subject.naam}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getAverageColor(subject.average)}`}>
                    {subject.average > 0 ? subject.average.toFixed(1) : '-'}
                  </div>
                  <div className="text-xs text-base-content/60">gemiddeld</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="text-center">
                  <div className="text-sm font-semibold text-base-content">{subject.count}</div>
                  <div className="text-xs text-base-content/60">cijfers</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-base-content">
                    {subject.highest > 0 ? subject.highest.toFixed(1) : '-'}
                  </div>
                  <div className="text-xs text-base-content/60">hoogste</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-base-content">
                    {subject.latest ? subject.latest.toFixed(1) : '-'}
                  </div>
                  <div className="text-xs text-base-content/60">laatste</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
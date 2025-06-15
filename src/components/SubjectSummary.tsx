import { BookOpen, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Grade } from "@/types/grade";
import { cn } from "@/lib/utils";

interface SubjectSummaryProps {
  subject: string;
  grades: Grade[];
}

export function SubjectSummary({ subject, grades }: SubjectSummaryProps) {
  const validGrades = grades
    .filter(g => !g.toetsNietGemaakt && g.teltNietmee === false)
    .map(g => parseFloat(g.resultaat))
    .filter(g => !isNaN(g));

  const average = validGrades.length > 0 
    ? validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length 
    : 0;

  const latestGrade = validGrades[validGrades.length - 1] || 0;
  const previousGrade = validGrades[validGrades.length - 2] || latestGrade;
  const trend = latestGrade - previousGrade;

  const getTrendIcon = () => {
    if (trend > 0.2) return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend < -0.2) return <TrendingDown className="h-4 w-4 text-error" />;
    return <Minus className="h-4 w-4 text-base-content/40" />;
  };

  const getAverageColor = (avg: number) => {
    if (avg >= 7.5) return "text-success";
    if (avg >= 6.0) return "text-warning";
    return "text-error";
  };

  const getBadgeClass = (avg: number) => {
    if (avg >= 7.5) return "badge-success";
    if (avg >= 6.0) return "badge-warning";
    return "badge-error";
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200">
      <div className="card-body">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="card-title text-lg">{subject}</h3>
          </div>
          {getTrendIcon()}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-base-content/70">Gemiddelde</span>
            <div className={cn("badge badge-lg font-semibold", getBadgeClass(average))}>
              {average > 0 ? average.toFixed(1) : '-'}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-base-content/70">Aantal cijfers</span>
            <span className="font-medium">{validGrades.length}</span>
          </div>
          
          {validGrades.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-base-content/70">Laatste cijfer</span>
              <span className={cn("font-medium", getAverageColor(latestGrade))}>
                {latestGrade.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
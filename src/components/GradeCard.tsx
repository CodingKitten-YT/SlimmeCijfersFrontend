import { Calendar, BookOpen } from "lucide-react";
import { Grade } from "@/types/grade";
import { cn } from "@/lib/utils";

interface GradeCardProps {
  grade: Grade;
}

export function GradeCard({ grade }: GradeCardProps) {
  const gradeValue = parseFloat(grade.resultaat);
  const date = new Date(grade.datumInvoer).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const getBadgeClass = (value: number) => {
    if (value >= 7.5) return "badge-success";
    if (value >= 6.0) return "badge-warning";
    return "badge-error";
  };

  const getGradeStatus = (value: number) => {
    if (value >= 7.5) return "Goed";
    if (value >= 6.0) return "Voldoende";
    return "Onvoldoende";
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
      <div className="card-body">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-base-content">{grade.vak.naam}</h3>
          </div>
          <div className={cn("badge badge-lg font-medium", getBadgeClass(gradeValue))}>
            {grade.resultaat}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-base-content/70 mb-3">
          <Calendar className="h-3 w-3" />
          <span>{date}</span>
          <span className="text-base-content/30">•</span>
          <span className={cn(
            "font-medium",
            gradeValue >= 6.0 ? "text-success" : "text-error"
          )}>
            {getGradeStatus(gradeValue)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-base-content/70">Type:</span>
          <span className="font-medium text-base-content">Gemiddelde</span>
        </div>
        
        {!grade.teltNietmee && (
          <div className="mt-2 text-xs text-base-content/50">
            Telt mee voor eindcijfer
          </div>
        )}
      </div>
    </div>
  );
}
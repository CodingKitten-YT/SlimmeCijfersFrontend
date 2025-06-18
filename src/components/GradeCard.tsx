import { Grade } from "@/types/grade";

interface GradeCardProps {
  grade: Grade;
}

export function GradeCard({ grade }: GradeCardProps) {
  const gradeValue = parseFloat(grade.resultaat);
  const date = new Date(grade.datumInvoer).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const getGradeColor = (value: number) => {
    if (value >= 7.5) return 'text-success'; // Goed - green
    if (value >= 5.5) return 'text-warning'; // Voldoende - yellow/orange
    return 'text-error';                     // Onvoldoende - red
  };

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base-content">{grade.vak.naam}</h3>
            <p className="text-sm text-base-content/70">
              {date}
            </p>
          </div>
          <div className={`text-lg font-bold ${getGradeColor(gradeValue)}`}>
            {grade.resultaat}
          </div>
        </div>
      </div>
    </div>
  );
}
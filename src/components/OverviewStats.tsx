import { Calculator, TrendingUp, Award, BookOpen, House } from "lucide-react";
import { Grade } from "@/types/grade";
import { cn } from "@/lib/utils";
import { GradeCard } from "./GradeCard";

interface OverviewStatsProps {
  grades: Grade[];
}

export function OverviewStats({ grades }: OverviewStatsProps) {
  const validGrades = grades
    .filter(g => !g.toetsNietGemaakt && g.teltNietmee === false)
    .map(g => parseFloat(g.resultaat))
    .filter(g => !isNaN(g));

  const overallAverage = validGrades.length > 0 
    ? validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length 
    : 0;

  const passedGrades = validGrades.filter(g => g >= 6.0).length;
  const totalSubjects = new Set(grades.map(g => g.vak.naam)).size;
  const highestGrade = validGrades.length > 0 ? Math.max(...validGrades) : 0;

  // Get recent grades (last 5)
  const recentGrades = grades
    .sort((a, b) => new Date(b.datumInvoer).getTime() - new Date(a.datumInvoer).getTime())
    .slice(0, 10);

  const getAverageColor = (avg: number) => {
    if (avg >= 7) return "text-success";
    if (avg >= 6) return "text-warning";
    return "text-error";
  };

  const stats = [
    {
      title: "Gemiddelde",
      value: overallAverage > 0 ? overallAverage.toFixed(1) : '-',
      icon: Calculator,
      color: getAverageColor(overallAverage),
      bgColor: overallAverage >= 7 ? "bg-success/10" : overallAverage >= 6 ? "bg-warning/10" : "bg-error/10"
    },
    {
      title: "Voldoendes",
      value: `${passedGrades}/${validGrades.length}`,
      icon: TrendingUp,
      color: "text-info",
      bgColor: "bg-info/10"
    },
    {
      title: "Hoogste cijfer",
      value: highestGrade > 0 ? highestGrade.toFixed(1) : '-',
      icon: Award,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      title: "Vakken",
      value: totalSubjects.toString(),
      icon: BookOpen,
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <House className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-base-content">Overzicht</h1>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={cn("card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200", stat.bgColor)}>
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className={cn("text-2xl font-bold mt-1", stat.color)}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={cn("h-8 w-8", stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Grades Section */}
      {recentGrades.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-base-content">Recente cijfers</h2>
          <div className="space-y-3">
            {recentGrades.map((grade, index) => (
              <GradeCard key={`${grade.vak.afkorting}-${grade.datumInvoer}-${index}`} grade={grade} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
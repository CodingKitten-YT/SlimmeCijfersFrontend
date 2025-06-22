import { Grade } from "@/types/grade";
import { GradeCard } from "../GradeCard";
import { Calculator, TrendingUp, Award, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';

interface SubjectDetailPageProps {
  subject: string;
  grades: Grade[];
}

export function SubjectDetailPage({ subject, grades }: SubjectDetailPageProps) {
  const subjectGrades = grades.filter(g => g.vak.naam === subject);
  const validGrades = subjectGrades
    .filter(g => !g.toetsNietGemaakt && g.teltNietmee === false)
    .map(g => parseFloat(g.resultaat))
    .filter(g => !isNaN(g));

  const average = validGrades.length > 0 ? 
    validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length : 0;
  const highest = validGrades.length > 0 ? Math.max(...validGrades) : 0;
  const latest = subjectGrades.sort((a, b) => 
    new Date(b.datumInvoer).getTime() - new Date(a.datumInvoer).getTime()
  )[0];

  const progressionData = useMemo(() => {
    return subjectGrades
      .filter(g => !g.toetsNietGemaakt && g.teltNietmee === false)
      .sort((a, b) => new Date(a.datumInvoer).getTime() - new Date(b.datumInvoer).getTime())
      .map(grade => ({
        datum: new Date(grade.datumInvoer).toLocaleDateString('nl-NL', {
          day: 'numeric',
          month: 'short'
        }),
        cijfer: parseFloat(grade.resultaat),
        type: grade.type
      }))
      .filter(d => !isNaN(d.cijfer));
  }, [subjectGrades]);

  const getAverageColor = (avg: number) => {
    if (avg >= 8.0) return "text-success";
    if (avg >= 7.0) return "text-info";
    if (avg >= 6.0) return "text-warning";
    return "text-error";
  };

  return (
    <div className="space-y-6">
      {/* Subject Header */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body p-4">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content w-12 h-12 rounded-xl">
                <span className="text-lg font-bold">{subjectGrades[0]?.vak.afkorting.charAt(0)}</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-base-content">{subjectGrades[0]?.vak.afkorting.toUpperCase()}</h1>
              <p className="text-sm text-base-content/70">{subject}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">Gemiddelde</p>
                <p className={`text-2xl font-bold mt-1 ${getAverageColor(average)}`}>
                  {average > 0 ? average.toFixed(1) : '-'}
                </p>
              </div>
              <Calculator className={`h-8 w-8 ${getAverageColor(average)}`} />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">Hoogste</p>
                <p className="text-2xl font-bold mt-1 text-success">
                  {highest > 0 ? highest.toFixed(1) : '-'}
                </p>
              </div>
              <Award className="h-8 w-8 text-success" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">Laatste</p>
                <p className="text-2xl font-bold mt-1 text-info">
                  {latest?.resultaat || '-'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-info" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">Cijfers</p>
                <p className="text-2xl font-bold mt-1 text-accent">
                  {subjectGrades.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Grade Progression Chart */}
      {progressionData.length > 1 && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-3">
            <h3 className="font-semibold text-base-content mb-3">Cijferontwikkeling</h3>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressionData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <XAxis 
                    dataKey="datum" 
                    tick={{ fontSize: 10 }}
                    className="fill-base-content/70"
                  />
                  <YAxis 
                    domain={[1, 10]}
                    tick={{ fontSize: 10 }}
                    className="fill-base-content/70"
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="cijfer" 
                    stroke="oklch(var(--p))"
                    strokeWidth={2}
                    dot={{ fill: "oklch(var(--p))", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* All Grades */}
      <div className="space-y-3">
        <h3 className="font-semibold text-base-content">Alle cijfers ({subjectGrades.length})</h3>
        {subjectGrades
          .sort((a, b) => new Date(b.datumInvoer).getTime() - new Date(a.datumInvoer).getTime())
          .map((grade, index) => (
            <GradeCard key={`${grade.vak.afkorting}-${grade.datumInvoer}-${index}`} grade={grade} />
          ))}
      </div>
    </div>
  );
}
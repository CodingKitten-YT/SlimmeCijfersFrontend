import { useMemo } from 'react';
import { Grade } from '@/types/grade';
import { cn } from '@/lib/utils';
import { Calculator, TrendingUp, Award, BookOpen } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';

interface StatsDisplayProps {
  grades: Grade[];
}

// Custom Tooltip for Area Chart
const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="card bg-base-100 shadow-lg border border-base-300 p-3">
        <p className="text-xs text-base-content/70 mb-1">{label}</p>
        <p className="font-semibold text-primary">Gemiddelde: {data.gemiddelde}</p>
        <p className="text-xs text-base-content/70">Aantal cijfers: {data.aantalCijfers}</p>
        {data.hoogsteCijfer && (
          <p className="text-xs text-base-content/70">Hoogste: {data.hoogsteCijfer}</p>
        )}
      </div>
    );
  }
  return null;
};

export function StatsDisplay({ grades }: StatsDisplayProps) {
  const {
    overallAverage,
    passedGrades,
    validGradesCount,
    totalSubjects,
    highestGrade,
    progressionData,
    subjectAverages
  } = useMemo(() => {
    const validGrades = grades
      .filter(g => !g.toetsNietGemaakt && g.teltNietmee === false)
      .map(g => ({ ...g, resultaat: parseFloat(g.resultaat) }))
      .filter(g => !isNaN(g.resultaat));

    const overallAverage = validGrades.length > 0
      ? validGrades.reduce((sum, grade) => sum + grade.resultaat, 0) / validGrades.length
      : 0;

    const passedGrades = validGrades.filter(g => g.resultaat >= 5.5).length;
    const totalSubjects = new Set(grades.map(g => g.vak.naam)).size;
    const highestGrade = validGrades.length > 0 ? Math.max(...validGrades.map(g => g.resultaat)) : 0;

    // Improved progression data - aggregate by month to reduce overcrowding
    const sortedGrades = [...validGrades].sort((a, b) => new Date(a.datumInvoer).getTime() - new Date(b.datumInvoer).getTime());
    
    // Group grades by month
    const monthlyData = new Map();
    sortedGrades.forEach(grade => {
      const date = new Date(grade.datumInvoer);
      // Get the start of the month
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthKey = startOfMonth.toISOString().split('T')[0];
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          date: startOfMonth,
          grades: [],
          monthLabel: startOfMonth.toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' })
        });
      }
      monthlyData.get(monthKey).grades.push(grade.resultaat);
    });

    // Calculate monthly averages and running overall average
    let cumulativeSum = 0;
    let cumulativeCount = 0;
    
    const progressionData = Array.from(monthlyData.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(month => {
        // Add this month's grades to cumulative totals
        cumulativeSum += month.grades.reduce((sum: number, grade: number) => sum + grade, 0);
        cumulativeCount += month.grades.length;
        
        const monthAverage = month.grades.reduce((sum: number, grade: number) => sum + grade, 0) / month.grades.length;
        const overallAverage = cumulativeSum / cumulativeCount;
        
        return {
          datum: month.monthLabel,
          gemiddelde: parseFloat(overallAverage.toFixed(2)),
          maandGemiddelde: parseFloat(monthAverage.toFixed(2)),
          aantalCijfers: month.grades.length,
          hoogsteCijfer: Math.max(...month.grades)
        };
      });

    const subjectData = new Map();
    validGrades.forEach(grade => {
      const subject = grade.vak.naam;
      if (!subjectData.has(subject)) {
        subjectData.set(subject, { naam: subject, afkorting: grade.vak.afkorting, grades: [] });
      }
      subjectData.get(subject).grades.push(grade.resultaat);
    });

    const subjectAverages = Array.from(subjectData.values()).map(s => ({
      ...s,
      gemiddelde: parseFloat((s.grades.reduce((sum: number, g: number) => sum + g, 0) / s.grades.length).toFixed(2))
    })).sort((a, b) => b.gemiddelde - a.gemiddelde);

    return {
      overallAverage,
      passedGrades,
      validGradesCount: validGrades.length,
      totalSubjects,
      highestGrade,
      progressionData,
      subjectAverages
    };
  }, [grades]);

  const getAverageColor = (avg: number) => {
    if (avg >= 8.0) return "text-success";
    if (avg >= 7.0) return "text-info";
    if (avg >= 5.5) return "text-warning";
    return "text-error";
  };

  const stats = [
    { title: "Gemiddelde", value: overallAverage > 0 ? overallAverage.toFixed(1) : '-', icon: Calculator, color: getAverageColor(overallAverage) },
    { title: "Voldoendes", value: `${passedGrades}/${validGradesCount}`, icon: TrendingUp, color: "text-info" },
    { title: "Hoogste cijfer", value: highestGrade > 0 ? highestGrade.toFixed(1) : '-', icon: Award, color: "text-secondary" },
    { title: "Vakken", value: totalSubjects.toString(), icon: BookOpen, color: "text-accent" }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="card bg-base-100 shadow-md">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">{stat.title}</p>
                  <p className={cn("text-2xl font-bold mt-1", stat.color)}>{stat.value}</p>
                </div>
                <stat.icon className={cn("h-8 w-8", stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grade Progression Chart */}
      {progressionData.length > 1 && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-3">
            <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Ontwikkeling van gemiddelde (per maand)
            </h3>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressionData} margin={{ top: 10, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorGemiddelde" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(var(--p))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="oklch(var(--p))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="datum" 
                    tick={{ fontSize: 10 }} 
                    className="fill-base-content/70"
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={[4, 10]} 
                    tick={{ fontSize: 10 }} 
                    className="fill-base-content/70" 
                  />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="gemiddelde" 
                    stroke="oklch(var(--p))" 
                    strokeWidth={2}
                    fill="url(#colorGemiddelde)"
                    dot={{ r: 4, fill: "oklch(var(--p))" }}
                    activeDot={{ r: 6, fill: "oklch(var(--p))" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Subject Averages Bar Chart */}
      {subjectAverages.length > 0 && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-3">
            <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Gemiddelden per Vak
            </h3>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectAverages} margin={{ top: 15, right: 5, left: 0, bottom: 5 }}>
                  <XAxis dataKey="afkorting" tick={{ fontSize: 10 }} className="fill-base-content/70" />
                  <YAxis domain={[1, 10]} tick={{ fontSize: 10 }} className="fill-base-content/70" />
                  <Bar 
                    dataKey="gemiddelde" 
                    fill="oklch(var(--p))" 
                    radius={[2, 2, 0, 0]} 
                    label={{ position: 'top', fontSize: 9, fill: 'currentColor', className: 'fill-base-content' }} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
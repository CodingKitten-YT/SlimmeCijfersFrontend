import { useState, useMemo } from "react";
import { BookOpen, Filter, X, ChevronDown } from "lucide-react";
import { Grade } from "@/types/grade";
import { GradeCard } from "./GradeCard";

interface GradesListProps {
  grades: Grade[];
}

export function GradesList({ grades }: GradesListProps) {
  const [sortBy, setSortBy] = useState("date");
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Get unique subjects from grades
  const subjects = useMemo(() => {
    const uniqueSubjects = grades.reduce((acc, grade) => {
      const subject = grade.vak.naam;
      if (!acc.some(s => s.naam === subject)) {
        acc.push({
          naam: subject,
          afkorting: grade.vak.afkorting,
          count: grades.filter(g => g.vak.naam === subject).length
        });
      }
      return acc;
    }, [] as Array<{ naam: string; afkorting: string; count: number }>);
    
    return uniqueSubjects.sort((a, b) => a.naam.localeCompare(b.naam));
  }, [grades]);

  // Filter grades based on criteria
  const filteredGrades = useMemo(() => {
    return grades.filter(grade => {
      // Subject filter only
      const matchesSubject = selectedSubject === "all" || grade.vak.naam === selectedSubject;
      return matchesSubject;
    });
  }, [grades, selectedSubject]);

  // Sort grades
  const sortedGrades = useMemo(() => {
    return [...filteredGrades].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.datumInvoer).getTime() - new Date(a.datumInvoer).getTime();
        case "date-old":
          return new Date(a.datumInvoer).getTime() - new Date(b.datumInvoer).getTime();
        case "subject":
          return a.vak.naam.localeCompare(b.vak.naam);
        case "grade-high":
          return parseFloat(b.resultaat) - parseFloat(a.resultaat);
        case "grade-low":
          return parseFloat(a.resultaat) - parseFloat(b.resultaat);
        default:
          return 0;
      }
    });
  }, [filteredGrades, sortBy]);

  const clearFilters = () => {
    setSelectedSubject("all");
    setSortBy("date");
  };

  const hasActiveFilters = selectedSubject !== "all";

  // Helper functions for dropdown labels
  const getSubjectLabel = () => {
    if (selectedSubject === "all") return "Alle vakken";
    const subject = subjects.find(s => s.naam === selectedSubject);
    return subject ? subject.afkorting.toUpperCase() : selectedSubject;
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "date": return "Nieuwste";
      case "date-old": return "Oudste";
      case "subject": return "A-Z";
      case "grade-high": return "Hoog-Laag";
      case "grade-low": return "Laag-Hoog";
      default: return "Nieuwste";
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Filters Section */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body p-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Subject Filter */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-medium">Vak</span>
              </label>
              <div className="dropdown dropdown-bottom w-full">
                <div tabIndex={0} role="button" className="btn btn-sm btn-outline w-full justify-between">
                  <span className="text-left text-sm">{getSubjectLabel()}</span>
                  <ChevronDown className="h-3 w-3" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow-xl border border-base-200">
                  <li>
                    <button 
                      className={`text-sm ${selectedSubject === "all" ? "active" : ""}`}
                      onClick={() => setSelectedSubject("all")}
                    >
                      <span>Alle vakken</span>
                      <span className="badge badge-neutral badge-xs">{grades.length}</span>
                    </button>
                  </li>
                  <div className="divider my-0"></div>
                  {subjects.map((subject) => (
                    <li key={subject.naam}>
                      <button 
                        className={`text-sm ${selectedSubject === subject.naam ? "active" : ""}`}
                        onClick={() => setSelectedSubject(subject.naam)}
                      >
                        <span>{subject.afkorting.toUpperCase()}</span>
                        <span className="badge badge-primary badge-xs">{subject.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sort Filter */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-medium">Sorteren</span>
              </label>
              <div className="dropdown dropdown-bottom w-full">
                <div tabIndex={0} role="button" className="btn btn-sm btn-outline w-full justify-between">
                  <span className="text-left text-sm">{getSortLabel()}</span>
                  <ChevronDown className="h-3 w-3" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow-xl border border-base-200">
                  <li>
                    <button 
                      className={`text-sm ${sortBy === "date" ? "active" : ""}`}
                      onClick={() => setSortBy("date")}
                    >
                      Nieuwste eerst
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`text-sm ${sortBy === "date-old" ? "active" : ""}`}
                      onClick={() => setSortBy("date-old")}
                    >
                      Oudste eerst
                    </button>
                  </li>
                  <div className="divider my-0"></div>
                  <li>
                    <button 
                      className={`text-sm ${sortBy === "subject" ? "active" : ""}`}
                      onClick={() => setSortBy("subject")}
                    >
                      Alfabetisch
                    </button>
                  </li>
                  <div className="divider my-0"></div>
                  <li>
                    <button 
                      className={`text-sm ${sortBy === "grade-high" ? "active" : ""}`}
                      onClick={() => setSortBy("grade-high")}
                    >
                      Hoog → Laag
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`text-sm ${sortBy === "grade-low" ? "active" : ""}`}
                      onClick={() => setSortBy("grade-low")}
                    >
                      Laag → Hoog
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-3 pt-2 border-t border-base-200">
              <div className="flex flex-wrap gap-1">
                {selectedSubject !== "all" && (
                  <div className="badge badge-primary badge-sm gap-1">
                    <span>{subjects.find(s => s.naam === selectedSubject)?.afkorting.toUpperCase()}</span>
                    <button 
                      onClick={() => setSelectedSubject("all")}
                      className="btn btn-ghost btn-xs p-0 h-auto min-h-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-base-content/70">
        <span>
          {sortedGrades.length} van {grades.length} {sortedGrades.length === 1 ? 'cijfer' : 'cijfers'}
        </span>
        {subjects.length > 0 && (
          <span>
            {subjects.length} {subjects.length === 1 ? 'vak' : 'vakken'}
          </span>
        )}
      </div>

      {/* Grades List */}
      <div className="space-y-3">
        {sortedGrades.map((grade, index) => (
          <GradeCard key={`${grade.vak.afkorting}-${grade.datumInvoer}-${index}`} grade={grade} />
        ))}
        
        {sortedGrades.length === 0 && (
          <div className="card bg-base-100 shadow-md">
            <div className="card-body text-center py-12">
              <Filter className="h-16 w-16 mx-auto mb-4 text-base-content/20" />
              <h3 className="text-lg font-semibold text-base-content/70 mb-2">
                Geen cijfers gevonden
              </h3>
              <p className="text-sm text-base-content/50 mb-4">
                Probeer je filters aan te passen om meer resultaten te zien
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn btn-outline">
                  <X className="h-4 w-4" />
                  Alle filters wissen
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
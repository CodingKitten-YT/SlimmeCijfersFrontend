import { useState, useMemo } from "react";
import { SortAsc, BookOpen, Filter, X } from "lucide-react";
import { Grade } from "@/types/grade";
import { GradeCard } from "./GradeCard";

interface GradesListProps {
  grades: Grade[];
}

export function GradesList({ grades }: GradesListProps) {
  const [sortBy, setSortBy] = useState("date");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");

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
      // Subject filter
      const matchesSubject = selectedSubject === "all" || grade.vak.naam === selectedSubject;
      
      // Grade filter
      const gradeValue = parseFloat(grade.resultaat);
      let matchesGrade = true;
      if (gradeFilter === "excellent") matchesGrade = gradeValue >= 8.0;
      else if (gradeFilter === "good") matchesGrade = gradeValue >= 7.0 && gradeValue < 8.0;
      else if (gradeFilter === "sufficient") matchesGrade = gradeValue >= 6.0 && gradeValue < 7.0;
      else if (gradeFilter === "insufficient") matchesGrade = gradeValue < 6.0;
      
      return matchesSubject && matchesGrade;
    });
  }, [grades, selectedSubject, gradeFilter]);

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
    setGradeFilter("all");
    setSortBy("date");
  };

  const hasActiveFilters = selectedSubject !== "all" || gradeFilter !== "all";

  return (
    <div className="space-y-4">
      {/* Header with clear filters */}
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-base-content">
          Cijferlijst
        </h1>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="btn btn-ghost btn-xs text-base-content/70 hover:text-base-content"
          >
            <X className="h-3 w-3" />
            Wissen
          </button>
        )}
      </div>

      {/* Compact Filters */}
      <div className="bg-base-100 rounded-lg p-3 shadow-sm space-y-3">
        {/* Filter Row */}
        <div className="grid grid-cols-3 gap-2">
          {/* Subject Filter */}
          <div>
            <select 
              className="select select-bordered select-xs w-full text-xs"
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">Alle vakken</option>
              {subjects.map((subject) => (
                <option key={subject.naam} value={subject.naam}>
                  {subject.afkorting.toUpperCase()} ({subject.count})
                </option>
              ))}
            </select>
          </div>

          {/* Grade Filter */}
          <div>
            <select 
              className="select select-bordered select-xs w-full text-xs"
              value={gradeFilter} 
              onChange={(e) => setGradeFilter(e.target.value)}
            >
              <option value="all">Alle cijfers</option>
              <option value="excellent">8.0+</option>
              <option value="good">7.0-7.9</option>
              <option value="sufficient">6.0-6.9</option>
              <option value="insufficient">&lt;6.0</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <select 
              className="select select-bordered select-xs w-full text-xs"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Nieuwste</option>
              <option value="date-old">Oudste</option>
              <option value="subject">A-Z</option>
              <option value="grade-high">Hoog-Laag</option>
              <option value="grade-low">Laag-Hoog</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1">
            {selectedSubject !== "all" && (
              <div className="badge badge-primary badge-sm gap-1">
                {subjects.find(s => s.naam === selectedSubject)?.afkorting.toUpperCase() || selectedSubject}
                <button onClick={() => setSelectedSubject("all")}>
                  <X className="h-2 w-2" />
                </button>
              </div>
            )}
            {gradeFilter !== "all" && (
              <div className="badge badge-secondary badge-sm gap-1">
                {gradeFilter === "excellent" ? "8.0+" : 
                 gradeFilter === "good" ? "7.0-7.9" :
                 gradeFilter === "sufficient" ? "6.0-6.9" : "<6.0"}
                <button onClick={() => setGradeFilter("all")}>
                  <X className="h-2 w-2" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-xs text-base-content/70 px-1">
        {sortedGrades.length} van {grades.length} {sortedGrades.length === 1 ? 'cijfer' : 'cijfers'}
        {subjects.length > 0 && ` • ${subjects.length} ${subjects.length === 1 ? 'vak' : 'vakken'}`}
      </div>

      {/* Grades List */}
      <div className="space-y-3">
        {sortedGrades.map((grade, index) => (
          <GradeCard key={`${grade.vak.afkorting}-${grade.datumInvoer}-${index}`} grade={grade} />
        ))}
        
        {sortedGrades.length === 0 && (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body text-center py-8">
              <Filter className="h-12 w-12 mx-auto mb-3 text-base-content/30" />
              <h3 className="text-base font-medium text-base-content/70 mb-2">
                Geen cijfers gevonden
              </h3>
              <p className="text-xs text-base-content/50 mb-3">
                Probeer je filters aan te passen
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn btn-outline btn-xs">
                  Filters wissen
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
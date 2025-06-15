import { useState } from "react";
import { Search, SortAsc, BookOpen } from "lucide-react";
import { Grade } from "@/types/grade";
import { GradeCard } from "./GradeCard";

interface GradesListProps {
  grades: Grade[];
}

export function GradesList({ grades }: GradesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Filter grades based on search query
  const filteredGrades = grades.filter(grade =>
    grade.vak.naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grade.vak.afkorting.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort grades
  const sortedGrades = [...filteredGrades].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.datumInvoer).getTime() - new Date(a.datumInvoer).getTime();
      case "subject":
        return a.vak.naam.localeCompare(b.vak.naam);
      case "grade":
        return parseFloat(b.resultaat) - parseFloat(a.resultaat);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="form-control">
          <div className="input-group">
            <span className="bg-base-200">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Zoek vakken..."
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-base-content/70" />
          <select 
            className="select select-bordered w-full"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Nieuwste eerst</option>
            <option value="subject">Vak (A-Z)</option>
            <option value="grade">Cijfer (Hoog-Laag)</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-base-content/70">
        {sortedGrades.length} {sortedGrades.length === 1 ? 'cijfer' : 'cijfers'} gevonden
      </div>

      {/* Grades list */}
      <div className="space-y-3">
        {sortedGrades.map((grade, index) => (
          <GradeCard key={`${grade.vak.afkorting}-${grade.datumInvoer}-${index}`} grade={grade} />
        ))}
        
        {sortedGrades.length === 0 && (
          <div className="text-center py-8 text-base-content/70">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-base-content/30" />
            <p>Geen cijfers gevonden</p>
            <p className="text-sm">Probeer een andere zoekopdracht</p>
          </div>
        )}
      </div>
    </div>
  );
}
import { Grade } from "@/types/grade";
import { SubjectSummary } from "./SubjectSummary";

interface SubjectsOverviewProps {
  grades: Grade[];
}

export function SubjectsOverview({ grades }: SubjectsOverviewProps) {
  // Group grades by subject
  const groupedGrades = grades.reduce((acc, grade) => {
    const subject = grade.vak.naam;
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(grade);
    return acc;
  }, {} as Record<string, Grade[]>);

  // Sort subjects alphabetically
  const sortedSubjects = Object.keys(groupedGrades).sort();

  return (
    <div className="space-y-4">
      <div className="text-sm text-base-content/70">
        {sortedSubjects.length} {sortedSubjects.length === 1 ? 'vak' : 'vakken'}
      </div>
      
      <div className="space-y-3">
        {sortedSubjects.map((subject) => (
          <SubjectSummary
            key={subject}
            subject={subject}
            grades={groupedGrades[subject]}
          />
        ))}
      </div>
    </div>
  );
}
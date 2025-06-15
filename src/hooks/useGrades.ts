import { useState, useEffect } from 'react';
import { GradesResponse, Grade } from '@/types/grade';

export function useGrades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://slimmecijfers.1242601565.workers.dev/grades');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: GradesResponse = await response.json();
        setGrades(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch grades');
        console.error('Error fetching grades:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const refetch = async () => {
    await fetchGrades();
  };

  return { grades, loading, error, refetch };
}
import { useState, useEffect } from 'react';
import { GradesResponse, Grade } from '@/types/grade';

export function useGrades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchGrades = async () => {
      try {
        console.log('🔄 Starting to fetch grades...');
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://rawcdn.githack.com/CodingKitten-YT/files/1308e95608d65afb3bbabbf542bc617a52bd96d4/grades.json');
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: GradesResponse = await response.json();
        console.log('📊 Data received:', data);
        
        if (isMounted) {
          setGrades(data.items || []);
          console.log('✅ Grades set:', data.items?.length || 0, 'items');
        }
      } catch (err) {
        console.error('❌ Error fetching grades:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch grades');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log('🏁 Loading finished');
        }
      }
    };

    fetchGrades();

    return () => {
      isMounted = false;
    };
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://rawcdn.githack.com/CodingKitten-YT/files/1308e95608d65afb3bbabbf542bc617a52bd96d4/grades.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: GradesResponse = await response.json();
      setGrades(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch grades');
    } finally {
      setLoading(false);
    }
  };

  return { grades, loading, error, refetch };
}
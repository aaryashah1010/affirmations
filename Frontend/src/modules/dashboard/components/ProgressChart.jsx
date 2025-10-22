import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Clock } from 'lucide-react';
import { sessionAPI } from '../../../api/index.js';
import { formatDate, formatDuration } from '../../../shared/utils/formatDate.js';
import Loader from '../../../shared/components/Loader.jsx';

const ProgressChart = ({ days = 30 }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await sessionAPI.getSessionStats({ days });
        setStats(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [days]);

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center h-64">
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-center text-red-600">
          <p>Failed to load progress data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(stats.totalMinutes)}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Mood Improvement</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.moodImprovement > 0 ? '+' : ''}{stats.moodImprovement}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions Over Time</h3>
        {stats.chartData.length > 0 ? (
          <div className="space-y-4">
            {stats.chartData.slice(-7).map((day, index) => (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-20 text-sm text-gray-600">
                  {formatDate(day.date, { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-4 relative">
                  <div 
                    className="bg-primary-500 h-4 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((day.sessions / Math.max(...stats.chartData.map(d => d.sessions))) * 100, 100)}%` 
                    }}
                  />
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">
                  {day.sessions} sessions
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No sessions recorded yet</p>
            <p className="text-sm">Start practicing affirmations to see your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;

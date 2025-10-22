import { useState } from 'react';
import { Heart, Clock, TrendingUp, Calendar } from 'lucide-react';
import { formatDate, formatDuration } from '../../../shared/utils/formatDate.js';
import { cn } from '../../../shared/utils/cn.js';

const SessionCard = ({ session, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMoodColor = (mood) => {
    if (mood >= 8) return 'text-green-600 bg-green-50';
    if (mood >= 6) return 'text-yellow-600 bg-yellow-50';
    if (mood >= 4) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getMoodLabel = (mood) => {
    if (mood >= 8) return 'Excellent';
    if (mood >= 6) return 'Good';
    if (mood >= 4) return 'Okay';
    return 'Needs Work';
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="card-content">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {session.problems?.title || 'Session'}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(session.completed_at)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(session.duration_minutes)}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        {/* Mood indicators */}
        <div className="flex items-center space-x-4 mb-4">
          {session.mood_before && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Before:</span>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                getMoodColor(session.mood_before)
              )}>
                {session.mood_before}/10 - {getMoodLabel(session.mood_before)}
              </span>
            </div>
          )}
          
          {session.mood_after && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">After:</span>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                getMoodColor(session.mood_after)
              )}>
                {session.mood_after}/10 - {getMoodLabel(session.mood_after)}
              </span>
            </div>
          )}
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            {session.affirmations_practiced?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Affirmations Practiced ({session.affirmations_practiced.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {session.affirmations_practiced.map((id, index) => (
                    <span 
                      key={id}
                      className="inline-flex items-center px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                    >
                      <Heart className="w-3 h-3 mr-1" />
                      Affirmation {index + 1}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {session.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {session.notes}
                </p>
              </div>
            )}

            {/* Mood improvement indicator */}
            {session.mood_before && session.mood_after && (
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">
                  Mood improved by {session.mood_after - session.mood_before} points
                </span>
              </div>
            )}

            {onEdit && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => onEdit(session)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Edit Session
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;

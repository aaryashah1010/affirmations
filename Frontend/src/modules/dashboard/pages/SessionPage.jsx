import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Heart } from 'lucide-react';
import { sessionAPI } from '../../../api/index.js';
import SessionCard from '../components/SessionCard.jsx';
import Button from '../../../shared/components/Button.jsx';
import Loader from '../../../shared/components/Loader.jsx';

const SessionPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await sessionAPI.getUserSessions();
        setSessions(response.sessions);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleCreateSession = () => {
    setShowCreateModal(true);
  };

  const handleEditSession = (session) => {
    // TODO: Implement edit session functionality
    console.log('Edit session:', session);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>Failed to load sessions</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Practice Sessions</h1>
          <p className="text-gray-600 mt-2">
            Track your affirmation practice and monitor your progress
          </p>
        </div>
        <Button onClick={handleCreateSession}>
          <Plus className="w-4 h-4 mr-2" />
          New Session
        </Button>
      </div>

      {/* Sessions List */}
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onEdit={handleEditSession}
            />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No sessions yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start your affirmation journey by creating your first practice session
          </p>
          <Button onClick={handleCreateSession}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Session
          </Button>
        </div>
      )}

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create New Session
            </h2>
            <p className="text-gray-600 mb-4">
              This feature will be implemented in the next version. For now, you can view your existing sessions.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionPage;

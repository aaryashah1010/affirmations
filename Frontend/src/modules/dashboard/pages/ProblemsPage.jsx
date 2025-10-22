import { useState, useEffect } from 'react';
import { Plus, Heart, Brain, Target, DollarSign, Zap } from 'lucide-react';
import { userAPI } from '../../../api/index.js';
import Button from '../../../shared/components/Button.jsx';
import Loader from '../../../shared/components/Loader.jsx';
import { formatDate } from '../../../shared/utils/formatDate.js';

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [problemsResponse, categoriesResponse] = await Promise.all([
          userAPI.getProblems(),
          userAPI.getProblemCategories()
        ]);
        
        setProblems(problemsResponse.problems);
        setCategories(categoriesResponse.categories);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'financial': DollarSign,
      'mental': Brain,
      'physical': Target,
      'emotional': Heart,
      'career': Zap,
      'spiritual': Heart
    };
    return iconMap[categoryName] || Heart;
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
        <p>Failed to load problems: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Problems</h1>
          <p className="text-gray-600 mt-2">
            Track and work through your personal challenges
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Problem
        </Button>
      </div>

      {/* Problems List */}
      {problems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem) => {
            const IconComponent = getCategoryIcon(problem.problem_categories?.name);
            return (
              <div key={problem.id} className="card hover:shadow-md transition-shadow">
                <div className="card-content">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {problem.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {problem.problem_categories?.name || 'Uncategorized'}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {problem.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Severity: {problem.severity}/10</span>
                    <span>{formatDate(problem.created_at)}</span>
                  </div>
                  
                  {problem.affirmations?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        {problem.affirmations.length} affirmations generated
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No problems yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start your affirmation journey by adding your first problem
          </p>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Problem
          </Button>
        </div>
      )}

      {/* Create Problem Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add New Problem
            </h2>
            <p className="text-gray-600 mb-4">
              This feature will be fully implemented in the next version. For now, you can view the problem categories and structure.
            </p>
            
            <div className="space-y-3 mb-6">
              <h3 className="font-medium text-gray-900">Available Categories:</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category.name);
                  return (
                    <div key={category.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700 capitalize">
                        {category.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Close
              </Button>
              <Button onClick={() => setShowCreateForm(false)}>
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemsPage;

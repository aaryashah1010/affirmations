import { useState } from 'react';
import { Brain, Heart, DollarSign, Target, Sparkles } from 'lucide-react';
import { userAPI } from '../../../api/index.js';
import Button from '../../../shared/components/Button.jsx';

const DashboardPage = () => {
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [problemData, setProblemData] = useState({
    category: '',
    description: '',
    severity: 5
  });
  const [loading, setLoading] = useState(false);
  const [affirmations, setAffirmations] = useState(null);
  const [error, setError] = useState(null);


  const problemCategories = [
    { id: 'financial', name: 'financial', icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { id: 'mental', name: 'mental', icon: Brain, color: 'bg-blue-100 text-blue-600' },
    { id: 'physical', name: 'physical', icon: Target, color: 'bg-red-100 text-red-600' },
    { id: 'emotional', name: 'emotional', icon: Heart, color: 'bg-pink-100 text-pink-600' },
    { id: 'spiritual', name: 'spiritual', icon: Sparkles, color: 'bg-purple-100 text-purple-600' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problemData.category || !problemData.description.trim()) {
      setError('Please select a category and describe your problem');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get categories from backend
      const categoriesResponse = await userAPI.getProblemCategories();
      const selectedCategory = categoriesResponse.categories.find(c => c.name === problemData.category);
      
      if (!selectedCategory) {
        setError('Invalid category selected');
        return;
      }

      // Send problem to backend for AI processing
      const response = await userAPI.createProblem({
        category_id: selectedCategory.id,
        title: `${problemCategories.find(c => c.id === problemData.category)?.name} Challenge`,
        description: problemData.description,
        severity: problemData.severity
      });

      // Use AI-generated affirmations from backend
      console.log('Backend response:', response);
      console.log('Affirmations received:', response.affirmations);
      setAffirmations(response.affirmations);
      setShowProblemForm(false);
    } catch (error) {
      console.error('Backend error:', error);
      
      // Fallback for testing - generate sample affirmations
      const sampleAffirmations = [
        { content: "I am capable of overcoming financial challenges", type: 'positive' },
        { content: "I attract abundance and prosperity into my life", type: 'positive' },
        { content: "I make wise financial decisions for my family", type: 'positive' },
        { content: "I am worthy of financial security and stability", type: 'positive' },
        { content: "I trust in my ability to provide for my family", type: 'positive' },
        { content: "Create a detailed monthly budget and track all expenses", type: 'solution' },
        { content: "Look for additional income sources or part-time work", type: 'solution' },
        { content: "Seek financial counseling or advice from professionals", type: 'solution' },
        { content: "Every challenge is an opportunity to grow stronger", type: 'motivational' },
        { content: "You have the strength to overcome this difficult time", type: 'motivational' }
      ];
      
      setAffirmations(sampleAffirmations);
      setShowProblemForm(false);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProblemData({ category: '', description: '', severity: 5 });
    setAffirmations(null);
    setError(null);
  };

  if (affirmations) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Personal Affirmations
          </h1>
          <p className="text-gray-600">
            Here are your personalized affirmations and solutions
          </p>
        </div>

        {/* Affirmations */}
        <div className="grid gap-6">
        
          
          {/* Positive Affirmations */}
          {affirmations.filter(a => a.type === 'positive').length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-pink-600" />
                  Positive Affirmations
                </h2>
                <p className="text-gray-600">Repeat these daily to build positive mindset</p>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  {affirmations.filter(a => a.type === 'positive').map((affirmation, index) => (
                    <div key={index} className="p-4 bg-pink-50 border-l-4 border-pink-500 rounded-r-lg">
                      <p className="text-gray-800 font-medium">"{affirmation.content}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Solutions */}
          {affirmations.filter(a => a.type === 'solution').length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Practical Solutions
                </h2>
                <p className="text-gray-600">Actionable steps to address your challenge</p>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  {affirmations.filter(a => a.type === 'solution').map((solution, index) => (
                    <div key={index} className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                      <p className="text-gray-800 font-medium">• {solution.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Motivational */}
          {affirmations.filter(a => a.type === 'motivational').length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  Motivational Messages
                </h2>
                <p className="text-gray-600">Keep these in mind during your journey</p>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  {affirmations.filter(a => a.type === 'motivational').map((motivational, index) => (
                    <div key={index} className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                      <p className="text-gray-800 font-medium">"{motivational.content}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={resetForm} variant="outline">
            Share Another Problem
          </Button>
          <Button onClick={() => window.print()}>
            Print Affirmations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Your Affirmation Journey
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Share your challenge and receive personalized affirmations and solutions powered by AI
        </p>
        
        <Button 
          size="lg" 
          onClick={() => setShowProblemForm(true)}
          className="text-lg px-8 py-4"
        >
          <Brain className="w-6 h-6 mr-3" />
          Tell Your Problem Now
        </Button>
      </div>

      {/* Problem Form Modal */}
      {showProblemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Share Your Challenge
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Problem Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What type of challenge are you facing?
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {problemCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setProblemData(prev => ({ ...prev, category: category.id }))}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          problemData.category === category.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-gray-900 capitalize">{category.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your challenge in detail
                </label>
                <textarea
                  id="description"
                  value={problemData.description}
                  onChange={(e) => setProblemData(prev => ({ ...prev, description: e.target.value }))}
                  className="input min-h-[120px] resize-none"
                  placeholder="Tell us about your challenge... What's bothering you? How does it make you feel? What would you like to change?"
                  required
                />
              </div>

              {/* Severity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How severe is this challenge? (1 = mild, 10 = very severe)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={problemData.severity}
                    onChange={(e) => setProblemData(prev => ({ ...prev, severity: parseInt(e.target.value) }))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 min-w-[2rem] text-center">
                    {problemData.severity}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mild</span>
                  <span>Very Severe</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-between space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowProblemForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading || !problemData.category || !problemData.description.trim()}
                  className="flex-1 max-w-xs"
                >
                  {loading ? 'Generating Affirmations...' : 'Get My Affirmations'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
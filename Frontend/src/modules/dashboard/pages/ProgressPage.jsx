import { useState } from 'react';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import ProgressChart from '../components/ProgressChart.jsx';
import Button from '../../../shared/components/Button.jsx';

const ProgressPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  const periods = [
    { value: 7, label: 'Last 7 days' },
    { value: 30, label: 'Last 30 days' },
    { value: 90, label: 'Last 90 days' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
          <p className="text-gray-600 mt-2">
            Monitor your affirmation journey and see how you're growing
          </p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="card p-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Time Period:</span>
          <div className="flex space-x-2">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <ProgressChart days={selectedPeriod} />

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Consistency</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Track your daily practice to build a consistent affirmation routine. 
            Consistency is key to seeing real change in your mindset and well-being.
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-secondary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Growth</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Monitor your mood improvements and emotional growth over time. 
            Small daily improvements lead to significant long-term changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;

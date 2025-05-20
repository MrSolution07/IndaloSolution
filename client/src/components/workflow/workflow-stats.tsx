import { Card } from "@/components/ui/card";

interface WorkflowStatsProps {
  activeWorkflows: number;
  runsToday: number;
  successRate: number;
  connectedApps: number;
  isLoading?: boolean;
}

export default function WorkflowStats({ 
  activeWorkflows, 
  runsToday, 
  successRate, 
  connectedApps,
  isLoading = false
}: WorkflowStatsProps) {
  const formatSuccessRate = (rate: number) => {
    return rate.toFixed(1) + '%';
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="p-5">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-md bg-gray-200"></div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Active Workflows */}
      <Card>
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-light rounded-md p-3">
              <i className="ri-flow-chart text-white text-xl"></i>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Workflows</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{activeWorkflows}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </Card>

      {/* Runs Today */}
      <Card>
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-secondary-light rounded-md p-3">
              <i className="ri-rocket-line text-white text-xl"></i>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Runs Today</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{runsToday}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </Card>

      {/* Success Rate */}
      <Card>
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-success rounded-md p-3">
              <i className="ri-check-double-line text-white text-xl"></i>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{formatSuccessRate(successRate)}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </Card>

      {/* Connected Apps */}
      <Card>
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accent-light rounded-md p-3">
              <i className="ri-apps-2-line text-white text-xl"></i>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Connected Apps</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{connectedApps}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

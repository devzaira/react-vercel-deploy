import React from 'react';
import { Button } from './ui/button';
import { CategoryDropdown } from './CategoryDropdown';
import { AppCard } from './AppCard';
import { AppSidePanel } from './AppSidePanel';
import { App, TabType } from '../types';

interface AppsPageProps {
  apps: App[];
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedApp: App | null;
  onAppSelect: (app: App | null) => void;
  onInstall: (app: App, version?: string) => void;
  onRequest: (app: App, reason: string) => void;
  onNavigateToRequests?: (appId: string) => void;
  searchQuery: string;
}

export function AppsPage({
  apps,
  categories,
  selectedCategories,
  onCategoryChange,
  activeTab,
  onTabChange,
  selectedApp,
  onAppSelect,
  onInstall,
  onRequest,
  onNavigateToRequests,
  searchQuery
}: AppsPageProps) {
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
                           selectedCategories.includes(app.category);
    
    const matchesTab = activeTab === 'all' || app.type === activeTab;
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  // No pagination needed - show all filtered apps

  const handleAppInstall = (app: App) => {
    onInstall(app);
  };

  const handleAppRequest = (app: App) => {
    // You may want to prompt for a reason elsewhere, but this matches the expected signature
    onRequest(app, "");
  };

  return (
    <div className="flex-1 bg-transparent dark:bg-gray-900 min-h-0 h-full">
      <div className="h-full flex relative">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${selectedApp ? 'lg:mr-[461px]' : ''} min-h-0`}>
          <div className="p-3 md:p-4 h-full flex flex-col min-h-0">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl shadow-blue-500/5 dark:shadow-blue-400/10 p-4 md:p-6 h-full flex flex-col min-h-0">
            {/* Navigation Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              {/* Left side: Tab Menu */}
              <div className="flex justify-center xs:justify-start lg:justify-start order-1 lg:order-1">
                <div className="flex bg-blue-100 dark:bg-gray-700 rounded-lg p-1 shadow-sm w-fit">
                  <Button
                    variant={activeTab === 'all' ? 'default' : 'ghost'}
                    onClick={() => onTabChange('all')}
                    className={`px-3 sm:px-4 md:px-6 py-2 text-sm rounded-md transition-all ${
                      activeTab === 'all' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
                        : 'text-blue-700 hover:bg-blue-200 dark:text-white dark:hover:text-blue-700 dark:hover:bg-blue-200-op10'
                    }`}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={activeTab === 'free' ? 'default' : 'ghost'}
                    onClick={() => onTabChange('free')}
                    className={`px-3 sm:px-4 md:px-6 py-2 text-sm rounded-md transition-all ${
                      activeTab === 'free' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
                        : 'text-blue-700 hover:bg-blue-200 dark:text-white dark:hover:text-blue-700 dark:hover:bg-blue-200-op10'
                    }`}
                    size="sm"
                  >
                    Free
                  </Button>
                  <Button
                    variant={activeTab === 'paid' ? 'default' : 'ghost'}
                    onClick={() => onTabChange('paid')}
                    className={`px-3 sm:px-4 md:px-6 py-2 text-sm rounded-md transition-all ${
                      activeTab === 'paid' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
                        : 'text-blue-700 hover:bg-blue-200 dark:text-white dark:hover:text-blue-700 dark:hover:bg-blue-200-op10'
                    }`}
                    size="sm"
                  >
                    Paid
                  </Button>
                </div>
              </div>

              {/* Right side: Results count and Category dropdown */}
              <div className="flex flex-row items-center justify-end gap-3 sm:gap-4 order-2 lg:order-2 lg:justify-end min-w-0">
                <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap flex items-center h-10">
                  {filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''} found
                </div>
                <div className="flex-shrink-0">
                  <CategoryDropdown
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={onCategoryChange}
                  />
                </div>
              </div>
            </div>

            {/* Apps Grid */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden min-h-0 flex flex-col">
              <div className="flex-1 overflow-y-auto p-3 md:p-4">
                {filteredApps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-6xl mb-4">📱</div>
                    <h3 className="text-lg font-medium mb-2">No apps found</h3>
                    <p className="text-center">
                      {searchQuery ? 'Try adjusting your search or filters' : 'No apps match the current filters'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                    {filteredApps.map((app) => (
                      <AppCard
                        key={app.id}
                        app={app}
                        onInstall={handleAppInstall}
                        onRequest={handleAppRequest}
                        onClick={onAppSelect}
                        isSelected={selectedApp?.id === app.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <AppSidePanel
          app={selectedApp}
          isOpen={!!selectedApp}
          onClose={() => onAppSelect(null)}
          onInstall={handleAppInstall}
          onRequest={handleAppRequest}
          onNavigateToRequests={onNavigateToRequests}
        />
      </div>
    </div>
  );
}
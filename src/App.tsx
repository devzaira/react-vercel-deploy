import React, { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { Header } from './components/Header';
import { AppsPage } from './components/AppsPage';
import { RequestsTable } from './components/RequestsTable';
import { InstallDialog } from './components/InstallDialog';
import { RequestDialog } from './components/RequestDialog';
import { InstallNotification } from './components/InstallNotification';
import { mockApps, mockRequests, categories } from './data/mockData';
import { App, AppRequest, ViewMode, TabType, RequestTabType } from './types';

export default function App() {
  // Global state
  const [apps, setApps] = useState<App[]>(mockApps);
  const [requests, setRequests] = useState<AppRequest[]>(mockRequests);
  const [currentView, setCurrentView] = useState<ViewMode>('apps');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Apps page state
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  // Requests page state
  const [requestSearchQuery, setRequestSearchQuery] = useState('');
  const [activeRequestTab, setActiveRequestTab] = useState<RequestTabType>('all');
  const [expandedRequestId, setExpandedRequestId] = useState<string | undefined>(undefined);

  // Pagination state (only for requests)
  const [requestsCurrentPage, setRequestsCurrentPage] = useState(1);
  const [requestsPerPage, setRequestsPerPage] = useState(10);

  // Dialog state
  const [installDialog, setInstallDialog] = useState<{ isOpen: boolean; app: App | null }>({
    isOpen: false,
    app: null
  });
  const [requestDialog, setRequestDialog] = useState<{ isOpen: boolean; app: App | null }>({
    isOpen: false,
    app: null
  });

  // Notification state
  const [notification, setNotification] = useState<{
    isVisible: boolean;
    appName: string;
    type: 'success' | 'error';
    message?: string;
    subMessage?: string;
  }>({
    isVisible: false,
    appName: '',
    type: 'success'
  });

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // App installation flow
  const handleInstallApp = (app: App, version?: string) => {
    if (app.status === 'available') {
      setInstallDialog({ isOpen: true, app });
    }
  };

  const confirmInstall = (app: App, version?: string) => {
    const installVersion = version || app.version;
    
    // Update app status to installing
    setApps(prev => prev.map(a => 
      a.id === app.id ? { ...a, status: 'installing' } : a
    ));

    // Simulate installation process
    setTimeout(() => {
      setApps(prev => prev.map(a => 
        a.id === app.id ? { 
          ...a, 
          status: 'installed',
          installedVersion: installVersion
        } : a
      ));
      
      // Show custom notification
      setNotification({
        isVisible: true,
        appName: `${app.name} v${installVersion}`,
        type: 'success'
      });
    }, 3000);

    const versionText = version && version !== app.version ? ` (v${version})` : '';
    toast.info(`Installing ${app.name}${versionText}...`, {
      description: 'Please wait while the application is being installed'
    });
  };

  // App request flow
  const handleRequestApp = (app: App, reason?: string, version?: string) => {
    if (reason) {
      const requestVersion = version || app.version;
      const appNameWithVersion = version && version !== app.version ? `${app.name} v${version}` : app.name;
      
      // Create new request
      const newRequest: AppRequest = {
        id: `req-${Date.now()}`,
        appId: app.id,
        appName: appNameWithVersion,
        reason,
        status: 'open',
        requestedAt: new Date().toISOString(),
        estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        requestNumber: `REQ-${Date.now().toString().slice(-6)}`,
        requestedBy: 'Current User'
      };

      setRequests(prev => [newRequest, ...prev]);
      
      // Update app status
      setApps(prev => prev.map(a => 
        a.id === app.id ? { ...a, status: 'requested' } : a
      ));

      const versionText = version && version !== app.version ? ` (v${version})` : '';
      toast.success(`Request submitted successfully for ${app.name}${versionText}`, {
        description: 'Your request will be reviewed by the IT team'
      });
    } else {
      setRequestDialog({ isOpen: true, app });
    }
  };

  // Show side panel from install dialog
  const showAppDetails = () => {
    if (installDialog.app) {
      setSelectedApp(installDialog.app);
      setCurrentView('apps');
    }
  };

  // Navigate to requests page and filter by app
  const navigateToRequests = (appId: string) => {
    // Find the request for this app
    const appRequest = requests.find(req => req.appId === appId);
    if (appRequest) {
      // Set search to the request number to highlight it
      setRequestSearchQuery(appRequest.requestNumber);
      // Set the request to be auto-expanded
      setExpandedRequestId(appRequest.id);
    }
    // Switch to requests view
    setCurrentView('requests');
    // Close any open panels
    setSelectedApp(null);
  };

  // Search functionality
  const effectiveSearchQuery = currentView === 'apps' ? searchQuery : requestSearchQuery;
  const setEffectiveSearchQuery = currentView === 'apps' ? setSearchQuery : setRequestSearchQuery;

  // Reset requests pagination when filters change
  useEffect(() => {
    setRequestsCurrentPage(1);
  }, [requestSearchQuery, activeRequestTab]);

  // Clear expanded request ID when user manually searches or changes tabs
  useEffect(() => {
    // Only clear if the search query was changed manually (not by navigation)
    if (expandedRequestId) {
      const timer = setTimeout(() => {
        setExpandedRequestId(undefined);
      }, 1000); // Clear after 1 second to allow the expansion to take effect
      return () => clearTimeout(timer);
    }
  }, [requestSearchQuery, activeRequestTab]);

  // Close notification
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Enhanced Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800" />
        
        {/* Albertsons Blue Accent Areas */}
        <div className="absolute inset-0">
          {/* Top Blue Wave */}
          <div className="absolute top-0 left-0 w-full h-1/3">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320" fill="none">
              <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(0, 102, 204)" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="rgb(74, 144, 226)" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="rgb(135, 206, 235)" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="blueGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(74, 144, 226)" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="rgb(0, 102, 204)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="rgb(0, 68, 153)" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path d="M0,160 C320,100 640,50 960,80 C1120,100 1280,140 1440,120 L1440,0 L0,0 Z" fill="url(#blueGradient)" className="dark:hidden" />
              <path d="M0,160 C320,100 640,50 960,80 C1120,100 1280,140 1440,120 L1440,0 L0,0 Z" fill="url(#blueGradientDark)" className="hidden dark:block" />
            </svg>
          </div>

          {/* Bottom Accent Wave */}
          <div className="absolute bottom-0 left-0 w-full h-1/4">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 240" fill="none">
              <defs>
                <linearGradient id="bottomGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(0, 188, 212)" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="rgb(74, 144, 226)" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="rgb(0, 102, 204)" stopOpacity="0.04" />
                </linearGradient>
                <linearGradient id="bottomGradientDark" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(0, 188, 212)" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="rgb(74, 144, 226)" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="rgb(0, 102, 204)" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <path d="M0,240 C360,200 720,160 1080,180 C1200,190 1320,200 1440,190 L1440,240 L0,240 Z" fill="url(#bottomGradient)" className="dark:hidden" />
              <path d="M0,240 C360,200 720,160 1080,180 C1200,190 1320,200 1440,190 L1440,240 L0,240 Z" fill="url(#bottomGradientDark)" className="hidden dark:block" />
            </svg>
          </div>

          {/* Floating Geometric Elements */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 opacity-5 dark:opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full blur-xl"></div>
          </div>
          <div className="absolute top-1/2 left-1/6 w-24 h-24 opacity-4 dark:opacity-8">
            <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-lg"></div>
          </div>
          <div className="absolute bottom-1/3 right-1/6 w-20 h-20 opacity-6 dark:opacity-12">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-lg"></div>
          </div>

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" className="text-blue-600" />
            </svg>
          </div>
        </div>

        {/* Enhanced Glass Morphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-slate-100/10 dark:from-slate-800/30 dark:via-transparent dark:to-slate-700/20" />
      </div>
      {/* Fixed Header */}
      <div className="flex-shrink-0 relative z-10">
        <Header
          currentView={currentView}
          onViewChange={setCurrentView}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          searchQuery={effectiveSearchQuery}
          onSearchChange={setEffectiveSearchQuery}
        />
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 min-h-0 overflow-hidden relative z-10">
        {currentView === 'apps' ? (
          <AppsPage
            apps={apps}
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedApp={selectedApp}
            onAppSelect={setSelectedApp}
            onInstall={handleInstallApp}
            onRequest={handleRequestApp}
            onNavigateToRequests={navigateToRequests}
            searchQuery={searchQuery}
          />
        ) : (
          <div className="p-3 md:p-4 h-full overflow-auto">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl shadow-blue-500/5 dark:shadow-blue-400/10 p-4 md:p-6 min-h-full">
              <RequestsTable
                requests={requests}
                searchQuery={requestSearchQuery}
                onSearchChange={setRequestSearchQuery}
                activeTab={activeRequestTab}
                onTabChange={setActiveRequestTab}
                currentPage={requestsCurrentPage}
                onPageChange={setRequestsCurrentPage}
                itemsPerPage={requestsPerPage}
                onItemsPerPageChange={setRequestsPerPage}
                expandedRequestId={expandedRequestId}
              />
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <InstallDialog
        app={installDialog.app}
        isOpen={installDialog.isOpen}
        onClose={() => setInstallDialog({ isOpen: false, app: null })}
        onConfirm={confirmInstall}
        onShowDetails={showAppDetails}
      />

      <RequestDialog
        app={requestDialog.app}
        isOpen={requestDialog.isOpen}
        onClose={() => setRequestDialog({ isOpen: false, app: null })}
        onSubmit={handleRequestApp}
      />

      {/* Custom Installation Notification */}
      <InstallNotification
        appName={notification.appName}
        isVisible={notification.isVisible}
        onClose={closeNotification}
        type={notification.type}
        message={notification.message}
        subMessage={notification.subMessage}
      />
    </div>
  );
}
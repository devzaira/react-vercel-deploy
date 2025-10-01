import React from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { App } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AppCardProps {
  app: App;
  onInstall: (app: App) => void;
  onRequest: (app: App) => void;
  onClick: (app: App) => void;
  isSelected?: boolean;
}

export function AppCard({ app, onInstall, onRequest, onClick, isSelected }: AppCardProps) {
  const getStatusButton = () => {
    switch (app.status) {
      case 'installing':
        return (
          <Button disabled className="w-full bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 text-xs sm:text-sm py-2 sm:py-2.5">
            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin text-blue-600" />
            Installing...
          </Button>
        );
      case 'installed':
        return (
          <div className="w-full flex items-center justify-center py-2 sm:py-2.5 text-green-700 bg-green-100 rounded-md text-xs sm:text-sm">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Installed
          </div>
        );
      case 'processing':
        return (
          <div className="w-full flex items-center justify-center py-2 sm:py-2.5 text-orange-700 bg-orange-100 rounded-md text-xs sm:text-sm">
            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin" />
            Processing...
          </div>
        );
      case 'requested':
        return (
          <div className="w-full flex items-center justify-center py-2 sm:py-2.5 text-blue-700 bg-blue-100 rounded-md text-xs sm:text-sm">
            Requested
          </div>
        );
      default:
        return app.type === 'paid' ? (
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onRequest(app);
            }}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-white shadow-md transition-all duration-200 text-xs sm:text-sm py-2 sm:py-2.5"
          >
            Request
          </Button>
        ) : (
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onInstall(app);
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md transition-all duration-200 text-xs sm:text-sm py-2 sm:py-2.5"
          >
            Install
          </Button>
        );
    }
  };

  return (
    <div 
      className={`
        relative bg-gradient-to-br from-white to-blue-50 dark:bg-[#021121] rounded-xl cursor-pointer 
        hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 w-full 
        border border-blue-100 dark:border-gray-700 flex flex-col
        p-3 sm:p-4 min-h-[200px] sm:min-h-[220px] md:min-h-[240px]
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-200/50' : ''}
      `}
      onClick={() => onClick(app)}
    >
      {/* App Icon Container */}
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white dark:bg-gray-700 rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-600">
          <ImageWithFallback
            src={app.icon}
            alt={app.name}
            className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
          />
        </div>
      </div>

      {/* App Name */}
      <div className="text-center mb-3 sm:mb-4 flex-1 flex flex-col justify-center min-h-[3rem] sm:min-h-[3.5rem]">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight px-1">
          {app.name}
        </h3>
        <div className="flex items-center justify-center gap-2 mt-1">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
            {app.publisher}
          </p>
          {app.hasMultipleVersions && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {app.versions?.length || 0} versions
            </Badge>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        {getStatusButton()}
      </div>
    </div>
  );
}
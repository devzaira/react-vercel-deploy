import React, { useState } from 'react';
import { Search, Moon, Sun, ChevronDown, User, LogOut, Info, X } from 'lucide-react';
import SolarMoonStarsBold from '../imports/SolarMoonStarsBold-5-233';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AboutDialog } from './AboutDialog';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ 
  currentView, 
  onViewChange, 
  isDarkMode, 
  onToggleDarkMode,
  searchQuery,
  onSearchChange 
}: HeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);

  return (
    <div className="h-[77px] w-full bg-white dark:bg-gray-900 border-b border-blue-100 dark:border-gray-700 shadow-sm relative">
      {/* Mobile Search Overlay */}
      {isSearchExpanded && (
        <div className="absolute inset-0 bg-white dark:bg-gray-900 z-50 flex items-center px-3 md:hidden">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
            <Input
              placeholder="Search apps"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-12 text-base bg-gradient-to-r from-blue-50 to-cyan-50 dark:bg-gray-800 border-blue-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchExpanded(false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8"
            >
              <X className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Header Content */}
      <div className="flex items-center px-3 md:px-6 h-full">
        {/* Logo */}
        <div className="flex items-center mr-3 md:mr-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#0066CC] to-[#4A90E2] rounded-lg flex items-center justify-center mr-2 md:mr-3 shadow-lg">
            <span className="text-white font-bold text-base md:text-lg">A</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">App Store</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Albertsons Companies</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center mr-3 md:mr-8">
          <Button
            variant={currentView === 'apps' ? 'default' : 'ghost'}
            onClick={() => onViewChange('apps')}
            className="mr-2 md:mr-4 text-sm md:text-base px-2 md:px-4"
            size="sm"
          >
            Apps
          </Button>
          <Button
            variant={currentView === 'requests' ? 'default' : 'ghost'}
            onClick={() => onViewChange('requests')}
            className={`text-sm md:text-base px-2 md:px-4 ${
              currentView === 'requests' 
                ? 'text-white' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            size="sm"
          >
            Requests
          </Button>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xs sm:max-w-md lg:max-w-2xl relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-blue-400" />
            <Input
              placeholder="Search apps"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 md:pl-10 text-sm md:text-base bg-gradient-to-r from-blue-50 to-cyan-50 dark:bg-gray-800 border-blue-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile Search Icon */}
        <div className="md:hidden flex-1 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchExpanded(true)}
            className="w-10 h-10"
          >
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Button>
        </div>

        <div className="flex items-center ml-3 md:ml-8 space-x-2 md:space-x-4">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            className="w-10 h-10 md:w-12 md:h-12"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
            ) : (
              <div className="w-5 h-5 md:w-6 md:h-6 text-[#0066CC]">
                <SolarMoonStarsBold />
              </div>
            )}
          </Button>

          {/* Device Name */}
          <div className="hidden lg:block text-right text-sm">
            <div className="text-gray-900 dark:text-white font-medium">LDAP</div>
            <div className="text-gray-600 dark:text-gray-400">MACHINE NAME</div>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1 md:space-x-2 p-1 md:p-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <ChevronDown className="hidden md:block w-4 h-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsAboutDialogOpen(true)}>
                <Info className="w-4 h-4 mr-2" />
                About
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* About Dialog */}
      <AboutDialog
        isOpen={isAboutDialogOpen}
        onClose={() => setIsAboutDialogOpen(false)}
      />
    </div>
  );
}
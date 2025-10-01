import React from 'react';
import { Check, ChevronDown, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface CategoryDropdownProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

export function CategoryDropdown({ categories, selectedCategories, onCategoryChange }: CategoryDropdownProps) {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const clearCategories = () => {
    onCategoryChange([]);
  };

  const selectAllCategories = () => {
    onCategoryChange([...categories]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-xs sm:text-sm min-w-[100px] sm:min-w-[140px] justify-between px-2 sm:px-3"
        >
          <div className="flex items-center gap-1 sm:gap-2 w-full">
            <Filter className="w-4 h-4" />
            <span className="truncate text-xs sm:text-sm">
              {selectedCategories.length === 0 
                ? 'Categories' 
                : selectedCategories.length === 1 
                  ? selectedCategories[0]
                  : `${selectedCategories.length} Selected`
              }
            </span>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-auto flex-shrink-0" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto" align="end">
        {/* Control Options */}
        <div className="px-2 py-1.5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAllCategories}
              className="h-auto py-1 px-2 text-xs"
            >
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCategories}
              className="h-auto py-1 px-2 text-xs"
            >
              Clear All
            </Button>
          </div>
        </div>
        
        {/* Category Options */}
        {categories.map((category) => (
          <DropdownMenuItem
            key={category}
            onClick={() => toggleCategory(category)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{category}</span>
            {selectedCategories.includes(category) && (
              <Check className="w-4 h-4 text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
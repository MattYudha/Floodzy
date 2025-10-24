'use client';

import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/Button';
import {
  SlidersHorizontal,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Loader2,
  Plus,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSidebar } from '@/components/layout/ClientLayoutWrapper';
import { cn } from '@/lib/utils';

interface MapActionsControlProps {
  onApplyFilters: (filters: any) => void;
  initialFilters?: {
    severity: string[];
    timeRange: string;
    status: string;
  };
  handleFindEvacuationRoute: () => void;
  isRouting: boolean;
  onReportStart: () => void;
  isReporting: boolean;
}

const MapActionsControl: React.FC<MapActionsControlProps> = ({
  onApplyFilters,
  initialFilters,
  handleFindEvacuationRoute,
  isRouting,
  onReportStart,
  isReporting,
}) => {
  const [filters, setFilters] = useState(
    initialFilters || {
      severity: [],
      timeRange: 'all',
      status: 'all',
    },
  );
  const [isOpen, setIsOpen] = useState(false);

  const { isCollapsed, isDesktop } = useSidebar();

  const handleChange = (filterType: string, value: any) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const activeFiltersCount =
    filters.severity.length +
    (filters.timeRange !== 'all' ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0);

  const dynamicRightClass = isDesktop
    ? (isCollapsed ? 'right-[2rem]' : 'right-[14rem]')
    : 'right-[2rem]';

  return (
    <div className={cn("fixed top-[5rem] z-[9999] pointer-events-none", dynamicRightClass)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="pointer-events-auto">
            <Button
              variant="secondary"
              size="icon"
              className="
                relative h-10 w-10 md:h-12 md:w-12 rounded-2xl
                backdrop-blur-xl bg-white/80 dark:bg-gray-900/80
                shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]
                border border-white/20 dark:border-gray-700/30
                hover:bg-white/90 dark:hover:bg-gray-900/90
                hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(0,0,0,0.16)]
                transition-all duration-300 ease-out
                group
              "
            >
              <SlidersHorizontal className="w-5 h-5 relative z-10 text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              {activeFiltersCount > 0 && (
                <span
                  className="
                  absolute -top-1 -right-1 z-20
                  flex items-center justify-center
                  h-5 w-5 rounded-full
                  bg-gradient-to-br from-blue-500 to-cyan-500
                  text-white text-xs font-bold
                  shadow-lg
                  animate-in zoom-in duration-200
                "
                >
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="
            max-w-xs w-[calc(80vw-2rem)] sm:w-80 p-0 pointer-events-auto
            max-h-[80vh] sm:max-h-none
            backdrop-blur-xl bg-white/95 dark:bg-gray-900/95
            border border-white/20 dark:border-gray-700/30
            shadow-[0_20px_60px_0_rgba(0,0,0,0.2)]
            rounded-2xl
            overflow-hidden
          "
          align="end"
          sideOffset={8}
        >
          {/* Header with gradient */}
          <div className="relative px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 sm:px-6 sm:py-5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10" />
            <div className="relative flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <Filter className="w-4 h-4 text-white sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">
                  Filter Laporan
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Saring laporan di peta
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Severity Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-500" />
                <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Tingkat Keparahan
                </Label>
              </div>
              <ToggleGroup
                type="multiple"
                variant="outline"
                value={filters.severity}
                onValueChange={(value) => handleChange('severity', value)}
                className="grid grid-cols-3 gap-2"
              >
                <ToggleGroupItem
                  value="low"
                  className="
                    data-[state=on]:bg-green-500/10 data-[state=on]:text-green-700 dark:data-[state=on]:text-green-400
                    data-[state=on]:border-green-500/50
                    rounded-xl font-medium transition-all
                    hover:bg-green-500/5
                  "
                >
                  Rendah
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="moderate"
                  className="
                    data-[state=on]:bg-yellow-500/10 data-[state=on]:text-yellow-700 dark:data-[state=on]:text-yellow-400
                    data-[state=on]:border-yellow-500/50
                    rounded-xl font-medium transition-all
                    hover:bg-yellow-500/5
                  "
                >
                  Sedang
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="high"
                  className="
                    data-[state=on]:bg-red-500/10 data-[state=on]:text-red-700 dark:data-[state=on]:text-red-400
                    data-[state=on]:border-red-500/50
                    rounded-xl font-medium transition-all
                    hover:bg-red-500/5
                  "
                >
                  Tinggi
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

            {/* Time Range Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Rentang Waktu
                </Label>
              </div>
              <Select
                value={filters.timeRange}
                onValueChange={(value) => handleChange('timeRange', value)}
              >
                <SelectTrigger className="rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 dark:border-gray-700">
                  <SelectItem value="24h" className="rounded-lg">
                    24 Jam Terakhir
                  </SelectItem>
                  <SelectItem value="3d" className="rounded-lg">
                    3 Hari Terakhir
                  </SelectItem>
                  <SelectItem value="all" className="rounded-lg">
                    Semua Waktu
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

            {/* Status Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-500" />
                <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Status Laporan
                </Label>
              </div>
              <RadioGroup
                value={filters.status}
                onValueChange={(value) => handleChange('status', value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="all" id="r-all" />
                  <Label
                    htmlFor="r-all"
                    className="flex-1 cursor-pointer font-medium text-gray-700 dark:text-gray-300"
                  >
                    Semua
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="verified" id="r-verified" />
                  <Label
                    htmlFor="r-verified"
                    className="flex-1 cursor-pointer font-medium text-gray-700 dark:text-gray-300"
                  >
                    Hanya Terverifikasi
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <Button
                variant="secondary"
                className="w-full justify-start pointer-events-auto"
                onClick={() => {
                  handleFindEvacuationRoute();
                  setIsOpen(false); // Close popover after action
                }}
                disabled={isRouting}
              >
                {isRouting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4 mr-2" />
                )}
                Cari Rute Evakuasi
              </Button>
              <Button
                variant={isReporting ? 'destructive' : 'default'}
                className="w-full justify-start pointer-events-auto"
                onClick={() => {
                  onReportStart();
                  setIsOpen(false); // Close popover after action
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isReporting ? 'Batalkan Lapor' : 'Lapor Banjir'}
              </Button>
            </div>
          </div>

          {/* Footer info */}
          {activeFiltersCount > 0 && (
            <div className="px-6 py-4 bg-blue-500/5 dark:bg-blue-500/10 border-t border-gray-200/50 dark:border-gray-700/50">
              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                {activeFiltersCount} filter aktif
              </p>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MapActionsControl;

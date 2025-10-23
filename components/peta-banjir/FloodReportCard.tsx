import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  PersonStanding,
  Waves,
  Ship,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import clsx from 'clsx';

interface FloodReportCardProps {
  id: string;
  locationName: string;
  waterLevel: number;
  timestamp: string;
  trend: 'rising' | 'falling' | 'stable';
  severity: 'low' | 'moderate' | 'high';
  isSelected: boolean;
  onClick: () => void;
}

const severityIcons = {
  low: <PersonStanding className="w-6 h-6 text-green-500" />,
  moderate: <Waves className="w-6 h-6 text-yellow-500" />,
  high: <Ship className="w-6 h-6 text-red-500" />,
};

const trendInfo = {
  rising: {
    icon: <ArrowUp className="w-5 h-5 text-red-500" />,
    text: "Naik",
    className: "text-red-500",
  },
  falling: {
    icon: <ArrowDown className="w-5 h-5 text-green-500" />,
    text: "Turun",
    className: "text-green-500",
  },
  stable: {
    icon: <Minus className="w-5 h-5 text-gray-500" />,
    text: "Stabil",
    className: "text-gray-500",
  },
};

const FloodReportCard: React.FC<FloodReportCardProps> = ({
  locationName,
  waterLevel,
  timestamp,
  trend,
  severity,
  isSelected,
  onClick,
}) => {
  const trendData = trendInfo[trend];

  return (
    <Card
      className={clsx(
        'cursor-pointer transition-all duration-200 h-full bg-white text-black aspect-square',
        isSelected ? 'border-primary shadow-lg' : 'border-border'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col justify-between h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {severityIcons[severity]}
            <h3 className="font-semibold text-sm leading-tight">{locationName}</h3>
          </div>
        </div>

        {/* Body */}
        <div className="flex items-end justify-between my-2">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{waterLevel}</span>
            <span className="text-base font-medium ml-1">cm</span>
          </div>
          <div className={`flex items-center gap-1 font-semibold ${trendData.className}`}>
            {trendData.icon}
            <span>{trendData.text}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground mt-3 text-left w-full">
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: id })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FloodReportCard;
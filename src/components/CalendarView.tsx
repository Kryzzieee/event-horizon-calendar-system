
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';
import { EventType } from '@/types/event';
import { DayProps } from 'react-day-picker';

interface CalendarViewProps {
  events: EventType[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, selectedDate, onDateSelect }) => {
  // Function to find events on a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.startTime), date)
    );
  };

  // Custom day renderer for the calendar
  const renderDay = (props: DayProps) => {
    const { date } = props;
    
    if (!date) {
      return null;
    }
    
    // Get events for this day
    const dayEvents = getEventsForDate(date);
    const hasEvents = dayEvents.length > 0;
    const isToday = isSameDay(date, new Date());
    const isSelected = isSameDay(date, selectedDate);
    
    // Define colors for different event types
    const eventTypeColors: Record<string, string> = {
      personal: 'bg-blue-400',
      holiday: 'bg-red-400',
      school: 'bg-green-400',
      work: 'bg-yellow-400',
      other: 'bg-purple-400',
    };

    return (
      <div
        className={cn(
          'relative p-2 h-10 w-10 flex items-center justify-center rounded-full transition-colors cursor-pointer',
          isToday ? 'bg-primary/10 text-primary font-semibold' : '',
          isSelected ? 'bg-primary text-primary-foreground font-semibold' : '',
          hasEvents && !isSelected ? 'border border-primary/50' : '',
          hasEvents ? 'font-bold' : ''
        )}
        onClick={() => onDateSelect(date)}
      >
        {format(date, 'd')}
        
        {/* Event dots */}
        {hasEvents && (
          <div className="absolute -bottom-1 flex justify-center gap-0.5">
            {dayEvents.slice(0, 3).map((event, i) => (
              <div 
                key={i} 
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  eventTypeColors[event.eventType] || 'bg-primary'
                )}
              />
            ))}
            {dayEvents.length > 3 && (
              <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border shadow-md">
      <CardContent className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          className={cn("p-3 pointer-events-auto rounded-md")}
          components={{
            Day: renderDay
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarView;

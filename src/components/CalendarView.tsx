
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { EventType } from '@/types/event';

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
  const renderDay = (day: Date, selectedDays: Date[], properties: Record<string, unknown>) => {
    // Get events for this day
    const dayEvents = getEventsForDate(day);
    const isToday = isSameDay(day, new Date());
    const isSelected = selectedDays.some(selectedDay => isSameDay(selectedDay, day));
    
    // Define colors for different event types
    const eventTypeColors: Record<string, string> = {
      personal: 'bg-blue-400',
      holiday: 'bg-red-400',
      school: 'bg-green-400',
      work: 'bg-yellow-400',
      other: 'bg-purple-400',
    };
    
    // Define colors for different priority levels
    const priorityColors: Record<string, string> = {
      'urgent-important': 'bg-red-500',
      'not-urgent-important': 'bg-orange-400',
      'urgent-not-important': 'bg-yellow-400',
      'not-urgent-not-important': 'bg-gray-400',
    };

    return (
      <div
        {...properties}
        className={cn(
          'relative p-2 h-10 w-10 flex items-center justify-center rounded-full transition-colors',
          isToday ? 'bg-primary/10 text-primary font-semibold' : '',
          isSelected ? 'bg-primary text-primary-foreground font-semibold' : '',
          properties.className as string
        )}
      >
        {format(day, 'd')}
        
        {/* Event dots */}
        {dayEvents.length > 0 && (
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
          onSelect={date => date && onDateSelect(date)}
          className={cn("p-3 pointer-events-auto rounded-md")}
          components={{
            Day: ({ day, selectedDays, ...props }) => renderDay(day, selectedDays, props)
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarView;

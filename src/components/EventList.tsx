
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Clock, MapPin, Calendar as CalendarIcon, Edit, Trash } from 'lucide-react';
import { EventType } from '@/types/event';

interface EventListProps {
  events: EventType[];
  onEditEvent: (event: EventType) => void;
  onDeleteEvent: (eventId: string) => void;
  selectedDate: Date;
}

const EventList: React.FC<EventListProps> = ({ 
  events, 
  onEditEvent, 
  onDeleteEvent,
  selectedDate
}) => {
  // Filter events for the selected date
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.startTime);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Sort events by start time
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  // Event type colors
  const eventTypeColors: Record<string, string> = {
    personal: 'bg-blue-100 text-blue-800',
    holiday: 'bg-red-100 text-red-800',
    school: 'bg-green-100 text-green-800',
    work: 'bg-yellow-100 text-yellow-800',
    other: 'bg-purple-100 text-purple-800'
  };

  // Priority colors
  const priorityColors: Record<string, string> = {
    'urgent-important': 'bg-red-500 text-white',
    'not-urgent-important': 'bg-orange-400 text-white',
    'urgent-not-important': 'bg-yellow-400 text-yellow-900',
    'not-urgent-not-important': 'bg-gray-400 text-white',
  };

  const priorityLabels: Record<string, string> = {
    'urgent-important': 'Urgent & Important',
    'not-urgent-important': 'Not Urgent but Important',
    'urgent-not-important': 'Urgent but Not Important',
    'not-urgent-not-important': 'Not Urgent & Not Important',
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">
          Events for {format(selectedDate, 'MMMM d, yyyy')}
        </CardTitle>
        <Badge variant="outline" className="flex items-center">
          <CalendarIcon className="h-3 w-3 mr-1" />
          {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''}
        </Badge>
      </CardHeader>
      <CardContent className="max-h-[500px] overflow-y-auto">
        {sortedEvents.length > 0 ? (
          <div className="space-y-4">
            {sortedEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className={`h-1.5 w-full ${priorityColors[event.priority] || 'bg-gray-400'}`}></div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={eventTypeColors[event.eventType] || 'bg-gray-100 text-gray-800'}>
                          {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                        </Badge>
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center text-muted-foreground text-sm">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {event.location}
                          </div>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-muted-foreground text-sm mt-2">{event.description}</p>
                      )}

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <Badge variant="outline" className={cn("text-xs", priorityColors[event.priority])}>
                          {priorityLabels[event.priority]}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => onEditEvent(event)}
                        className="h-8 w-8"
                        aria-label="Edit event"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => onDeleteEvent(event.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        aria-label="Delete event"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No events scheduled for this day</p>
            <p className="text-sm mt-2">Select a date or create a new event</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventList;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import CalendarView from '@/components/CalendarView';
import EventList from '@/components/EventList';
import EventForm from '@/components/EventForm';
import { EventType } from '@/types/event';

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [eventToEdit, setEventToEdit] = useState<EventType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string } | null>(null);

  // Load user data and events from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      
      // Load events
      const eventsStr = localStorage.getItem(`events_${userData.username}`);
      if (eventsStr) {
        setEvents(JSON.parse(eventsStr));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`events_${user.username}`, JSON.stringify(events));
    }
  }, [events, user]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateEvent = () => {
    setEventToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: EventType) => {
    setEventToEdit(event);
    setIsFormOpen(true);
  };

  const handleSaveEvent = (event: EventType) => {
    if (eventToEdit) {
      // Update existing event
      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
      toast.success('Event updated successfully');
    } else {
      // Add new event
      setEvents(prev => [...prev, event]);
      toast.success('Event created successfully');
    }
    
    setIsFormOpen(false);
    setEventToEdit(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      setEvents(prev => prev.filter(event => event.id !== eventToDelete));
      toast.success('Event deleted successfully');
      setShowDeleteDialog(false);
      setEventToDelete(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Event Horizon</h1>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-muted-foreground">
                Welcome, <span className="font-medium">{user.username}</span>
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto py-8 px-4 max-h-[calc(100vh-80px)] overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Calendar */}
          <div className="w-full md:w-1/3">
            <div className="mb-6">
              <CalendarView 
                events={events} 
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect} 
              />
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" onClick={handleCreateEvent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <EventForm
                  onSubmit={handleSaveEvent}
                  onCancel={() => setIsFormOpen(false)}
                  event={eventToEdit || undefined}
                  selectedDate={selectedDate}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Right Column - Event List */}
          <div className="w-full md:w-2/3 overflow-y-auto max-h-[70vh]">
            <EventList 
              events={events}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEvent}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;

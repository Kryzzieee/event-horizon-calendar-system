
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EventType } from "@/types/event";

interface EventFormProps {
  onSubmit: (event: EventType) => void;
  onCancel: () => void;
  event?: EventType;
  selectedDate?: Date;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, onCancel, event, selectedDate }) => {
  const [formData, setFormData] = useState<EventType>({
    id: event?.id || crypto.randomUUID(),
    title: event?.title || "",
    description: event?.description || "",
    eventType: event?.eventType || "personal",
    startTime: event?.startTime || selectedDate?.toISOString() || new Date().toISOString(),
    endTime: event?.endTime || selectedDate?.toISOString() || new Date().toISOString(),
    location: event?.location || "",
    type: event?.type || "meeting",
    priority: event?.priority || "not-urgent-important",
    color: event?.color || "blue",
    tags: event?.tags || [],
  });

  const [startDate, setStartDate] = useState<Date>(
    event?.startTime ? new Date(event.startTime) : selectedDate || new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    event?.endTime ? new Date(event.endTime) : selectedDate || new Date()
  );
  const [startTimeString, setStartTimeString] = useState(
    event?.startTime ? format(new Date(event.startTime), "HH:mm") : "09:00"
  );
  const [endTimeString, setEndTimeString] = useState(
    event?.endTime ? format(new Date(event.endTime), "HH:mm") : "10:00"
  );

  // Update form data when dates or times change
  useEffect(() => {
    const newStartTime = new Date(startDate);
    const [startHours, startMinutes] = startTimeString.split(":").map(Number);
    newStartTime.setHours(startHours, startMinutes);

    const newEndTime = new Date(endDate);
    const [endHours, endMinutes] = endTimeString.split(":").map(Number);
    newEndTime.setHours(endHours, endMinutes);

    setFormData(prev => ({
      ...prev,
      startTime: newStartTime.toISOString(),
      endTime: newEndTime.toISOString(),
    }));
  }, [startDate, endDate, startTimeString, endTimeString]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select field changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Color coding for priority levels
  const priorityColors = {
    "urgent-important": "bg-red-500",
    "not-urgent-important": "bg-orange-400",
    "urgent-not-important": "bg-yellow-400",
    "not-urgent-not-important": "bg-gray-400",
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{event ? "Edit Event" : "Create New Event"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label htmlFor="eventType">Event Category</Label>
            <Select
              value={formData.eventType}
              onValueChange={(value) => handleSelectChange("eventType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="school">School</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  id="startTime"
                  value={startTimeString}
                  onChange={(e) => setStartTimeString(e.target.value)}
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  id="endTime"
                  value={endTimeString}
                  onChange={(e) => setEndTimeString(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Physical location or online meeting link"
            />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Level */}
          <div className="space-y-2">
            <Label>Priority Level</Label>
            <RadioGroup
              value={formData.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2 rounded-md border p-2">
                <RadioGroupItem value="urgent-important" id="priority-1" />
                <Label htmlFor="priority-1" className="flex items-center gap-2">
                  <span className={cn("h-3 w-3 rounded-full", priorityColors["urgent-important"])}></span>
                  Urgent & Important
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-2">
                <RadioGroupItem value="not-urgent-important" id="priority-2" />
                <Label htmlFor="priority-2" className="flex items-center gap-2">
                  <span className={cn("h-3 w-3 rounded-full", priorityColors["not-urgent-important"])}></span>
                  Not Urgent but Important
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-2">
                <RadioGroupItem value="urgent-not-important" id="priority-3" />
                <Label htmlFor="priority-3" className="flex items-center gap-2">
                  <span className={cn("h-3 w-3 rounded-full", priorityColors["urgent-not-important"])}></span>
                  Urgent but Not Important
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-2">
                <RadioGroupItem value="not-urgent-not-important" id="priority-4" />
                <Label htmlFor="priority-4" className="flex items-center gap-2">
                  <span className={cn("h-3 w-3 rounded-full", priorityColors["not-urgent-not-important"])}></span>
                  Not Urgent & Not Important
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event details"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button type="submit" className="w-full sm:w-auto">
            {event ? "Update Event" : "Create Event"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EventForm;

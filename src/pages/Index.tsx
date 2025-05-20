
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-primary mb-4">Event Horizon</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your personal calendar management system for organizing events 
          and prioritizing your time effectively.
        </p>
        <div className="space-y-4">
          <Button size="lg" onClick={() => navigate('/login')}>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

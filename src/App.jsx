import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Home from './components/sections/Home';
import WorkflowBuilder from './components/sections/WorkflowBuilder';
import AppPreview from './components/app/AppPreview';
import Dashboard from '@/components/sections/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<WorkflowBuilder />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/app" element={<AppPreview />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
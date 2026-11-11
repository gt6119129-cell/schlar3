/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { RoleSelector } from './components/RoleSelector';
import { WebLayout } from './components/web/WebLayout';
import { MobileSimulator } from './components/mobile/MobileSimulator';
import { ToastContainer } from './components/common/ToastContainer';

const MainAppContent: React.FC = () => {
  const { currentRole } = useSchool();

  if (!currentRole) {
    return <RoleSelector />;
  }

  if (currentRole === 'teacher_mobile' || currentRole === 'parent_mobile') {
    return <MobileSimulator />;
  }

  return <WebLayout />;
};

export default function App() {
  return (
    <SchoolProvider>
      <MainAppContent />
      <ToastContainer />
    </SchoolProvider>
  );
}

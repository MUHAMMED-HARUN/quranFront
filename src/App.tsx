import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './core/query';

import { CountriesPage } from './features/countries/pages/CountriesPage';
import { CitiesPage } from './features/cities/pages';
import { DistrictsPage } from './features/districts/pages';
import { NeighborhoodsPage } from './features/neighborhoods/pages';

// New Feature Imports
import { PersonsPage } from './features/people/pages';
import { InstitutesPage } from './features/institutes/pages';
import { ProgramsPage } from './features/programs/pages';
import { SubjectsPage } from './features/subjects/pages';
import { ClassesPage } from './features/classes/pages';
import { InstituteClassesPage } from './features/instituteClasses/pages';
import { StudentsPage } from './features/students/pages';
import { TeachersPage } from './features/teachers/pages';
import { GroupsPage } from './features/groups/pages/GroupsPage';
import { TeachingAssignmentsPage } from './features/teachingAssignments/pages';
import { StudentEnrollmentsPage } from './features/studentEnrollments/pages';
import { ScopeUnitTypesPage } from './features/scopeUnitTypes/pages';
import { AssessmentScopesPage } from './features/assessmentScopes/pages/AssessmentScopesPage';
import { ScopeExecutionsPage } from './features/scopeExecutions/pages/ScopeExecutionsPage';
import { ScopeExecutionDetailsPage } from './features/scopeExecutionDetails/pages/ScopeExecutionDetailsPage';
import { EnrollStudentInScopeExecutionsPage } from './features/enrollStudentInScopeExecutions/pages';
import EnrollStudentInScopeExecutionDetailsPage from './features/enrollStudentInScopeExecutionDetails/pages/EnrollStudentInScopeExecutionDetails';
import { DailyTrackingsPage } from './features/dailyTrackings/pages/DailyTrackingsPage';
import { DailyEvaluationsPage } from './features/dailyEvaluations/pages/DailyEvaluationsPage';
import { StudentAssessmentsPage } from './features/studentAssessments/pages/StudentAssessmentsPage';
import { MattersPage } from './features/matters/pages';

import { HomePage } from './pages/HomePage';
import { Layout } from './components/common/Layout';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/countries" element={<CountriesPage />} />
            <Route path="/cities" element={<CitiesPage />} />
            <Route path="/districts" element={<DistrictsPage />} />
            <Route path="/neighborhoods" element={<NeighborhoodsPage />} />

            <Route path="/persons" element={<PersonsPage />} />
            <Route path="/institutes" element={<InstitutesPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/institute-classes" element={<InstituteClassesPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/teaching-assignments" element={<TeachingAssignmentsPage />} />
            <Route path="/student-enrollments" element={<StudentEnrollmentsPage />} />
            <Route path="/scope-unit-types" element={<ScopeUnitTypesPage />} />
            <Route path="/assessment-scopes" element={<AssessmentScopesPage />} />
            <Route path="/scope-executions" element={<ScopeExecutionsPage />} />
            <Route path="/scope-execution-details" element={<ScopeExecutionDetailsPage />} />
            <Route path="/enroll-student-in-scope-executions" element={<EnrollStudentInScopeExecutionsPage />} />
            <Route path="/enroll-student-in-scope-execution-details" element={<EnrollStudentInScopeExecutionDetailsPage />} />
            <Route path="/daily-tracking" element={<DailyTrackingsPage />} />
            <Route path="/daily-evaluations" element={<DailyEvaluationsPage />} />
            <Route path="/student-assessments" element={<StudentAssessmentsPage />} />
            <Route path="/matters" element={<MattersPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

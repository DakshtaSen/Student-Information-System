import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import BatchMentorDashboard from './components/BatchMentorDashboard'
import StudentDetails from './components/StudentDetails'
import ProgramIncharge from './components/ProgramIncharge'
import FilteredStudentList from './components/FilteredStudentList'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BatchMentorDashboard />} />
          <Route path="/program-incharge" element={<ProgramIncharge />} />
          <Route path="/student/:id" element={<StudentDetails />} />
          <Route path="/filtered-students" element={<FilteredStudentList />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

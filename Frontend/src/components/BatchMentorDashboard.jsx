import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './BatchMentorDashboard.module.css';
import Navbar from './navbar';

const BatchMentorDashboard = () => {
  // State management for courses and batches
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [theme, setTheme] = useState('light');

  // Load theme from localStorage on component mount, default to light if not set
  /* useEffect(() => {
    // If no theme is set in localStorage, set it to light
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light');
    }
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme);
    document.body.dataset.theme = savedTheme;
  }, []); */

  /* const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.dataset.theme = newTheme;
  }; */

  // Available courses
  const courses = ['MCA', 'MTech', 'MBA', 'BCom'];

  // Generate batch years from 2024 to 2025
  const batches = ['2024', '2025'].map(year => `${year}`);

  // Handle course selection
  const handleCourseChange = async (event) => {
    const course = event.target.value;
    setSelectedCourse(course);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setStudents([]);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle batch selection
  const handleBatchChange = async (event) => {
    const batch = event.target.value;
    setSelectedBatch(batch);
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setStudents([]);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mainbody}>
      <Navbar />
      {/* <button 
        className={styles.themeToggle} 
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button> */}

      <div className={styles.dashboardContainer}>
        <div className={styles.header}>
          <h1>Batch Mentor Dashboard</h1>
        </div>
        
        <div className={styles.dropdownContainer}>
          <div className={styles.selectGroup}>
            <label className={styles.selectLabel}>Course</label>
            <select
              className={styles.select}
              value={selectedCourse}
              onChange={handleCourseChange}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.selectGroup}>
            <label className={styles.selectLabel}>Batch</label>
            <select
              className={styles.select}
              value={selectedBatch}
              onChange={handleBatchChange}
              disabled={!selectedCourse}
            >
              <option value="">Select Batch</option>
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className={styles.noSelection}>
            Loading...
          </div>
        ) : !selectedCourse || !selectedBatch ? (
          <div className={styles.noSelection}>
            Please select both a course and batch to view student information
          </div>
        ) : (
          <div className={styles.studentList}>
            <p style={{ textAlign: 'center', color: '#6c757d' }}>
              No students found for {selectedCourse} - {selectedBatch}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchMentorDashboard; 
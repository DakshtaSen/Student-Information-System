import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './StudentDetails.module.css';  // Using StudentDetails styles for consistent UI
import Navbar from './navbar';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';

const FilteredStudentList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { filters, filterType, message } = location.state || {};
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
          });
        }
        
        const response = await fetch(`http://localhost:8080/api/student/search?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to load students. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (filters) {
      fetchStudents();
    } else {
      setLoading(false);
    }
  }, [filters]);

  const handleEdit = (studentId) => {
    navigate(`/student/${studentId}`, { state: { filters, filterType, message } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles.mainbody}>
        <Navbar />
        <div className={styles.loading}>Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.mainbody}>
        <Navbar />
        <div className={styles.error}>
          {error}
          <button className={`${styles.button} ${styles.backButton}`} onClick={handleBack}>
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mainbody}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Filtered Student List</h1>
          {message && <h2 className={styles.filterMessage}>{message}</h2>}
          <div className={styles.actions}>
            <button className={`${styles.button} ${styles.backButton}`} onClick={handleBack}>
              <FaArrowLeft /> Back to Dashboard
            </button>
          </div>
        </div>

        {students.length > 0 ? (
          <div className={styles.resultsContainer}>
            <div className={styles.studentsGrid}>
              {students.map((student) => (
                <div key={student.id} className={styles.studentCard}>
                  <h3>{student.name}</h3>
                  <div className={styles.studentInfo}>
                    <p><strong>Roll No:</strong> {student.rollNo}</p>
                    <p><strong>Enrollment No:</strong> {student.enrollNo}</p>
                    <p><strong>Course:</strong> {student.course}</p>
                    <p><strong>Batch:</strong> {student.batch}</p>
                    <p><strong>Gender:</strong> {student.gender}</p>
                    <p><strong>Blood Group:</strong> {student.bloodGroup}</p>
                    <p><strong>Email:</strong> {student.email}</p>
                    <p><strong>Phone:</strong> {student.phone}</p>
                  </div>
                  <button
                    className={`${styles.button} ${styles.editButton}`}
                    onClick={() => handleEdit(student.id)}
                    title="Edit Student"
                  >
                    <FaEdit /> Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.noResults}>
            No students found with the applied filters
          </div>
        )}
      </div>
    </div>
  );
};

export default FilteredStudentList;

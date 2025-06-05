import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './StudentDetails.module.css';
import Navbar from './navbar';



const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchResults, filters, searchQuery, filterType, message } = location.state || { searchResults: [], filters: {}, searchQuery: '', filterType: '', message: '' };
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/students/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Student not found');
          }
          throw new Error('Failed to fetch student details');
        }
        const data = await response.json();
        setStudent(data);
        setEditedStudent(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError(err.message || 'Failed to load student details. Please try again later.');
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentDetails();
    } else {
      setError('Invalid student ID');
      setLoading(false);
    }
  }, [id]);

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
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    if (filters) {
      fetchStudents();
    }
  }, [filters]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/student/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedStudent),
      });
      if (!response.ok) throw new Error('Failed to update student');
      setStudent(editedStudent);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating student:', err);
      setError('Failed to update student details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedStudent(student);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedStudent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className={styles.mainbody}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.loading}>Loading student details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.mainbody}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.error}>
            {error}
            <button 
              className={`${styles.button} ${styles.backButton}`}
              onClick={() => navigate(-1)}
            >
              Back to Previous Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className={styles.error}>
        Student not found
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={styles.mainbody}>
      <Navbar />
      <div className={styles.container}>
        <div className={`${styles.header} ${styles.StudentDetails}`}>
          <h1>Student Details</h1>
          {searchQuery && <p>Search Query: "{searchQuery}"</p>}
          {Object.entries(filters).map(([key, value]) => (
            value && <p key={key}>{key}: {value}</p>
          ))}
          {message && <h2 className={styles.filterMessage}>{message}</h2>}
          <div className={styles.actions}>
            {isEditing ? (
              <>
                <button className={`${styles.button} ${styles.saveButton}`} onClick={handleSave}>
                  Save Changes
                </button>
                <button className={`${styles.button} ${styles.cancelButton}`} onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <button className={`${styles.button} ${styles.editButton}`} onClick={handleEdit}>
                Edit Details
              </button>
            )}
            <button 
              className={`${styles.button} ${styles.backButton}`}
              onClick={() => navigate(-1)}
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className={styles.detailsTable}>
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedStudent.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  ) : (
                    student.name
                  )}
                </td>
              </tr>
              <tr>
                <th>Roll Number</th>
                <td>{student.rollNo}</td>
              </tr>
              <tr>
                <th>Enrollment Number</th>
                <td>{student.enrollNo}</td>
              </tr>
              <tr>
                <th>Course</th>
                <td>{student.course}</td>
              </tr>
              <tr>
                <th>Batch</th>
                <td>{student.batch}</td>
              </tr>
              <tr>
                <th>Blood Group</th>
                <td>
                  {isEditing ? (
                    <select
                      value={editedStudent.bloodGroup}
                      onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  ) : (
                    student.bloodGroup
                  )}
                </td>
              </tr>
              <tr>
                <th>Gender</th>
                <td>
                  {isEditing ? (
                    <select
                      value={editedStudent.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                    >
                      {['Male', 'Female', 'Other'].map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  ) : (
                    student.gender
                  )}
                </td>
              </tr>
              <tr>
                <th>Email</th>
                <td>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedStudent.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  ) : (
                    student.email
                  )}
                </td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedStudent.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  ) : (
                    student.phone
                  )}
                </td>
              </tr>
              <tr>
                <th>Address</th>
                <td>
                  {isEditing ? (
                    <textarea
                      value={editedStudent.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                    />
                  ) : (
                    student.address
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.resultsContainer}>
          {loading ? (
            <div className={styles.loading}>Loading students...</div>
          ) : students.length > 0 ? (
            <div className={styles.studentsGrid}>
              {students.map(student => (
                <div key={student.id} className={styles.studentCard}>
                  <h3>{student.name}</h3>
                  <div className={styles.studentInfo}>
                    <p><strong>Roll No:</strong> {student.rollNo}</p>
                    <p><strong>Course:</strong> {student.course}</p>
                    <p><strong>Batch:</strong> {student.batch}</p>
                    <p><strong>Gender:</strong> {student.gender}</p>
                    <p><strong>Blood Group:</strong> {student.bloodGroup}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              No students found with the applied filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetails; 
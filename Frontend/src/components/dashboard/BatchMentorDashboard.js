// import React from 'react';

// const BatchMentorDashboard = () => {
//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Batch Mentor Dashboard</h1>
//       <p>Welcome to the Batch Mentor Dashboard</p>
//     </div>
//   );
// };

// export default BatchMentorDashboard; 



//bottom code included excel downlod of stident list 
// import React, { useState, useEffect, useContext, useRef } from "react";
// import axios from "axios";
// import styles from "./BatchMentorDashboard.module.css";
// import Logo from '../../assets/iips_logo.png';
// import { ColorModeContext } from "../../App";
// import { useTheme } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { TablePagination } from "@mui/material";
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/student';

// const BatchMentorDashboard = () => {
//   const [dropdownLoading, setDropdownLoading] = useState(false);
//   const [filterLoading, setFilterLoading] = useState(false);
//   const filterRef = useRef(null);
//   const theme = useTheme();
//   const colorMode = useContext(ColorModeContext);
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [allBatchStudents, setAllBatchStudents] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState({ gender: "", bloodGroup: "", course: "", batch: "" });
//   const [error, setError] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editStudentId, setEditStudentId] = useState(null);
//   const [editStudentData, setEditStudentData] = useState(null);
//   const [editLoading, setEditLoading] = useState(false);
//   const [editError, setEditError] = useState(null);
//   const [deleteLoadingId, setDeleteLoadingId] = useState(null);
//   const [defaultStudentIds, setDefaultStudentIds] = useState(new Set());

//   const courses = ["MCA-5yrs", "MTech (IT)-5yrs","MTech (CS)-5yrs","MBA (MS)-5yrs","MBA (MS)-2yrs"
//     ,"MBA (T)-5yrs","MBA (Eship)","MBA (APR)", "BCom (Hons.)","Phd (Computer)","Pdh (Management)"];
//   const batches = ["2023","2024", "2025","2026"];
//   const genders = ["Male", "Female", "Other"];
//   const bloodGroup = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           console.log("No token found in localStorage");
//           return;
//         }

//         const response = await axios.get(`${API_BASE_URL}/viewstudent`, {
//           params: { page, size: rowsPerPage, sortBy: 'name' },
//           headers: {
//             Authorization: `Bearer ${token}`
//           },
//           withCredentials: true
//         });

//         const students = response.data.content;
//         setAllBatchStudents(students);
//         setSearchResults(students);

//         // Save the IDs of students from mentor's batch + course
//         const idSet = new Set(students.map((s) => s.id));
//         setDefaultStudentIds(idSet);
//       } catch (err) {
//         console.error("Error in fetchStudents:", err.message);
//         setError("Unable to load students");
//       }
//     };

//     fetchStudents();
//   }, [page, rowsPerPage]);

//   useEffect(() => {
//     if (!searchQuery) return;
//     const searchStudents = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/search`, {
//           params: { query: searchQuery },
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//           },
//           withCredentials: true
//         });
//         setSearchResults(response.data);
//       } catch (err) {
//         setError("Search failed");
//       }
//     };
//     searchStudents();
//   }, [searchQuery]);

//   useEffect(() => {
//     const hasFilters = Object.values(filters).some(val => val);
//     if (!hasFilters) {
//       setSearchResults(allBatchStudents);
//       return;
//     }

//     const fetchFilteredStudents = async () => {
//       try {
//         const response = await axios.post(`${API_BASE_URL}/filter`, filters, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json',
//           },
//           withCredentials: true,
//         });
//         setSearchResults(response.data); // or response.data.content if paginated
//       } catch (err) {
//         setError("Failed to filter students");
//       }
//     };

//     fetchFilteredStudents();
//   }, [filters, allBatchStudents]);

//   const handleSearchChange = (e) => setSearchQuery(e.target.value);
//   const handleClearSearch = () => setSearchQuery("");
//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };
//   const handleClearFilters = () => setFilters({ gender: "", bloodGroup: "", course: "", batch: "" });
//   const handleLogout = () => { localStorage.clear(); setIsLoggedIn(false); navigate('/login'); };

//   const openEditModal = (studentId) => {
//     const student = allBatchStudents.find((s) => s.id === studentId);
//     if (student) {
//       setEditStudentId(studentId);
//       setEditStudentData({ ...student });
//       setShowEditModal(true);
//     }
//   };

//   const closeEditModal = () => {
//     setShowEditModal(false);
//     setEditStudentId(null);
//     setEditStudentData(null);
//     setEditError(null);
//   };

//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditStudentData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSaveEdit = async () => {
//     setEditLoading(true);
//     setEditError(null);
//     try {
//       const response = await axios.put(`${API_BASE_URL}/updateStudent/${editStudentId}`, editStudentData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });
//       setAllBatchStudents((prev) =>
//         prev.map((student) => (student.id === editStudentId ? response.data : student))
//       );
//       closeEditModal();
//     } catch (err) {
//       setEditError("Failed to update student");
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   const handleDeleteStudent = async (studentId) => {
//     setDeleteLoadingId(studentId);
//     try {
//       await axios.delete(`${API_BASE_URL}/${studentId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         withCredentials: true
//       });
//       setAllBatchStudents((prev) =>
//         prev.filter((student) => student.id !== studentId)
//       );
//     } catch (err) {
//       setError("Failed to delete student");
//     } finally {
//       setDeleteLoadingId(null);
//     }
//   };

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // --- Excel Export Handler ---
//   const handleDownloadExcel = () => {
//     // If filters or search are applied, use searchResults; else use allBatchStudents
//     const hasFilters = Object.values(filters).some(val => val) || !!searchQuery;
//     const dataToExport = hasFilters ? searchResults : allBatchStudents;

//     // Map data for Excel
//     const excelData = dataToExport.map(student => ({
//       "Roll No": student.rollNo,
//       "Enrollment No": student.enrollmentNo,
//       "Name": student.name,
//       "Email": student.email,
//       "Gender": student.gender,
//       "Blood Group": student.bloodGroup,
//       "DOB": student.dob ? student.dob.slice(0, 10) : "",
//       "Contact": student.contact,
//       "Address": student.address,
//       "Course": student.course,
//       "Batch": student.batch,
//       "Father Name": student.fatherName,
//       "Father Contact": student.parentContact,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
//     const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'students.xlsx');
//   };

//   return (
//     <div className={`${styles.mainbody} ${theme.palette.mode === 'dark' ? styles.dark : styles.light}`}>
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           backgroundImage: "url('/images/background.jpg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           opacity: 0.1,
//           zIndex: -1,
//         }}
//       />

//       <div className={styles.dashboardContainer}>
//         <div className={styles.header}>
//           <h1>Batch Mentor Dashboard</h1>
//         </div>

//         <div className={styles.searchContainer}>
//           <div className={styles.searchWrapper}>
//             <span className={styles.searchIcon} aria-label="search">
//               <svg
//                 viewBox="0 0 24 24"
//                 width="20"
//                 height="20"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <circle cx="11" cy="11" r="8" />
//                 <line x1="21" y1="21" x2="16.65" y2="16.65" />
//               </svg>
//             </span>
//             <input
//               type="text"
//               className={styles.searchInput}
//               placeholder="Search by name, roll number, or enrollment number..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             {searchQuery && (
//               <button
//                 className={styles.clearButton}
//                 onClick={handleClearSearch}
//                 aria-label="Clear search"
//                 type="button"
//               >
//                 ×
//               </button>
//             )}
//           </div>
//         </div>

//         <div className={styles.filterContainerModern}>
//           <div className={styles.filterGrid}>
//             <div className={styles.filterGroupModern}>
//               <label className={styles.filterLabel}>Course</label>
//               <select
//                 className={styles.filterSelect}
//                 value={filters.course}
//                 onChange={(e) => handleFilterChange("course", e.target.value)}
//               >
//                 <option value="">All</option>
//                 {courses.map((course) => (
//                   <option key={course} value={course}>
//                     {course}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles.filterGroupModern}>
//               <label className={styles.filterLabel}>Batch</label>
//               <select
//                 className={styles.filterSelect}
//                 value={filters.batch}
//                 onChange={(e) => handleFilterChange("batch", e.target.value)}
//               >
//                 <option value="">All</option>
//                 {batches.map((batch) => (
//                   <option key={batch} value={batch}>
//                     {batch}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles.filterGroupModern}>
//               <label className={styles.filterLabel}>Gender</label>
//               <select
//                 className={styles.filterSelect}
//                 value={filters.gender}
//                 onChange={(e) => handleFilterChange("gender", e.target.value)}
//               >
//                 <option value="">All</option>
//                 {genders.map((g) => (
//                   <option key={g} value={g}>
//                     {g}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles.filterGroupModern}>
//               <label className={styles.filterLabel}>Blood Group</label>
//               <select
//                 className={styles.filterSelect}
//                 value={filters.bloodGroup}
//                 onChange={(e) =>
//                   handleFilterChange("bloodGroup", e.target.value)
//                 }
//               >
//                 <option value="">All</option>
//                 {bloodGroup.map((bg) => (
//                   <option key={bg} value={bg}>
//                     {bg}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles.filterActionsModern}>
//               <button
//                 className={`${styles.applyFiltersButtonModern} ${styles.clearfilter}`}
//                 onClick={handleClearFilters}
//                 type="button"
//               >
//                 Clear All Filters
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* --- Excel Download Button --- */}
//         <div style={{ margin: "16px 0" }}>
//           <button onClick={handleDownloadExcel} className={styles.exportButton}>
//             Export Excel
//           </button>
//         </div>

//         <div className={styles.contentArea}>
//           {dropdownLoading ? (
//             <div className={styles.loading}>Loading...</div>
//           ) : filterLoading ? (
//             <div className={styles.loadingCard}>Loading...</div>
//           ) : error ? (
//             <div className={styles.noResultsCard}>{error}</div>
//           ) : searchResults.length > 0 ? (
//             <div className={styles.studentTableWrapper}>
//               <table className={styles.studentTable}>
//                 <thead>
//                   <tr>
//                     <th>Roll No</th>
//                     <th>Enrollment No</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Gender</th>
//                     <th>BloodGroup</th>
//                     <th>DOB</th>
//                     <th>Contact</th>
//                     <th>Address</th>
//                     <th>Course</th>
//                     <th>Batch</th>
//                     <th>Father Name</th>
//                     <th>Father Contact</th>
//                     <th>Image</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {searchResults
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((student) => (
//                       <tr key={student.id}>
//                         <td>{student.rollNo}</td>
//                         <td>{student.enrollmentNo}</td>
//                         <td>{student.name}</td>
//                         <td>{student.email}</td>
//                         <td>{student.gender}</td>
//                         <td>{student.bloodGroup}</td>
//                         <td>{student.dob ? student.dob.slice(0, 10) : ""}</td>
//                         <td>{student.contact}</td>
//                         <td>{student.address}</td>
//                         <td>{student.course}</td>
//                         <td>{student.batch}</td>
//                         <td>{student.fatherName}</td>
//                         <td>{student.parentContact}</td>
//                         <td>
//                           {student.image ? (
//                             <img
//                               src={student.image}
//                               alt={student.name}
//                               className={styles.studentImagePreview}
//                             />
//                           ) : (
//                             "N/A"
//                           )}
//                         </td>
//                         <td>
//                           {/* Actions here */}
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//               <TablePagination
//                 component="div"
//                 count={searchResults.length}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 rowsPerPage={rowsPerPage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 rowsPerPageOptions={[5, 10, 25, 50]}
//               />
//             </div>
//           ) : (
//             <div className={styles.noResultsCard}>No students found.</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BatchMentorDashboard;


// import React, { useState, useEffect, useContext, useRef } from "react";
// import axios from "axios";
// import styles from "./BatchMentorDashboard.module.css";
// import Logo from '../../assets/iips_logo.png';
// import { ColorModeContext } from "../../App";
// import { useTheme } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { TablePagination } from "@mui/material";
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/student';

// const BatchMentorDashboard = () => {
//   const [dropdownLoading, setDropdownLoading] = useState(false);
//   const [filterLoading, setFilterLoading] = useState(false);
//   const filterRef = useRef(null);
//   const theme = useTheme();
//   const colorMode = useContext(ColorModeContext);
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [allBatchStudents, setAllBatchStudents] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState({ gender: "", bloodGroup: "", course: "", batch: "" });
//   const [error, setError] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editStudentId, setEditStudentId] = useState(null);
//   const [editStudentData, setEditStudentData] = useState(null);
//   const [editLoading, setEditLoading] = useState(false);
//   const [editError, setEditError] = useState(null);
//   const [deleteLoadingId, setDeleteLoadingId] = useState(null);
//   const [defaultStudentIds, setDefaultStudentIds] = useState(new Set());

//   const courses = ["MCA-5yrs", "MTech (IT)-5yrs", "MTech (CS)-5yrs", "MBA (MS)-5yrs", "MBA (MS)-2yrs"
//     , "MBA (T)-5yrs", "MBA (Eship)", "MBA (APR)", "BCom (Hons.)", "Phd (Computer)", "Pdh (Management)"];
//   const batches = ["2023", "2024", "2025", "2026"];
//   const genders = ["Male", "Female", "Other"];
//   const bloodGroup = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           console.log("No token found in localStorage");
//           return;
//         }

//         const response = await axios.get(`${API_BASE_URL}/viewstudent`, {
//           params: { page, size: rowsPerPage, sortBy: 'name' },
//           headers: {
//             Authorization: `Bearer ${token}`
//           },
//           withCredentials: true
//         });

//         const students = response.data.content;
//         setAllBatchStudents(students);
//         setSearchResults(students);

//         // Save the IDs of students from mentor's batch + course
//         const idSet = new Set(students.map((s) => s.id));
//         setDefaultStudentIds(idSet);
//       } catch (err) {
//         console.error("Error in fetchStudents:", err.message);
//         setError("Unable to load students");
//       }
//     };

//     fetchStudents();
//   }, [page, rowsPerPage]);

//   useEffect(() => {
//     if (!searchQuery) return;
//     const searchStudents = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/search`, {
//           params: { query: searchQuery },
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//           },
//           withCredentials: true
//         });
//         setSearchResults(response.data);
//       } catch (err) {
//         setError("Search failed");
//       }
//     };
//     searchStudents();
//   }, [searchQuery]);

//   useEffect(() => {
//     const hasFilters = Object.values(filters).some(val => val);
//     if (!hasFilters) {
//       setSearchResults(allBatchStudents);
//       return;
//     }

//     const fetchFilteredStudents = async () => {
//       try {
//         const response = await axios.post(`${API_BASE_URL}/filter`, filters, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json',
//           },
//           withCredentials: true,
//         });
//         setSearchResults(response.data); // or response.data.content if paginated
//       } catch (err) {
//         setError("Failed to filter students");
//       }
//     };

//     fetchFilteredStudents();
//   }, [filters, allBatchStudents]);

//   const handleSearchChange = (e) => setSearchQuery(e.target.value);
//   const handleClearSearch = () => setSearchQuery("");
//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };
//   const handleClearFilters = () => setFilters({ gender: "", bloodGroup: "", course: "", batch: "" });
//   const handleLogout = () => { localStorage.clear(); setIsLoggedIn(false); navigate('/login'); };

//   const openEditModal = (studentId) => {
//     const student = allBatchStudents.find((s) => s.id === studentId);
//     if (student) {
//       setEditStudentId(studentId);
//       setEditStudentData({ ...student });
//       setShowEditModal(true);
//     }
//   };

//   const closeEditModal = () => {
//     setShowEditModal(false);
//     setEditStudentId(null);
//     setEditStudentData(null);
//     setEditError(null);
//   };

//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditStudentData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSaveEdit = async () => {
//     setEditLoading(true);
//     setEditError(null);
//     try {
//       const response = await axios.put(`${API_BASE_URL}/updateStudent/${editStudentId}`, editStudentData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });
//       setAllBatchStudents((prev) =>
//         prev.map((student) => (student.id === editStudentId ? response.data : student))
//       );
//       closeEditModal();
//     } catch (err) {
//       setEditError("Failed to update student");
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   const handleDeleteStudent = async (studentId) => {
//     setDeleteLoadingId(studentId);
//     try {
//       await axios.delete(`${API_BASE_URL}/${studentId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         withCredentials: true
//       });
//       setAllBatchStudents((prev) =>
//         prev.filter((student) => student.id !== studentId)
//       );
//     } catch (err) {
//       setError("Failed to delete student");
//     } finally {
//       setDeleteLoadingId(null);
//     }
//   };

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // --- Excel Export Handler ---
//   const handleDownloadExcel = () => {
//     const hasFilters = Object.values(filters).some(val => val) || !!searchQuery;
//     const dataToExport = hasFilters ? searchResults : allBatchStudents;

//     const excelData = dataToExport.map(student => ({
//       "Roll No": student.rollNo,
//       "Enrollment No": student.enrollmentNo,
//       "Name": student.name,
//       "Email": student.email,
//       "Gender": student.gender,
//       "Blood Group": student.bloodGroup,
//       "DOB": student.dob ? student.dob.slice(0, 10) : "",
//       "Contact": student.contact,
//       "Address": student.address,
//       "Course": student.course,
//       "Batch": student.batch,
//       "Father Name": student.fatherName,
//       "Father Contact": student.parentContact,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
//     const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'students.xlsx');
//   };

//   return (
//     <div className={`${styles.mainbody} ${theme.palette.mode === 'dark' ? styles.dark : styles.light}`}>
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           backgroundImage: "url('/images/background.jpg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           opacity: 0.1,
//           zIndex: -1,
//         }}
//       />

//       <div className={styles.dashboardContainer}>
//         <div className={styles.header}>
//           <h1>Batch Mentor Dashboard</h1>
//         </div>

//         <div className={styles.searchContainer}>
//           <div className={styles.searchWrapper}>
//             <span className={styles.searchIcon} aria-label="search">
//               <svg
//                 viewBox="0 0 24 24"
//                 width="20"
//                 height="20"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <circle cx="11" cy="11" r="8" />
//                 <line x1="21" y1="21" x2="16.65" y2="16.65" />
//               </svg>
//             </span>
//             <input
//               type="text"
//               className={styles.searchInput}
//               placeholder="Search by name, roll number, or enrollment number..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             {searchQuery && (
//               <button
//                 className={styles.clearButton}
//                 onClick={handleClearSearch}
//                 aria-label="Clear search"
//                 type="button"
//               >
//                 ×
//               </button>
//             )}
//           </div>
//         </div>

//         <div className={styles.filterContainerModern}>
//           <div className={styles.filterGrid}>
//             <div className={styles.filterGroupModern}>
//               <label className={styles.filterLabel}>Course</label>
//               <select
//                 className={styles.filterSelect}
//                 value={filters.course}
//                 onChange={(e) => handleFilterChange("course", e.target.value)}
//               >
//                 <option value="">All</option>
//                 {courses.map((course) => (
//                   <option key={course} value={course}>
//                     {course}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles.filterGroupModern}>
//               <label className={styles.filterLabel}>Batch</label>
//               <select
//                 className={styles.filterSelect}
//                 value={filters.batch}
//                 onChange={(e) => handleFilterChange("batch", e.target.value)}
//               >
//                 <option value="">All</option>
//                 {batches.map((batch) => (
//                   <option key={batch} value={batch}>
//                     {batch}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles.filterGroupModern}>
//               <label className={styles.filterLabel}>Gender</label>
//               <select
//                 className={styles.filterSelect}
//                 value={filters.gender}
//                 onChange={(e) => handleFilterChange("gender", e.target.value)}
//               >
//                 <option value="">All</option>
//                 {genders.map((g) => (
//                   <option key={g} value={g}>
//                     {g}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles.filterGroupModern}>
//               <label className={styles.filterLabel}>Blood Group</label>
//               <select
//                 className={styles.filterSelect}
//                 value={filters.bloodGroup}
//                 onChange={(e) =>
//                   handleFilterChange("bloodGroup", e.target.value)
//                 }
//               >
//                 <option value="">All</option>
//                 {bloodGroup.map((bg) => (
//                   <option key={bg} value={bg}>
//                     {bg}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles.filterActionsModern}>
//               <button
//                 className={`${styles.applyFiltersButtonModern} ${styles.clearfilter}`}
//                 onClick={handleClearFilters}
//                 type="button"
//               >
//                 Clear All Filters
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* --- Excel Download Button --- */}
//         <div style={{ margin: "16px 0" }}>
//           <button onClick={handleDownloadExcel} className={styles.exportButton}>
//             Export Excel
//           </button>
//         </div>

//         <div className={styles.contentArea}>
//           {dropdownLoading ? (
//             <div className={styles.loading}>Loading...</div>
//           ) : filterLoading ? (
//             <div className={styles.loadingCard}>Loading...</div>
//           ) : error ? (
//             <div className={styles.noResultsCard}>{error}</div>
//           ) : searchResults.length > 0 ? (
//             <div className={styles.studentTableWrapper}>
//               <table className={styles.studentTable}>
//                 <thead>
//                   <tr>
//                     <th>Roll No</th>
//                     <th>Enrollment No</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Gender</th>
//                     <th>BloodGroup</th>
//                     <th>DOB</th>
//                     <th>Contact</th>
//                     <th>Address</th>
//                     <th>Course</th>
//                     <th>Batch</th>
//                     <th>Father Name</th>
//                     <th>Father Contact</th>
//                     <th>Image</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {searchResults
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((student) => (
//                       <tr key={student.id}>
//                         <td>{student.rollNo}</td>
//                         <td>{student.enrollmentNo}</td>
//                         <td>{student.name}</td>
//                         <td>{student.email}</td>
//                         <td>{student.gender}</td>
//                         <td>{student.bloodGroup}</td>
//                         <td>{student.dob ? student.dob.slice(0, 10) : ""}</td>
//                         <td>{student.contact}</td>
//                         <td>{student.address}</td>
//                         <td>{student.course}</td>
//                         <td>{student.batch}</td>
//                         <td>{student.fatherName}</td>
//                         <td>{student.parentContact}</td>
//                         <td>
//                           {student.image ? (
//                             <img
//                               src={student.image}
//                               alt={student.name}
//                               className={styles.studentImagePreview}
//                             />
//                           ) : (
//                             <span className={styles.noImage}>No Image</span>
//                           )}
//                         </td>
//                         <td>
//                           {defaultStudentIds.has(student.id) && (
//                             <>
//                               <button
//                                 className={styles.applyFiltersButtonModern}
//                                 style={{ marginRight: 8, padding: "4px 10px", fontSize: "0.95rem" }}
//                                 onClick={() => openEditModal(student.id)}
//                                 type="button"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 className={styles.clearFiltersButtonModern}
//                                 style={{ padding: "4px 10px", fontSize: "0.95rem" }}
//                                 onClick={() => handleDeleteStudent(student.id)}
//                                 type="button"
//                                 disabled={deleteLoadingId === student.id}
//                               >
//                                 {deleteLoadingId === student.id ? "Deleting..." : "Delete"}
//                               </button>
//                             </>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//               {/* <TablePagination
//                 component="div"
//                 count={searchResults.length}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 rowsPerPage={rowsPerPage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 rowsPerPageOptions={[5, 10, 25, 50]}
//               /> */}
//             </div>
//           ) : (
//             <div className={styles.noResultsCard}>No students found.</div>
//           )}
//         </div>
//         <TablePagination
//           component="div"
//           count={searchResults.length}
//           page={page}
//           onPageChange={handleChangePage}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           rowsPerPageOptions={[5, 10, 25, 50]}
//         />
//       </div>

//       {/* Edit Modal - Added from previous code */}
//       {showEditModal && (
//         <div className={styles.modalOverlay}>
//           <div
//             className={styles.modalContent}
//             style={{
//               maxWidth: 500,
//               width: "100%",
//               position: "relative",
//               paddingBottom: 80,
//             }}
//           >
//             <h2 style={{ marginBottom: 16 }}>Edit Student</h2>
//             {editLoading ? (
//               <div className={styles.loadingCard}>Loading...</div>
//             ) : editError ? (
//               <div className={styles.noResultsCard}>{editError}</div>
//             ) : editStudentData ? (
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleSaveEdit();
//                 }}
//               >
//                 <div className={styles.editGridFields}>
//                   <label>
//                     Name
//                     <input
//                       name="name"
//                       value={editStudentData.name || ""}
//                       onChange={handleEditInputChange}
//                       className={styles.searchInput}
//                     />
//                   </label>
//                   <label>
//                     Roll Number
//                     <input
//                       name="rollNo"
//                       value={editStudentData.rollNo || ""}
//                       onChange={handleEditInputChange}
//                       className={styles.searchInput}
//                     />
//                   </label>
//                   <label>
//                     Enrollment Number
//                     <input
//                       name="enrollmentNo"
//                       value={editStudentData.enrollmentNo || ""}
//                       onChange={handleEditInputChange}
//                       className={styles.searchInput}
//                     />
//                   </label>
//                   <label>
//                     Email
//                     <input
//                       name="email"
//                       value={editStudentData.email || ""}
//                       onChange={handleEditInputChange}
//                       className={styles.searchInput}
//                     />
//                   </label>
//                   <label>
//                     Gender
//                     <select
//                       name="gender"
//                       value={editStudentData.gender || ""}
//                       onChange={handleEditInputChange}
//                       className={styles.filterSelect}
//                     >
//                       <option value="">Select</option>
//                       {genders.map((g) => (
//                         <option key={g} value={g}>
//                           {g}
//                         </option>
//                       ))}
//                     </select>
//                   </label>
//                   <label>
//                     Blood Group
//                     <select
//                       name="bloodGroup"
//                       value={editStudentData.bloodGroup || ""}
//                       onChange={handleEditInputChange}
//                       className={styles.filterSelect}
//                     >
//                       <option value="">Select</option>
//                       {bloodGroup.map((bg) => (
//                         <option key={bg} value={bg}>
//                           {bg}
//                         </option>
//                       ))}
//                     </select>
//                   </label>
//                   <label>
//                     DOB
//                     <input
//                       name="dob"
//                       value={editStudentData.dob || ""}
//                       onChange={handleEditInputChange}
//                       className={styles.searchInput}
//                     />
//                   </label>
//                   <label>
//                     Contact
//                     <input
//                       name="contact"
//                       value={editStudentData.contact || ""}
//                       onChange={handleEditInputChange}
//                       className={styles.searchInput}
//                     />
//                   </label>
//                   <label>
//                     Address
//                     <input
//                       name="address"
//                       value={editStudentData.address || ""}
//                       onChange={handleEditInputChange}
//                       className={styles.searchInput}
//                     />
//                   </label>
//                   <label>
//                     Course
//                     <select
//                       name="course"
//                       value={editStudentData.course || ""}
//                       onChange={handleEditInputChange}
//                       className={styles.filterSelect}
//                     >
//                       <option value="">Select</option>
//                       {courses.map((c) => (
//                         <option key={c} value={c}>
//                           {c}
//                         </option>
//                       ))}
//                     </select>
//                   </label>
//                   <label>
//                     Batch
//                     <select
//                       name="batch"
//                       value={editStudentData.batch || ""}
//                       onChange={handleEditInputChange}
//                       className={styles.filterSelect}
//                     >
//                       <option value="">Select</option>
//                       {batches.map((b) => (
//                         <option key={b} value={b}>
//                           {b}
//                         </option>
//                       ))}
//                     </select>
//                   </label>
//                   <label>
//                     Father Name
//                     <input
//                       name="fatherName"
//                       value={editStudentData.fatherName || ""}
//                       onChange={handleEditInputChange}
//                       className={styles.searchInput}
//                     />
//                   </label>
//                   <label>
//                     Image URL
//                     <input
//                       name="image"
//                       value={editStudentData.image || ""}
//                       onChange={handleEditInputChange}
//                       className={styles.searchInput}
//                     />
//                   </label>
//                 </div>
//                 <div className={styles.stickyModalActions}>
//                   <button
//                     type="button"
//                     className={styles.clearFiltersButtonModern}
//                     onClick={closeEditModal}
//                     style={{ minWidth: 90 }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className={styles.applyFiltersButtonModern}
//                     style={{ minWidth: 120 }}
//                     disabled={editLoading}
//                   >
//                     {editLoading ? "Saving..." : "Save Changes"}
//                   </button>
//                 </div>
//               </form>
//             ) : null}
//           </div>
//           <div className={styles.modalBackdrop} onClick={closeEditModal}></div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BatchMentorDashboard;

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import styles from "./BatchMentorDashboard.module.css";
import Logo from '../../assets/iips_logo.png';
import { ColorModeContext } from "../../App";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TablePagination } from "@mui/material";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://student-information-system-production-9468.up.railway.app/api/student';

const BatchMentorDashboard = () => {
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const filterRef = useRef(null);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allBatchStudents, setAllBatchStudents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ gender: "", bloodGroup: "", course: "", batch: "" });
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  const [editStudentData, setEditStudentData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [defaultStudentIds, setDefaultStudentIds] = useState(new Set());

  const courses = ["MCA-5yrs", "MTech (IT)-5yrs", "MTech (CS)-5yrs", "MBA (MS)-5yrs", "MBA (MS)-2yrs"
    , "MBA (T)-5yrs", "MBA (Eship)", "MBA (APR)", "BCom (Hons.)", "Phd (Computer)", "Pdh (Management)"];
  const batches = ["2023", "2024", "2025", "2026"];
  const genders = ["Male", "Female", "Other"];
  const bloodGroup = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];



  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log("No token found in localStorage");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/viewstudent`, {
          params: { page, size: rowsPerPage, sortBy: 'name' },
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        const students = response.data.content;
        setAllBatchStudents(students);
        setSearchResults(students);

        // Save the IDs of students from mentor's batch + course
        const idSet = new Set(students.map((s) => s.id));
        setDefaultStudentIds(idSet);
      } catch (err) {
        console.error("Error in fetchStudents:", err.message);
        setError("Unable to load students");
      }
    };

    fetchStudents();
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (!searchQuery) return;
    const searchStudents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/search`, {
          params: { query: searchQuery },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          withCredentials: true
        });
        setSearchResults(response.data);
      } catch (err) {
        setError("Search failed");
      }
    };
    searchStudents();
  }, [searchQuery]);

  useEffect(() => {
    const hasFilters = Object.values(filters).some(val => val);
    if (!hasFilters) {
      setSearchResults(allBatchStudents);
      return;
    }

    const fetchFilteredStudents = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/filter`, filters, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setSearchResults(response.data); // or response.data.content if paginated
      } catch (err) {
        setError("Failed to filter students");
      }
    };

    fetchFilteredStudents();
  }, [filters, allBatchStudents]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleClearSearch = () => setSearchQuery("");
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const handleClearFilters = () => setFilters({ gender: "", bloodGroup: "", course: "", batch: "" });
  const handleLogout = () => { localStorage.clear(); setIsLoggedIn(false); navigate('/login'); };

  // const openEditModal = (studentId) => {
  //   const student = allBatchStudents.find((s) => s.id === studentId);
  //   if (student) {
  //     setEditStudentId(studentId);
  //     setEditStudentData({ ...student });
  //     setShowEditModal(true);
  //     console.log("Student not found in allBatchStudents");
  //   }
  // };


  const openEditModal = (studentId) => {
    const student = searchResults.find((s) => s.id === studentId);
    if (student) {
      setEditStudentId(studentId);
      setEditStudentData({ ...student });
      setShowEditModal(true);
    } else {
      console.log("Student not found in searchResults");
    }
  };



  const closeEditModal = () => {
    setShowEditModal(false);
    setEditStudentId(null);
    setEditStudentData(null);
    setEditError(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    setEditLoading(true);
    setEditError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/updateStudent/${editStudentId}`, editStudentData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      setAllBatchStudents((prev) =>
        prev.map((student) => (student.id === editStudentId ? response.data : student))
      );
      closeEditModal();
    } catch (err) {
      setEditError("Failed to update student");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    setDeleteLoadingId(studentId);
    try {
      await axios.delete(`${API_BASE_URL}/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });
      setAllBatchStudents((prev) =>
        prev.filter((student) => student.id !== studentId)
      );
    } catch (err) {
      setError("Failed to delete student");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // --- Excel Export Handler ---
  const handleDownloadExcel = () => {
    const hasFilters = Object.values(filters).some(val => val) || !!searchQuery;
    const dataToExport = hasFilters ? searchResults : allBatchStudents;
    const excelData = dataToExport.map(student => ({
      "Roll No": student.rollNo,
      "Enrollment No": student.enrollmentNo,
      "Name": student.name,
      "Email": student.email,
      "Gender": student.gender,
      "Blood Group": student.bloodGroup,
      "DOB": student.dob ? student.dob.slice(0, 10) : "",
      "Contact": student.contact,
      "Address": student.address,
      "Course": student.course,
      "Batch": student.batch,
      "Father Name": student.fatherName,
      "Father Contact": student.parentContact,
      "Admission Slip": student.admissionSlip,
      "Aadhar Image": student.aadharImage,
      "CUET No": student.cuetno,
    }));


    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'students.xlsx');
  };

  return (
    <div className={`${styles.mainbody} ${theme.palette.mode === 'dark' ? styles.dark : styles.light}`}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/images/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          zIndex: -1,
        }}
      />

      <div className={styles.dashboardContainer}>
        <div className={styles.header}>
          <h1>Batch Mentor Dashboard</h1>
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon} aria-label="search">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by name, roll number, or enrollment number..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                className={styles.clearButton}
                onClick={handleClearSearch}
                aria-label="Clear search"
                type="button"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className={styles.filterContainerModern}>
          <div className={styles.filterGrid}>
            <div className={styles.filterGroupModern}>
              <label className={styles.filterLabel}>Course</label>
              <select
                className={styles.filterSelect}
                value={filters.course}
                onChange={(e) => handleFilterChange("course", e.target.value)}
              >
                <option value="">All</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroupModern}>
              <label className={styles.filterLabel}>Batch</label>
              <select
                className={styles.filterSelect}
                value={filters.batch}
                onChange={(e) => handleFilterChange("batch", e.target.value)}
              >
                <option value="">All</option>
                {batches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroupModern}>
              <label className={styles.filterLabel}>Gender</label>
              <select
                className={styles.filterSelect}
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
              >
                <option value="">All</option>
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroupModern}>
              <label className={styles.filterLabel}>Blood Group</label>
              <select
                className={styles.filterSelect}
                value={filters.bloodGroup}
                onChange={(e) =>
                  handleFilterChange("bloodGroup", e.target.value)
                }
              >
                <option value="">All</option>
                {bloodGroup.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterActionsModern}>
              <button
                className={`${styles.applyFiltersButtonModern} ${styles.clearfilter}`}
                onClick={handleClearFilters}
                type="button"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* --- Excel Download Button --- */}
        <div style={{ margin: "16px 0" }}>
          <button onClick={handleDownloadExcel} className={styles.exportButton}>
            Export Excel
          </button>
        </div>

        <div className={styles.contentArea}>
          {dropdownLoading ? (
            <div className={styles.loading}>Loading...</div>
          ) : filterLoading ? (
            <div className={styles.loadingCard}>Loading...</div>
          ) : error ? (
            <div className={styles.noResultsCard}>{error}</div>
          ) : searchResults.length > 0 ? (
            <div className={styles.studentTableWrapper}>
              <table className={styles.studentTable}>
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Enrollment No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>BloodGroup</th>
                    <th>DOB</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Course</th>
                    <th>Batch</th>
                    <th>Father Name</th>
                    <th>Father Contact</th>
                    <th>Image</th>
                    <th>Admission Slip</th>
                    <th>Aadhar Image</th>
                    <th>CUET No</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((student) => (
                      <tr key={student.id}>
                        <td>{student.rollNo}</td>
                        <td>{student.enrollmentNo}</td>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.gender}</td>
                        <td>{student.bloodGroup}</td>
                        <td>{student.dob ? student.dob.slice(0, 10) : ""}</td>
                        <td>{student.contact}</td>
                        <td>{student.address}</td>
                        <td>{student.course}</td>
                        <td>{student.batch}</td>
                        <td>{student.fatherName}</td>
                        <td>{student.parentContact}</td>
                        <td>
                          {student.image ? (
                            <img
                              src={student.image}
                              alt={student.name}
                              className={styles.studentImagePreview}
                            />
                          ) : (
                            <span className={styles.noImage}>No Image</span>
                          )}
                        </td>
                        <td>
                          {student.admissionSlip ? (
                            <a href={student.admissionSlip} target="_blank" rel="noopener noreferrer">View</a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td>
                          {student.aadharImage ? (
                            <a href={student.aadharImage} target="_blank" rel="noopener noreferrer">View</a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td>{student.cuetno || "N/A"}</td>
                        {/* <td>
                          {student.image ? (
                            <img
                              src={student.image}
                              alt={student.name}
                              className={styles.studentImagePreview}
                            />
                          ) : (
                            <span className={styles.noImage}>No Image</span>
                          )}
                        </td> */}

                        <td>
                          {defaultStudentIds.has(student.id) && (
                            <>
                              <button
                                className={styles.applyFiltersButtonModern}
                                style={{ marginRight: 8, padding: "4px 10px", fontSize: "0.95rem" }}
                                onClick={() => openEditModal(student.id)}
                                type="button"
                              >
                                Edit
                              </button>
                              <button
                                className={styles.clearFiltersButtonModern}
                                style={{ padding: "4px 10px", fontSize: "0.95rem" }}
                                onClick={() => handleDeleteStudent(student.id)}
                                type="button"
                                disabled={deleteLoadingId === student.id}
                              >
                                {deleteLoadingId === student.id ? "Deleting..." : "Delete"}
                              </button>
                            </>
                          )}


                          {/* <button onClick={() => {
                            console.log("Edit button clicked for student:", student.id);
                            openEditModal(student.id);
                          }}>Edit</button>
                          <button onClick={() => handleDeleteStudent(student.id)}>Delete</button> */}


                          {/* {defaultStudentIds.has(student.id) && (
                            <>
                              <button
                                className={styles.applyFiltersButtonModern}
                                style={{ marginRight: 8, padding: "4px 10px", fontSize: "0.95rem" }}
                                onClick={() => openEditModal(student.id)}
                                type="button"
                              >
                                Edit
                              </button>
                              <button
                                className={styles.clearFiltersButtonModern}
                                style={{ padding: "4px 10px", fontSize: "0.95rem" }}
                                onClick={() => handleDeleteStudent(student.id)}
                                type="button"
                                disabled={deleteLoadingId === student.id}
                              >
                                {deleteLoadingId === student.id ? "Deleting..." : "Delete"}
                              </button>
                            </>
                          )} */}




                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* <TablePagination
                component="div"
                count={searchResults.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              /> */}
            </div>
          ) : (
            <div className={styles.noResultsCard}>No students found.</div>
          )}
        </div>
        <TablePagination
          component="div"
          count={searchResults.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </div>

      {/* Edit Modal - Added from previous code */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div
            className={styles.modalContent}
            style={{
              maxWidth: 500,
              width: "100%",
              position: "relative",
              paddingBottom: 80,
            }}
          >
            <h2 style={{ marginBottom: 16 }}>Edit Student</h2>
            {editLoading ? (
              <div className={styles.loadingCard}>Loading...</div>
            ) : editError ? (
              <div className={styles.noResultsCard}>{editError}</div>
            ) : editStudentData ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit();
                }}
              >
                <div className={styles.editGridFields}>
                  <label>
                    Name
                    <input
                      name="name"
                      value={editStudentData.name || ""}
                      onChange={handleEditInputChange}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    Roll Number
                    <input
                      name="rollNo"
                      value={editStudentData.rollNo || ""}
                      onChange={handleEditInputChange}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    Enrollment Number
                    <input
                      name="enrollmentNo"
                      value={editStudentData.enrollmentNo || ""}
                      onChange={handleEditInputChange}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    Email
                    <input
                      name="email"
                      value={editStudentData.email || ""}
                      onChange={handleEditInputChange}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    Gender
                    <select
                      name="gender"
                      value={editStudentData.gender || ""}
                      onChange={handleEditInputChange}
                      className={styles.filterSelect}
                    >
                      <option value="">Select</option>
                      {genders.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Blood Group
                    <select
                      name="bloodGroup"
                      value={editStudentData.bloodGroup || ""}
                      onChange={handleEditInputChange}
                      className={styles.filterSelect}
                    >
                      <option value="">Select</option>
                      {bloodGroup.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    DOB
                    <input
                      name="dob"
                      value={editStudentData.dob || ""}
                      onChange={handleEditInputChange}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    Contact
                    <input
                      name="contact"
                      value={editStudentData.contact || ""}
                      onChange={handleEditInputChange}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    Address
                    <input
                      name="address"
                      value={editStudentData.address || ""}
                      onChange={handleEditInputChange}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    Course
                    <select
                      name="course"
                      value={editStudentData.course || ""}
                      onChange={handleEditInputChange}
                      className={styles.filterSelect}
                    >
                      <option value="">Select</option>
                      {courses.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Batch
                    <select
                      name="batch"
                      value={editStudentData.batch || ""}
                      onChange={handleEditInputChange}
                      className={styles.filterSelect}
                    >
                      <option value="">Select</option>
                      {batches.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Father Name
                    <input
                      name="fatherName"
                      value={editStudentData.fatherName || ""}
                      onChange={handleEditInputChange}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    Image URL
                    <input
                      name="image"
                      value={editStudentData.image || ""}
                      onChange={handleEditInputChange}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    Admission Slip URL
                    <input
                      name="admissionSlip"
                      value={editStudentData.admissionSlip || ""}
                      onChange={handleEditInputChange}
                      className={styles.searchInput}
                    />
                  </label>

                  <label>
                    Aadhar Image URL
                    <input
                      name="aadharImage"
                      value={editStudentData.aadharImage || ""}
                      onChange={handleEditInputChange}
                      className={styles.searchInput}
                    />
                  </label>

                  <label>
                    CUET No
                    <input
                      name="cuetno"
                      value={editStudentData.cuetno || ""}
                      onChange={handleEditInputChange}
                      className={styles.searchInput}
                    />
                  </label>

                </div>
                <div className={styles.stickyModalActions}>
                  <button
                    type="button"
                    className={styles.clearFiltersButtonModern}
                    onClick={closeEditModal}
                    style={{ minWidth: 90 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.applyFiltersButtonModern}
                    style={{ minWidth: 120 }}
                    disabled={editLoading}
                  >
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : null}
          </div>
          <div className={styles.modalBackdrop} onClick={closeEditModal}></div>
        </div>
      )}
    </div>
  );
};

export default BatchMentorDashboard;
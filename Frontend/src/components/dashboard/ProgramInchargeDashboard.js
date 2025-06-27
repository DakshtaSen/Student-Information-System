import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import styles from "./ProgramInchargeDashboard.module.css";
import Logo from '../../assets/iips_logo.png';
import { ColorModeContext } from "../../App";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TablePagination } from "@mui/material";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/student';

const ProgramInchargeDashboard = () => {
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
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);

  const courses = ["MCA-5yrs", "MTech (IT)-5yrs", "MTech (CS)-5yrs", "MBA (MS)-5yrs", "MBA (MS)-5yrs"
    , "MBA (T)-5yrs", "MBA (Eship)", "MBA (APR)", "BCom (Hons.)", "Phd (Computer)", "Pdh (Management)"];
  const batches = ["2023", "2024", "2025", "2026"];
  const genders = ["Male", "Female", "Other"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/viewstudent`, {
          params: { page, size: rowsPerPage, sortBy: 'name' },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        setAllBatchStudents(response.data.content);
        setSearchResults(response.data.content);
      } catch (err) {
        console.error("Error in fetchStudents:", err);
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        setSearchResults(response.data);
      } catch (err) {
        console.error("Search failed:", err);
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
        const requestPayload = {
          gender: filters.gender,
          bloodGroup: filters.bloodGroup,
          course: filters.course,
          batch: filters.batch,
          searchTerm: ""
        };

        const response = await axios.post(`${API_BASE_URL}/filter`, requestPayload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
          withCredentials: true
        });

        setSearchResults(response.data);
      } catch (err) {
        console.error("Filter error:", err);
        setError("Failed to filter students");
      }
    };

    fetchFilteredStudents();
  }, [filters]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleClearSearch = () => setSearchQuery("");
  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const handleClearFilters = () => setFilters({ gender: "", bloodGroup: "", course: "", batch: "" });
  const handleLogout = () => { localStorage.clear(); setIsLoggedIn(false); navigate('/login'); };
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // --- Excel Export Handler ---
  const handleDownloadExcel = () => {
    // If filters or search are applied, use searchResults; else use allBatchStudents
    const hasFilters = Object.values(filters).some(val => val) || !!searchQuery;
    const dataToExport = hasFilters ? searchResults : allBatchStudents;

    // Map data for Excel
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
      "Father's Name": student.fatherName,
      "Parent's Contact": student.parentContact,
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
          backgroundImage: "url('../assets/image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          zIndex: -1,
        }}
      />

      <div className={styles.dashboardContainer}>
        <div className={styles.header}>
          <h1>Program Incharge Dashboard</h1>
        </div>

        {/* Search bar */}
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

        {/* Filter container */}
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
                {bloodGroups.map((bg) => (
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

        {/* --- Export Excel Button --- */}
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
                    <th>Blood Group</th>
                    <th>DOB</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Course</th>
                    <th>Batch</th>
                    <th>Father's Name</th>
                    <th>Parent's Contact</th>
                    <th>Image</th>
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
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.noStudents}>No students found</div>
          )}
        </div>
        <TablePagination
          component="div"
          count={searchResults.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            color: theme.palette.mode === 'dark' ? '#cdd6f4' : '#333',
            '.MuiTablePagination-select': {
              color: theme.palette.mode === 'dark' ? '#cdd6f4' : '#333',
            },
            '.MuiTablePagination-selectIcon': {
              color: theme.palette.mode === 'dark' ? '#cdd6f4' : '#333',
            },
            '.MuiTablePagination-displayedRows': {
              color: theme.palette.mode === 'dark' ? '#cdd6f4' : '#333',
            },
            '.MuiTablePagination-actions': {
              color: theme.palette.mode === 'dark' ? '#cdd6f4' : '#333',
            },
          }}
        />
      </div>
    </div>
  );
};

export default ProgramInchargeDashboard;


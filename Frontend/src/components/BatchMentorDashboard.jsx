import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BatchMentorDashboard.module.css';
import Navbar from './navbar';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';


const apiService = {
  searchStudents: async (query, filters) => {
    try {
      const params = new URLSearchParams();

      if (query) params.append('query', query);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.bloodGroup) params.append('bloodGroup', filters.bloodGroup);
      if (filters.course) params.append('course', filters.course);
      if (filters.batch) params.append('batch', filters.batch);

      const response = await fetch(`http://localhost:8080/api/student/search?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Search failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Search Error:', error);
      throw error;
    }
  }
};


const BatchMentorDashboard = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    bloodGroup: '',
    course: '',
    batch: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const courses = ['MCA', 'MTech', 'MBA', 'BCom'];
  const batches = ['2024', '2025'];
  const genders = ['Male', 'Female', 'Other'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const fetchFilteredResults = async (currentFilters) => {
    if (!hasActiveFilters && !searchQuery) {
      setSearchResults([]);
      return;
    }
    setFilterLoading(true);
    setError(null);
    try {
      const results = await apiService.searchStudents(searchQuery, currentFilters);
      setSearchResults(results);
    } catch (err) {
      setError('Error applying filters. Please try again.');
      console.error('Filter error:', err);
    } finally {
      setFilterLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query, currentFilters) => {
      if (!query && !hasActiveFilters) {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      setError(null);
      try {
        const results = await apiService.searchStudents(query, currentFilters);
        setSearchResults(results);
      } catch (err) {
        setError('Error searching students. Please try again.');
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 500),
    [hasActiveFilters]
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery, filters);
    } else if (hasActiveFilters) {
      fetchFilteredResults(filters);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, debouncedSearch, filters, hasActiveFilters]);

  const handleCourseChange = async (event) => {
    const course = event.target.value;
    setSelectedCourse(course);
    setSelectedBatch('');
    setDropdownLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setDropdownLoading(false);
    }
  };

  const handleBatchChange = async (event) => {
    const batch = event.target.value;
    setSelectedBatch(batch);
    setDropdownLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setDropdownLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (!hasActiveFilters) {
      setSearchResults([]);
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value
    };
    setFilters(newFilters);
    setActiveFilters(Object.values(newFilters).some(v => v !== ''));
    fetchFilteredResults(newFilters);
  };

  const handleApplyFilters = () => {
    fetchFilteredResults(filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({ gender: '', bloodGroup: '', course: '', batch: '' });
    setActiveFilters(false);
    if (!searchQuery) {
      setSearchResults([]);
    } else {
      debouncedSearch(searchQuery, {});
    }
  };

  const handleViewDetails = () => {
    navigate('/filtered-students', { 
      state: { 
        filters: {
          course: selectedCourse,
          batch: selectedBatch
        },
        filterType: 'batch',
        message: `Students in ${selectedCourse} - Batch ${selectedBatch}`
      } 
    });
  };

  const handleViewFilteredResults = () => {
    navigate('/filtered-students', { 
      state: { 
        filters,
        filterType: 'custom',
        message: `List of students filtered by ${Object.entries(filters)
          .filter(([_, value]) => value)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')}`
      } 
    });
  };

  return (
    <div className={styles.mainbody}>
      <Navbar />
      <div className={styles.dashboardContainer}>
        <div className={styles.header}>
          <h1>Batch Mentor Dashboard</h1>
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by name, roll number, or enrollment number..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button className={styles.clearButton} onClick={handleClearSearch}>
                <FaTimes />
              </button>
            )}
            <button 
              className={`${styles.filterButton} ${showFilters ? styles.active : ''} ${activeFilters ? styles.hasFilters : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              {activeFilters && <span className={styles.filterCount}></span>}
            </button>
          </div>

          {showFilters && (
            <div className={styles.filterContainer}>
              <div className={styles.filterGroup}>
                <label>Gender</label>
                <select value={filters.gender} onChange={(e) => handleFilterChange('gender', e.target.value)}>
                  <option value="">All</option>
                  {genders.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Blood Group</label>
                <select value={filters.bloodGroup} onChange={(e) => handleFilterChange('bloodGroup', e.target.value)}>
                  <option value="">All</option>
                  {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Course</label>
                <select value={filters.course} onChange={(e) => handleFilterChange('course', e.target.value)}>
                  <option value="">All</option>
                  {courses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Batch</label>
                <select value={filters.batch} onChange={(e) => handleFilterChange('batch', e.target.value)}>
                  <option value="">All</option>
                  {batches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className={styles.filterActions}>
                <button className={styles.applyFiltersButton} onClick={handleApplyFilters}>Apply Filters</button>
                <button className={styles.clearFiltersButton} onClick={handleClearFilters}>Clear All Filters</button>
              </div>
            </div>
          )}
        </div>

        {/* Course/Batch Selection */}
        <div className={styles.dropdownContainer}>
          <div className={styles.selectGroup}>
            <label className={styles.selectLabel}>Course</label>
            <select className={styles.select} value={selectedCourse} onChange={handleCourseChange}>
              <option value="">Select Course</option>
              {courses.map(course => <option key={course} value={course}>{course}</option>)}
            </select>
          </div>
          <div className={styles.selectGroup}>
            <label className={styles.selectLabel}>Batch</label>
            <select className={styles.select} value={selectedBatch} onChange={handleBatchChange} disabled={!selectedCourse}>
              <option value="">Select Batch</option>
              {batches.map(batch => <option key={batch} value={batch}>{batch}</option>)}
            </select>
          </div>
        </div>

        {/* Results Display */}
        <div className={styles.contentArea}>
          {dropdownLoading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (searchLoading || filterLoading) ? (
            <div className={styles.loading}>{searchLoading ? 'Searching...' : 'Applying filters...'}</div>
          ) : hasActiveFilters ? (
            <div className={styles.viewDetailsContainer}>
              <h2 className={styles.selectionInfo}>
                View Students with Applied Filters:
                {Object.entries(filters)
                  .filter(([_, value]) => value)
                  .map(([key, value]) => (
                    <div key={key}>{key}: {value}</div>
                  ))}
              </h2>
              <button className={styles.viewDetailsButton} onClick={handleViewFilteredResults}>
                View Filtered Students List
              </button>
            </div>
          ) : (!selectedCourse || !selectedBatch) ? (
            <div className={styles.noSelection}>
              Please select both a course and batch to view student information
            </div>
          ) : (
            <div className={styles.viewDetailsContainer}>
              <h2 className={styles.selectionInfo}>
                Selected: {selectedCourse} - {selectedBatch}
              </h2>
              <button className={styles.viewDetailsButton} onClick={handleViewDetails}>
                View Student Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchMentorDashboard;

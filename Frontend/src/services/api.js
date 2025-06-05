import axios from 'axios';

// Base URL for the Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
const apiService = {
  // Fetch students by course
  getStudentsByCourse: async (course) => {
    try {
      const response = await apiClient.get(`/students`, {
        params: { course },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Fetch students by course and batch
  getStudentsByCourseAndBatch: async (course, batch) => {
    try {
      const response = await apiClient.get(`/students`, {
        params: { course, batch },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search students with filters
  searchStudents: async (searchQuery, filters) => {
    try {
      const response = await apiClient.get(`/students/search`, {
        params: {
          query: searchQuery,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all available courses
  getCourses: async () => {
    try {
      const response = await apiClient.get('/courses');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all available batches
  getBatches: async () => {
    try {
      const response = await apiClient.get('/batches');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService; 
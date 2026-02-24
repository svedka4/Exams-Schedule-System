// Implemented getters as the first step of implementation.
// Included error handling in case api call fails. 

import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});


export const getExams = async () => {
  try {
    const response = await api.get("/api/exams");
    // console.log("Exams fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching exams:", error);
    throw error;
  }
};

export const getExamById = async (id) => {
  try {
    const response = await api.get(`/api/exams/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exam: ${id}:`, error);
    throw error;
  }
};

export const getCandidates = async () => {
  try {
    const response = await api.get("/api/candidates");
    return response.data;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
};

export const getCandidateById = async (id) => {
  try {
    const response = await api.get(`/api/candidates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching candidate: ${id}:`, error);
    throw error;
  }
};

export const getLocations = async () => {
  try {
    const response = await api.get("/api/locations");
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

export const getLocationById = async (id) => {
  try {
    const response = await api.get(`/api/locations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching location-${id}:`, error);
    throw error;
  }
};

export const updateExamStatus = async (examId, newStatus) => {
  try {
    const response = await api.patch(`/api/exams/${examId}/status`, { status: newStatus });
    return response.data;
  } catch (error) {
    console.error(`Error updating exam-${examId} status`, error);
    throw error;
  }
};
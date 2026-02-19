# Exam Scheduler - Dummy React Frontend

## Project Summary

use the npm install command to install the necessary packages
then use the npm start command to view a local development version of the project


## Implementation Steps

### 1. Refactor and Setup
- DONE **Refactor `ExamCard` Component**: Update the `ExamCard` component to display the correct schedule details (e.g., title, candidate names, date, time, location, and status). Use the API data structure for consistency.
- DONE **Update API Utility**: Extend the api.js utility in `src/utils` to include methods for all API endpoints:
  - `getExams()`
  - `getExamById(id)`
  - `getCandidates()`
  - `getCandidateById(id)`
  - `getLocations()`
  - `getLocationById(id)`
  - `updateExamStatus(id, status)`

### 2. Fetch and Display Exam Schedules
- DONE **Fetch Exam Data**: Use the `getExams()` method in the `ExamList` component to fetch and display the list of exam schedules.
- DONE **Update ExamCard**: Pass the fetched data to the `ExamCard` component to display the relevant details for each exam.

### 3. Implement Filtering and Sorting
- **Filter Modal**: Update the `FilterModal` component to allow filtering by date, candidate, and location. Use the `setFiltersObject` state to apply filters to the exam list.
- **Sorting**: Add sorting functionality to the `ExamList` component to sort exams by date, candidate, or location.

### 4. Update Exam Status
- **Add Status Update Button**: Add a button to the `ExamCard` component to allow users to update the status of an exam.
- **Handle Status Update**: Use the `updateExamStatus(id, status)` method from the API utility to update the status of an exam. Ensure the UI reflects the updated status.

### 5. Optional Features
- **Integrate Google Maps**: Use the `ExamMap` component to display exam locations on a map. Fetch location data using the `getLocations()` method and display markers for each location.
- **Enhance UI/UX**: Add animations, responsive design, and improved styling to enhance the user experience.
- **Error Handling**: Implement error handling for API requests and display appropriate messages to the user.

## Notes
- Use environment variables for API base URL and Google Maps API key. Update the `.env` file with the following:
  ```
  REACT_APP_BASE_URL=https://mdvictvs.victvs.co.uk/tech-test/
  REACT_APP_GOOGLE_MAP_API=your_google_maps_api_key
  ```
- Prioritize core functionality before implementing optional features.
- Test the application thoroughly to ensure all features work as expected.
```

```
- npm start
- npm run build - when deploying production
```
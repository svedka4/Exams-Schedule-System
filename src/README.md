# Exam Scheduler - Dummy React Frontend

## Project Summary

A React frontend for the VICTVS Exam Scheduling System. The application fetches and displays exam sessions from a RESTful API, allowing users to filter, sort, and update the status of exam schedules.

```bash
npm install   # Install dependencies
npm start     # Run development server
npm run build # Build for production
```

---

## Implementation Documentation

### 1. Refactor and Setup

#### `ExamCard.jsx`
Refactored to display all relevant session details from the API response:
- **Title** via `session.title`
- **Location** via `session.location.country`
- **Date and Time** by splitting `session.datetime` on the space character
- **Candidates** by mapping `session.candidates` array and joining names with `, `
- **Status** with colour-coded display using dynamic CSS class (`Status pending`, `Status started`, `Status finished`)

**Implementation decisions:**
- Used optional chaining (`?.`) throughout to prevent crashes from missing data
- `formatStatus()` capitalises the first letter for display, since the API returns lowercase strings
- `getNextStatus()` uses `.toLowerCase()` for comparisons to handle any casing inconsistencies from the API
- `statusClass` uses `examStatus.toLowerCase()` to match CSS class names

#### `api.js`
Extended the API utility to cover all seven available endpoints using `axios`:

| Method | Endpoint | Type |
|---|---|---|
| `getExams()` | `/api/exams` | GET |
| `getExamById(id)` | `/api/exams/{id}` | GET |
| `getCandidates()` | `/api/candidates` | GET |
| `getCandidateById(id)` | `/api/candidates/{id}` | GET |
| `getLocations()` | `/api/locations` | GET |
| `getLocationById(id)` | `/api/locations/{id}` | GET |
| `updateExamStatus(id, status)` | `/api/exams/{id}/status` | PATCH |

All methods include try/catch error handling and use an `axios` instance configured with `REACT_APP_BASE_URL` from the `.env` file.

---

### 2. Fetch and Display Exam Schedules

#### `ExamList.jsx`
- On mount, `getExams()` is called inside a `useEffect` with an empty dependency array `[]`
- The response is stored in two state variables:
  - `examSessions` — the working list (filtered/sorted)
  - `originalExamSessions` — the unmodified source of truth, used to reset filters

**Why two arrays?** Filtering and sorting mutate the displayed list. Without preserving the original, resetting filters would have nothing to restore from.

---

### 3. Filtering and Sorting

#### `FilterModal.jsx`
Three filter inputs: date (type="date"), candidate name (text), and location (text).

- Local state (`filterDate`, `filterName`, `filterLocation`) holds input values before submission
- `handleAddFilters()` validates and builds a `params` object, then calls `props.setFiltersObject(params)` to apply filters to the parent
- Date input is validated against a regex (`YYYY-MM-DD`) before applying
- `react-hot-toast` is used to notify the user which filters were applied
- The modal conditionally renders via `if (props.hide) return null`

#### Filtering logic (`ExamList.jsx` — second `useEffect`)
The second `useEffect` runs whenever `filtersObject`, `originalExamSessions`, or `sortCriteria` changes:
1. Spreads `originalExamSessions` into a new array to avoid mutating the original
2. Applies each active filter sequentially (date → name → location)
3. Sorts the filtered result
4. Calls `setExamSessions()` with the result

#### Sorting logic
Three sort criteria matching the dropdown option values:
- `"date"` — converts `datetime` strings to `Date` objects and compares numerically
- `"name"` — compares first candidate name alphabetically using `localeCompare`
- `"location"` — compares `location.country` alphabetically using `localeCompare`

---

### 4. Status Updates

#### `ExamCard.jsx`
- `getNextStatus()` maps `pending → started → started → finished`
- `finished` status returns `"finished"` as there is no next stage
- Clicking "Update Status" calls `onStatusUpdate(session.id, getNextStatus(session.status))`
- Would be good to have some sort of reset function in case of mistakenly updating status (UX improvement)

#### `handleStatusUpdate()` in `ExamList.jsx`
- Normalises the new status to lowercase before sending to the API
- On success, updates `examSessions` state in place using `.map()` so the UI reflects the change immediately without a full refetch

---

## Some Bug Fixes During Development

### 1. `sortedSessions` overriding `useEffect` sort
**Problem:** A `sortedSessions` variable was sorting `examSessions` by date only and being rendered in the JSX instead of `examSessions`. This meant the `useEffect` sorting was never visible.

**Fix:** Removed `sortedSessions` entirely. The `useEffect` already handles all sorting and writes to `examSessions`, which is rendered directly.

---

### 2. Reset Filters causing `toLowerCase` crash
**Problem:** Clicking "Reset Filters" set `filtersObject` to `{ date: "", name: "", location: "" }`, which triggered the `useEffect`. The filter logic then called `.toLowerCase()` on empty or undefined values.

**Fix:** Added truthy checks (`if (filtersObject.date)`) before applying each filter, so empty strings are skipped safely.

---

### 3. `getNextStatus` never matching
**Problem:** `getNextStatus` was comparing against capitalised strings (`"Pending"`) while the API returns lowercase (`"pending"`), so it always fell through to the default.

**Fix:** Added `.toLowerCase()` to all comparisons inside `getNextStatus`.

---

### 4. Status colour classes not applying
**Problem:** `statusClass` was generating class names that didn't match the CSS (casing mismatch or wrong format).

**Fix:** Used `examStatus.toLowerCase()` to ensure classes like `Status pending`, `Status started`, `Status finished` match the CSS selectors exactly.

---

### 5. `handleStatusUpdate` not normalising status
**Problem:** The status passed to `updateExamStatus` could be inconsistently cased, potentially causing API rejection.

**Fix:** Added `newStatus.toLowerCase()` before the API call and used the normalised value to update state.

---

## About the Unused Public Endpoints

The API exposes several endpoints that were not used in the core implementation:

| Endpoint | How it could have been used |
|---|---|
| `GET /api/candidates` | Populate a **dropdown** in the Filter Modal with real candidate names instead of a free-text input, improving filter accuracy |
| `GET /api/candidates/{id}` | Show a **candidate detail view** or tooltip with more info when clicking a candidate name |
| `GET /api/locations` | Populate a **location dropdown** in the filter, or feed coordinates to a Google Maps component (the optional `ExamMap` feature) |
| `GET /api/locations/{id}` | Fetch precise `latitude` and `longitude` for a single location to drop a map pin |
| `GET /api/exams/{id}` | Power a **detail/modal view** for a single exam when clicking an `ExamCard`, rather than showing all data inline |

The locations endpoints in particular were the intended data source for the optional **Google Maps integration** — `getLocations()` would return all coordinates, and `ExamMap` would render markers for each one using the Google Maps API key from `.env`.

---

## Environment Variables

```
REACT_APP_BASE_URL=https://mdvictvs.victvs.co.uk/tech-test/
```
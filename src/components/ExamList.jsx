import { useEffect, useState } from "react";
import ExamCard from "./ExamCard";
import FilterModal from "./FilterModal";
import { getExams, updateExamStatus } from '../utils/api';

export default function ExamList() {
  const [examSessions, setExamSessions] = useState([]);
  const [originalExamSessions, setOriginalExamSessions] = useState([]);
  const [hideFilterModal, setHideFilterModal] = useState(true);
  const [filtersObject, setFiltersObject] = useState({
    date: "",
    name: "",
    location: "",
  });

  const [sortCriteria, setSortCriteria] = useState("date");

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const normalisedStatus = newStatus.toLowerCase();
      
      await updateExamStatus(id, normalisedStatus);

      setExamSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === id ? { ...session, status: newStatus } : session
        )
      );
  
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // TODO: Update the component with the exam session data
  useEffect(() => {
    getExams().then((examSessionsData) => {
      setExamSessions(examSessionsData);
      setOriginalExamSessions(examSessionsData);
    });
  }, []);

  useEffect(() => {
    console.log("useEffect triggered with sortCriteria:", sortCriteria); // Debugging
    let filteredSessions = [...originalExamSessions];

    if (filtersObject.date) {
      filteredSessions = filteredSessions.filter((session) =>
        session.datetime.startsWith(filtersObject.date)
      );
    }

    if (filtersObject.name) {
      filteredSessions = filteredSessions.filter((session) =>
        session.candidates.some((candidate) =>
          candidate.name?.toLowerCase().includes(filtersObject.name.toLowerCase())
        )
      );
    }
  
    if (filtersObject.location) {
      filteredSessions = filteredSessions.filter((session) =>
        session.location.country
          ?.toLowerCase()
          .includes(filtersObject.location.toLowerCase())
      );
    }

    filteredSessions.sort((a, b) => {
      if (sortCriteria === "date") {
        const dateA = new Date(a.datetime);
        const dateB = new Date(b.datetime);
        return dateA - dateB;
      } else if (sortCriteria === "name") {
        const candidateA = a.candidates?.[0]?.name?.toLowerCase() || "";
        const candidateB = b.candidates?.[0]?.name?.toLowerCase() || "";
        return candidateA.localeCompare(candidateB);
      } else if (sortCriteria === "location") {
        const locationA = a.location.country.toLowerCase() || "";
        const locationB = b.location.country.toLowerCase() || "";
        console.log("Comparing locations:", locationA, locationB); // Debugging
        return locationA.localeCompare(locationB);
      }
      return 0;
    });

    setExamSessions(filteredSessions);
    console.log("Updated examSessions:", filteredSessions); // Debugging

  }, [filtersObject, originalExamSessions, sortCriteria]);

  return (
    <main className="ExamList">
      <div className="SessionsFilter">
        <h2>Exam Sessions</h2>
        

        <div className="FilterContainer">
          <button
            className="FilterButton"
            onClick={() => setHideFilterModal(false)}
          >
            👁 Show Filters
          </button>
          <button
            className="FilterButton"
            onClick={() => setFiltersObject({ date: "", candidate: "", location: "" })}
          >
            ↻ Reset Filters
          </button>
        </div>
      </div>

      <div className="FilterSortContainer">
      <FilterModal
            hide={hideFilterModal}
            setHide={setHideFilterModal}
            setFiltersObject={setFiltersObject}
          />
        
        <div className="SortContainer">
            <label htmlFor="sort">Sort By:</label>
            <select
              id="sort"
              value={sortCriteria}
              onChange={(e) => {
                console.log("Selected sort criteria:", e.target.value); // Debugging
                setSortCriteria(e.target.value)
              }}
              className="SortDropdown"
            >
              <option value="date">Date</option>
              <option value="candidate">Candidate Name</option>
              <option value="location">Location</option>
            </select>
          </div>
          
        </div>
      <div id="SessionList">
        {examSessions.length ? (
          examSessions.map((session) => (
            <ExamCard session={session} key={session.id} onStatusUpdate={handleStatusUpdate} />
          ))
        ) : (
          <p>No sessions to display...</p>
        )}
      </div>
    </main>
  );
}

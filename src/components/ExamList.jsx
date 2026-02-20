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

  const sortedSessions = [...examSessions].sort((a, b) => {
    const dateA = new Date(a.datetime);
    const dateB = new Date(b.datetime);
    return dateA - dateB;
  });

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
    setExamSessions(originalExamSessions);
    if (filtersObject.date !== "") {
      setExamSessions((currentSessions) => {
        return currentSessions.filter((session) =>
          session.datetime.startsWith(filtersObject.date) ? session : null
        );
      });
    }

    if (filtersObject.name !== "") {
      setExamSessions((currentSessions) => {
        return currentSessions.filter((session) =>
          session.candidates.some((candidate) =>
            candidate.name
              .toLowerCase()
              .includes(filtersObject.name.toLowerCase())
          )
        );
      });
    }

    if (filtersObject.location !== "") {
      setExamSessions((currentSessions) => {
        return currentSessions.filter((session) =>
          session.location.country.toLowerCase().includes(filtersObject.location.toLowerCase()) ? session : null
        );
      });
    }
  }, [filtersObject, originalExamSessions]);

  return (
    <main className="ExamList">
      <div className="SessionsFilter">
        <h2>Exam Sessions</h2>
        <FilterModal
          hide={hideFilterModal}
          setHide={setHideFilterModal}
          setFiltersObject={setFiltersObject}
        />
        <div className="FilterContainer">
          <button
            className="FilterButton"
            onClick={() => setHideFilterModal(false)}
          >
            👁 Show Filters
          </button>
          <button
            className="FilterButton"
            onClick={() => setExamSessions(originalExamSessions)}
          >
            ↻ Reset Filters
          </button>
        </div>
      </div>
      <div id="SessionList">
        {sortedSessions.length ? (
          sortedSessions.map((session) => (
            <ExamCard session={session} key={session.id} onStatusUpdate={handleStatusUpdate} />
          ))
        ) : (
          <p>No sessions to display...</p>
        )}
      </div>
    </main>
  );
}

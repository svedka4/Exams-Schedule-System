import { getExams } from "../utils/api";

export default function ExamCard({session}) {
  
  const datetime = session.datetime ? session.datetime.split(" ") : ["N/A", "N/A"];
  const examTitle = session.title || "N/A";
  const examCandidates = session.candidates.name || "Could not find candidates";
  const location = session.location.country || "N/A";
  const examStatus = session.status || "N/A";

  const statusClass = `Status ${examStatus}`;

  //TODO: update display of schedule details
  return (
    <section className="ExamCard">
      <div className="SessionDetails">
       <p>{examTitle}</p>
       <p>{examCandidates}</p>

      </div>
      <div className="LocationDetails">
        <p>{datetime[0]}</p>
        <p>{datetime[1].slice(0, -1)}</p>
        <p className="LocationName">{location}</p>
      </div>
      <div className="StatusDetails">
        <p className={statusClass}>{examStatus}</p>
      </div>
    </section>
  );
}
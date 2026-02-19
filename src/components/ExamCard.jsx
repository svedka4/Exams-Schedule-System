
export default function ExamCard({session, onStatusUpdate}) {
  
  const datetime = session.datetime ? session.datetime.split(" ") : ["N/A", "N/A"];
  const examTitle = session.title || "N/A";
  const examCandidates = session.candidates?.map(c => c.name).join(", ") 
  || "Could not find candidates";
  const location = session.location.country || "N/A";
  const examStatus = session.status || "N/A";

  const statusClass = `Status ${examStatus}`;

  const getNextStatus = (currentStatus) => {
    if (currentStatus === "Pending") return "Started";
    if (currentStatus === "Started") return "Finished";
    return "Finished";
  };

  //TODO: update display of schedule details
  return (
    <section className="ExamCard">
      <div className="SessionDetails">
       <h3>{examTitle}</h3>
       <div className="LocationDetails">
          <p className="LocationName">{location}</p>
          <p>{datetime[0]}</p>
          <p>{datetime[1].slice(0, -1)}</p>
       </div>
      </div>
      <div className="ExamCandidates">
        <p>Expected candidates:</p>
        <p>{examCandidates}</p>
      </div>

      <div className="StatusDetails">
        <p className={statusClass}>{examStatus}</p>
        <button className="UpdateStatusButton" onClick={() => onStatusUpdate(session.id, getNextStatus(session.status))}>
          Update Status
        </button>
      </div>
    </section>
  );
}
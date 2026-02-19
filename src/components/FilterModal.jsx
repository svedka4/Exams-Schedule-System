import { useState } from 'react';
import { toast } from "react-hot-toast";

export default function FilterModal(props) {
  const [ filterDate, setFilterDate ] = useState("");
  const [ filterName, setFilterName ] = useState("");
  const [ filterLocation, setFilterLocation ] = useState("");

  const toastStyle = {
    style: {
      borderRadius: "12px",
      padding: "12px",
      color: "#02020a",
      backgroundColor: "#FFFFFF",
    },
  };

  if (props.hide) {
    return null;
  }

  const handleAddFilters = (filterDate, filterName, filterLocation) => {
    const params = { date: "", name: "", location: "" };
    const dateRegEx = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    let toastMessage = '';

    if (dateRegEx.test(filterDate) && filterDate !== '') {
      params.date = filterDate;
      toastMessage += "Added Date Filter: " + params.date + '\n';
      setFilterDate('');
    } 

    if (filterName !== "") {
      params.name = filterName;
      toastMessage += "Added Name Filter: " + params.name + "\n";
      setFilterName("");
    } 
    if (filterLocation !== "") {
      params.location = filterLocation;
      toastMessage += "Added Location Filter: " + params.location + "\n";
      setFilterLocation ("");
    }

    if (toastMessage) {
      toast(toastMessage, toastStyle);
    }

    props.setFiltersObject(params);
  };

  const handleClose = () => {
    props.setHide(true);
  }

  return (
    <div className="FilterModal">
      <div className="ModalContent">
        <div className="ModalHeader">
          <h4 className="ModalTitle">
            Filter Exam Sessions
          </h4>
        </div>
        <div className="ModalBody">
          <div className="FilterField">
            <label htmlFor="datetime">Date</label>
            <input
              type="datetime"
              name="datetime"
              id="datetime-field"
              value={filterDate}
              onInput={(event) => setFilterDate(event.target.value)}
            />
          </div>
          <div className="FilterField">
            <label htmlFor="candidate-name">Candidate Name</label>
            <input
              type="text"
              name="candidate-name"
              value={filterName}
              onInput={(event) => setFilterName(event.target.value)}
            />
          </div>
          <div className="FilterField">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name="location"
              value={filterLocation}
              onInput={(event) => setFilterLocation(event.target.value)}
            />
          </div>
          <div className="ButtonField">
            <button
              className="FilterButton"
              id="AddFilterButton"
              onClick={() =>
                handleAddFilters(filterDate, filterName, filterLocation)
              }
            >
              + Add Filters
            </button>
          </div>
        </div>
        <div className="ModalFooter">
          <button
            className="Button"
            onClick={() => handleClose() }
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
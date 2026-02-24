export default function Home() {
  return (
    <main className="Home">

      <h2>Exam Scheduler - Dummy React Frontend</h2>

      <section className="IntroductionText">
        <p>
          A React frontend for the VICTVS Exam Scheduling System. The
          application fetches and displays exam sessions from a RESTful API,
          allowing users to filter, sort, and update the status of exam
          schedules.
        </p>
      </section>

      <section>
        <h3>Implementation Documentation</h3>

        <h4>1. Refactor and Setup</h4>
        <p><strong>ExamCard.jsx</strong> — Refactored to display all relevant session details:</p>
        <ul>
          <li>Title via <code>session.title</code></li>
          <li>Location via <code>session.location.country</code></li>
          <li>Date and Time by splitting <code>session.datetime</code> on the space character</li>
          <li>Candidates by mapping <code>session.candidates</code> array and joining names with <code>, </code></li>
          <li>Status with colour-coded display using dynamic CSS class (<code>Status pending</code>, <code>Status started</code>, <code>Status finished</code>)</li>
        </ul>
        <p><strong>Implementation decisions:</strong></p>
        <ul>
          <li>Used optional chaining (<code>?.</code>) throughout to prevent crashes from missing data</li>
          <li><code>formatStatus()</code> capitalises the first letter for display, since the API returns lowercase strings</li>
          <li><code>getNextStatus()</code> uses <code>.toLowerCase()</code> for comparisons to handle any casing inconsistencies from the API</li>
          <li><code>statusClass</code> uses <code>examStatus.toLowerCase()</code> to match CSS class names</li>
        </ul>

        <p><strong>api.js</strong> — Extended to cover all seven available endpoints using <code>axios</code>:</p>
        <table>
          <thead>
            <tr><th>Method</th><th>Endpoint</th><th>Type</th></tr>
          </thead>
          <tbody>
            <tr><td><code>getExams()</code></td><td><code>/api/exams</code></td><td>GET</td></tr>
            <tr><td><code>getExamById(id)</code></td><td><code>/api/exams/&#123;id&#125;</code></td><td>GET</td></tr>
            <tr><td><code>getCandidates()</code></td><td><code>/api/candidates</code></td><td>GET</td></tr>
            <tr><td><code>getCandidateById(id)</code></td><td><code>/api/candidates/&#123;id&#125;</code></td><td>GET</td></tr>
            <tr><td><code>getLocations()</code></td><td><code>/api/locations</code></td><td>GET</td></tr>
            <tr><td><code>getLocationById(id)</code></td><td><code>/api/locations/&#123;id&#125;</code></td><td>GET</td></tr>
            <tr><td><code>updateExamStatus(id, status)</code></td><td><code>/api/exams/&#123;id&#125;/status</code></td><td>PATCH</td></tr>
          </tbody>
        </table>
        <p>All methods include try/catch error handling and use an <code>axios</code> instance configured with <code>REACT_APP_BASE_URL</code> from the <code>.env</code> file.</p>

        <h4>2. Fetch and Display Exam Schedules</h4>
        <p><strong>ExamList.jsx</strong></p>
        <ul>
          <li>On mount, <code>getExams()</code> is called inside a <code>useEffect</code> with an empty dependency array <code>[]</code></li>
          <li><code>examSessions</code> — the working list (filtered/sorted)</li>
          <li><code>originalExamSessions</code> — the unmodified source of truth, used to reset filters</li>
        </ul>
        <p><strong>Why two arrays?</strong> Filtering and sorting mutate the displayed list. Without preserving the original, resetting filters would have nothing to restore from.</p>

        <h4>3. Filtering and Sorting</h4>
        <p><strong>FilterModal.jsx</strong> — Three filter inputs: date, candidate name, and location.</p>
        <ul>
          <li>Local state holds input values before submission</li>
          <li><code>handleAddFilters()</code> validates and builds a params object, then calls <code>props.setFiltersObject()</code></li>
          <li>Date input is validated against a regex (<code>YYYY-MM-DD</code>) before applying</li>
          <li><code>react-hot-toast</code> is used to notify the user which filters were applied</li>
          <li>The modal conditionally renders via <code>if (props.hide) return null</code></li>
        </ul>
        <p><strong>Sorting logic</strong> — Three sort criteria matching the dropdown option values:</p>
        <ul>
          <li><code>"date"</code> — converts datetime strings to Date objects and compares numerically</li>
          <li><code>"name"</code> — compares first candidate name alphabetically using <code>localeCompare</code></li>
          <li><code>"location"</code> — compares <code>location.country</code> alphabetically using <code>localeCompare</code></li>
        </ul>

        <h4>4. Status Updates</h4>
        <ul>
          <li><code>getNextStatus()</code> maps <code>pending → started → finished</code></li>
          <li>Clicking "Update Status" calls <code>onStatusUpdate(session.id, getNextStatus(session.status))</code></li>
          <li>Status is normalised to lowercase before sending to the API</li>
          <li>On success, updates <code>examSessions</code> state in place using <code>.map()</code> so the UI reflects the change immediately without a full refetch</li>
        </ul>
      </section>

      <section>
        <h3>Bug Fixes During Development</h3>
        <ol>
          <li><strong>sortedSessions overriding useEffect sort</strong> — A <code>sortedSessions</code> variable was always sorting by date only and being rendered instead of <code>examSessions</code>. Fixed by removing it entirely.</li>
          <li><strong>Reset Filters causing toLowerCase crash</strong> — Empty strings from reset triggered <code>.toLowerCase()</code> on undefined values. Fixed by adding truthy checks before each filter.</li>
          <li><strong>getNextStatus never matching</strong> — Was comparing against capitalised strings while the API returns lowercase. Fixed by adding <code>.toLowerCase()</code> to all comparisons.</li>
          <li><strong>Status colour classes not applying</strong> — Class names had a casing mismatch with CSS. Fixed using <code>examStatus.toLowerCase()</code>.</li>
          <li><strong>handleStatusUpdate not normalising status</strong> — Status could be inconsistently cased. Fixed by normalising with <code>.toLowerCase()</code> before the API call.</li>
        </ol>
      </section>

      <section>
        <h3>About the Unused Public Endpoints</h3>
        <table>
          <thead>
            <tr><th>Endpoint</th><th>How it could have been used</th></tr>
          </thead>
          <tbody>
            <tr><td><code>GET /api/candidates</code></td><td>Populate a dropdown in the Filter Modal with real candidate names</td></tr>
            <tr><td><code>GET /api/candidates/&#123;id&#125;</code></td><td>Show a candidate detail view or tooltip</td></tr>
            <tr><td><code>GET /api/locations</code></td><td>Populate a location dropdown or feed coordinates to a map</td></tr>
            <tr><td><code>GET /api/locations/&#123;id&#125;</code></td><td>Fetch precise latitude and longitude for a map pin</td></tr>
            <tr><td><code>GET /api/exams/&#123;id&#125;</code></td><td>Power a detail modal view for a single exam</td></tr>
          </tbody>
        </table>
      </section>

    </main>
  );
}
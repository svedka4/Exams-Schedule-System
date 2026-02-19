import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="Header">
      <div className="Logo-container">
        <h1>VICTVS</h1>
        <span>Exam Scheduler</span>
      </div>

      <Navigation />
    </header>
  );
}

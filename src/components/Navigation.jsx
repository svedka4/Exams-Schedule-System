import { Link } from 'react-router-dom';

export default function Navigation() {
   
  return (
    <nav className="Navigation">
      <section className="MainLinks">
        <Link className={"Link"} to="/">
          Home
        </Link>
        <Link className={"Link"} to="/sessions">
          Sessions
        </Link>
        <Link className={"Link"} to="/exam-map">
          Map
        </Link>
      </section>
    </nav>
  );
}
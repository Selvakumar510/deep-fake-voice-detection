import "./Navbar.css";
const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">
        <span className="brand-icon">🔍</span>
        Deepfake Detection
      </a>
      <ul className="navbar-links">
        <li><a href="#">Home</a></li>
        <li>
          <span className="nav-dropdown">
            Deepfake Detection Tools ▾
          </span>
        </li>
        <li><a href="#">About</a></li>
      </ul>
    </nav>
  );
};
export default Navbar;
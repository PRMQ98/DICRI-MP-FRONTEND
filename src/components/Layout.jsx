import Navbar from "./Navbar.jsx";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="container mt-4">{children}</main>
    </div>
  );
};

export default Layout;

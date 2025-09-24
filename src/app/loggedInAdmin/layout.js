import Navigation from "../components/Nav";

export default function LoggedInAdminLayout({ children }) {
  return (
    <>
      <section>
        <Navigation />
        {children}
      </section>
    </>
  );
}

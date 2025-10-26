import { ModeToggle } from "@/components/ModeToggle";
import Navigation from "../components/Nav";

export default function LoggedInAdminLayout({ children }) {
  return (
    <>
      <section>
        {/* <Navigation /> */}
        {children}
        <div className="fixed bottom-4 right-4 z-20 cursor-pointer dark:border-white border-2 border-black rounded-lg">
          <ModeToggle />
        </div>
      </section>
    </>
  );
}

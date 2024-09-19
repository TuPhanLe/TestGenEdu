import Navbar from "@/components/bar/Navbar";
import SideNav from "@/components/bar/SideNav";

export default function LecLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Navbar />
      <SideNav />
      <div className="w-full pt-16">
        <div className="w-full flex justify-center mx-auto overflow-auto relative">
          <div className="w-full md:max-w-8xl">{children}</div>
        </div>
      </div>
    </section>
  );
}

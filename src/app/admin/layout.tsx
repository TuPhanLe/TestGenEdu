import SideNavAdmin from "@/components/bar/SideNavAdmin";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Sidebar cố định */}
      <SideNavAdmin />
      {/* Nội dung chính */}
      <div className="w-full">
        <div className="w-full flex justify-center mx-auto overflow-auto relative">
          <div className="w-full md:max-w-8xl">{children}</div>
        </div>
      </div>
    </section>
  );
}

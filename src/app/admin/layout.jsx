import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";
import { getSessionFromCookies } from "@/lib/adminSession";

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const session = getSessionFromCookies(cookieStore);

  if (!session) {
    redirect("/auth/admin-login");
  }

  return (
    <>

    

       <AdminSidebar />
      <AdminHeader />
      <main className="m-6 flex flex-col gap-6 justify-center">

        {children}
      </main>
    

    {/* <div className="fixed left-0 top-0 z-50 h-full border-r bg-white pt-16">
     
    </div>

      <div className="fixed top-0 z-40 w-full border-b bg-white pt-4 pl-64 pr-6 lg:pl-80 lg:pr-10">
       
      </div> */}

       
    </>
  );
}

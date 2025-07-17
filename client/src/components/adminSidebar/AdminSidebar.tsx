import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
  { label: "Manage Products", href: "/admin/product-manager", icon: <Package className="h-5 w-5 mr-2" /> },
  { label: "Manage Users", href: "/admin/user-manager", icon: <Users className="h-5 w-5 mr-2" /> },
];

export default function AdminSidebar() {
  const router = useRouter();
  return (
    <aside className="w-64 bg-white border-r px-4 py-8 flex flex-col gap-2 min-h-screen">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      {sidebarLinks.map(link => (
        <Button
          key={link.href}
          variant="ghost"
          className="justify-start w-full mb-2"
          onClick={() => router.push(link.href)}
        >
          {link.icon}
          {link.label}
        </Button>
      ))}
    </aside>
  );
}
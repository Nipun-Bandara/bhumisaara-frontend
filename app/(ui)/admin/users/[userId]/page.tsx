import AdminOnly from "@/components/admin/AdminOnly";
import AdminUserDetail from "@/components/admin/AdminUserDetail";

/**
 * The first dynamic route in this app. Next.js 16 makes `params` fully async —
 * there is no synchronous fallback — so this page stays a server component and
 * awaits it, then hands the id to the client screen.
 */
export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <AdminOnly>
      <AdminUserDetail userId={Number(userId)} />
    </AdminOnly>
  );
}

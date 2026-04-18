import { AdminLayout } from "@/layouts/AdminLayout";

export const AdminHomePage = () => {
  return (
    <AdminLayout>
      <section className="section page-placeholder">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Admin</span>
            <h1 className="page-placeholder__title">Welcome admin</h1>
            <p>This is the first post-login page for admin users.</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

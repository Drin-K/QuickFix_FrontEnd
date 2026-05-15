import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/api/api";
import { AdminLayout } from "@/layouts/AdminLayout";
import { routePaths } from "@/routes/routePaths";
import { adminService, type AdminClient } from "@/services/admin.service";
import { clearAuthSession } from "@/utils/auth";

const formatDate = (value?: string) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const matchesSearch = (client: AdminClient, searchTerm: string) => {
  if (!searchTerm) {
    return true;
  }

  const normalizedSearch = searchTerm.toLowerCase();

  return [client.fullName, client.email, client.phone]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(normalizedSearch));
};

export const AdminClientsPage = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [totalClients, setTotalClients] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredClients = useMemo(
    () => clients.filter((client) => matchesSearch(client, submittedSearch)),
    [clients, submittedSearch],
  );

  const loadClients = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await adminService.getClients();
      setClients(response.clients);
      setTotalClients(response.total);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession();
        navigate(routePaths.login);
        return;
      }

      if (error instanceof ApiError && error.status === 403) {
        setErrorMessage("Only admins can view clients.");
        return;
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Clients could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSearch(searchValue.trim());
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setSubmittedSearch("");
  };

  const activeFilterCount = submittedSearch ? 1 : 0;

  return (
    <AdminLayout>
      <section className="section admin-providers">
        <div className="container">
          <div className="admin-providers__header">
            <div>
              <span className="eyebrow">Admin clients</span>
              <h1>Client directory.</h1>
              <p>
                Review client contact information and booking activity from the admin
                workspace.
              </p>
            </div>

            <aside className="admin-providers__summary">
              <span>Total clients</span>
              <strong>{totalClients}</strong>
              <p>{activeFilterCount} active filter(s)</p>
            </aside>
          </div>

          <div className="admin-providers-toolbar">
            <form className="admin-providers-search" onSubmit={handleSearchSubmit}>
              <label htmlFor="admin-client-search">Search</label>
              <div className="admin-providers-search__row">
                <input
                  id="admin-client-search"
                  placeholder="Search by name, email, or phone"
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
                <button className="button" type="submit">
                  Search
                </button>
              </div>
            </form>

            <button
              className="button button--ghost admin-providers-clear"
              type="button"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>

          {errorMessage ? (
            <div className="admin-providers-state admin-providers-state--error">
              <strong>Clients could not be loaded.</strong>
              <p>{errorMessage}</p>
              <button
                className="button"
                type="button"
                onClick={() => {
                  void loadClients();
                }}
              >
                Try again
              </button>
            </div>
          ) : null}

          {!errorMessage ? (
            <div className="admin-providers-panel">
              <div className="admin-providers-panel__header">
                <h2>Clients</h2>
                <span>{loading ? "Loading..." : `${filteredClients.length} shown`}</span>
              </div>

              {loading ? (
                <div className="admin-providers-state">
                  <strong>Loading clients.</strong>
                  <p>Fetching the latest client list from the backend.</p>
                </div>
              ) : null}

              {!loading && filteredClients.length === 0 ? (
                <div className="admin-providers-state">
                  <strong>No clients found.</strong>
                  <p>Try a different search term or clear the search.</p>
                </div>
              ) : null}

              {!loading && filteredClients.length > 0 ? (
                <div className="admin-providers-table-wrap">
                  <table className="admin-providers-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Bookings</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client) => (
                        <tr key={client.id}>
                          <td>
                            <strong>{client.fullName}</strong>
                            <span>#{client.id}</span>
                          </td>
                          <td>{client.email ?? "Not available"}</td>
                          <td>{client.phone ?? "Not available"}</td>
                          <td>
                            <span className="admin-provider-status admin-provider-status--verified">
                              {client.bookingCount}
                            </span>
                          </td>
                          <td>{formatDate(client.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </AdminLayout>
  );
};

import { useState, useEffect } from "react";
import OrganisationCard from "../components/OrganisationCard";
import { Organisation } from "../types/models";

const OrganisationsPage = () => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrganisations = async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/organisations?page=${page}`
      );
      const data: Organisation[] = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setOrganisations((prev) => {
          const newOrgs = data.filter(
            (newOrg) => !prev.some((org) => org._id === newOrg._id)
          );
          return [...prev, ...newOrgs];
        });
      }
    } catch (err) {
      console.error("Error fetching organisations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganisations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (page > 1) fetchOrganisations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="container my-5">
      <h1 className="mb-4">Organisations</h1>

      {organisations.length > 0 ? (
        <div className="row">
          {organisations.map((org) => (
            <div className="col-md-4 mb-4" key={org._id}>
              <OrganisationCard organisation={org} />
            </div>
          ))}
        </div>
      ) : !loading ? (
        <p className="text-center">No organisations found</p>
      ) : null}

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}
    </div>
  );
};

export default OrganisationsPage;

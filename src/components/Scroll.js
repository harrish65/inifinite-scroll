import React, { useCallback, useEffect, useRef, useState } from "react";
import UsersTable from "./UsersTable";
const Scroll = () => {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://dummyjson.com/users?limit=30&skip=0`
      );
      const data = await response.json();

      if (Array.isArray(data.users)) {
        setRecords((prev) => [...prev, ...data.users]);
      } else {
        console.error("Unexpected data structure:", data);
      }
      setLoading(false);
    } catch (error) {
      console.log("fetching error :", error);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: "1.0",
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading) {
        setPage((prev) => prev + 1);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, loading]);
  return (
    <>
      <UsersTable records={records} />

      {loading && <div>Loading...</div>}

      <div ref={ref} />
    </>
  );
};

export default Scroll;

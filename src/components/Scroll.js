import React, { useCallback, useEffect, useRef, useState } from "react";
import UsersTable from "./UsersTable";
const Scroll = () => {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const ref = useRef();

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const limit = 30;
      const skip = (page - 1) * limit;

      const response = await fetch(
        `https://dummyjson.com/users?limit=${limit}&skip=${skip}`
      );
      const data = await response.json();

      if (Array.isArray(data.users)) {
        setRecords((prev) => [...new Set([...prev, ...data.users])]);
     if (data.users.length < limit ||  data.users.length === 208) {
          setHasMore(false);
        }

      } else {
        console.error("Unexpected data structure:", data);
        setHasMore(false)
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
      if (entry.isIntersecting && !loading && hasMore) {
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
  }, [ref, loading,hasMore]);
  return (
    <>
      <UsersTable records={records} />

      {loading && <div>Loading...</div>}

      <div ref={ref} />
    </>
  );
};

export default Scroll;

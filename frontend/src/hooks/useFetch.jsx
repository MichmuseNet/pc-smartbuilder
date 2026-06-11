import { useEffect, useState } from "react";
//Hook reutilizable para hacer peticiones GET
const useFetch = (url) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) return;
        const getData = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(url);
                if (!res.ok) throw new Error(res.status);
                const response = await res.json();
                setData(response);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [url]);

    return { loading, data, error };
};

export default useFetch;
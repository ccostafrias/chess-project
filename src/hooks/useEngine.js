import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function useCategory(category) {
    const navigate = useNavigate()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await import(`../utils/data/${category}.json`)
                setData(data.default)
                setLoading(false)

            } catch (error) {
                navigate('/')
            }
        }
        
        fetchData()

        return () => {
            setData(null)
            setLoading(true)
        }
    }, [category])

    return { data, loading }
}
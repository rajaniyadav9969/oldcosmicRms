import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const CheckRoutes = ({children}) => {
    const checkroutes = useSelector(state => state)
    return (
        <>
            {(checkroutes == undefined) ? <Navigate to='/' /> : children}
        </>
    )
}

export default CheckRoutes
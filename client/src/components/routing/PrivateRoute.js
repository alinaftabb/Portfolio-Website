import React from 'react'
import {Route, Navigate} from 'react-router-dom'
import {useSelector} from 'react-redux';


export default function PrivateRoute({element: Component, ...rest}) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const loading = useSelector((state) => state.auth.loading);
    return (
        <Route
            {...rest}
            render={props => {
                return !isAuthenticated && !loading ? <Navigate to={'login'}/> : <Component {...props}/>
            }}>

        </Route>
    )
}

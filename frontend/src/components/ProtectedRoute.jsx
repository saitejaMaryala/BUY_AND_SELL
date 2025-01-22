import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ auth, children }) {
    

    if (auth === undefined) {
        // Display a loading indicator while auth is being determined
        return <div>Loading...</div>;
    }
    console.log("auth in ProtectedRoute:", auth);

    return auth ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;

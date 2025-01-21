import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ auth, children }) {
    console.log("auth in ProtectedRoute:", auth);

    if (auth === undefined) {
        // Display a loading indicator while auth is being determined
        return <div>Loading...</div>;
    }

    return auth ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;

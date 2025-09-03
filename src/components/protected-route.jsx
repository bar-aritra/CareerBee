import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { pathname } = useLocation();

  // If user is not signed in → redirect to sign in
  if (isLoaded && !isSignedIn) {
    return <Navigate to="/?sign-in=true" />;
  }

  // If user is signed in but has no role → force onboarding
  if (isLoaded && user && !user.unsafeMetadata?.role && pathname !== "/onboarding") {
    return <Navigate to="/onboarding" />;
  }

  // Otherwise → allow access
  return children;
};

export default ProtectedRoute;

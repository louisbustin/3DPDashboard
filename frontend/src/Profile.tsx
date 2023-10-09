import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  console.log(user, isAuthenticated, isLoading, error);
  return (
    <div>
      User profile information
      {isAuthenticated && user && (
        <>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </>
      )}
    </div>
  );
};

export default Profile;

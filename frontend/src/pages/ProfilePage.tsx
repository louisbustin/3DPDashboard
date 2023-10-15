import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingDialog from "../components/LoadingDialog";

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <LoadingDialog open={true}></LoadingDialog>;
  }

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

export default ProfilePage;

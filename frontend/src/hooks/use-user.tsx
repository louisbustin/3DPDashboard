import {useEffect, useState} from "react";
import {useAuth0, User} from "@auth0/auth0-react";
import useFetch from "./use-fetch";

const apiUrl = `${import.meta.env.VITE_BASE_URL}user`;
export type UserProfile = { isPublic?: boolean } & User;

export const useUser = () => {
  const {user, isAuthenticated, isLoading} = useAuth0();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const {data: dbUser} = useFetch(apiUrl);

  useEffect(() => {
    if (isAuthenticated && user && dbUser) {
      setUserProfile({...user, ...dbUser});
    }
  }, [isAuthenticated, user, dbUser]);

  return {isAuthenticated, isLoading, userProfile};
}

export default useUser;
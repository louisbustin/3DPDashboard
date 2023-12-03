import { useAuth0 } from "@auth0/auth0-react";
import LoadingDialog from "../components/LoadingDialog";
import HomePageNoAuth from "../components/HomePageNoAuth";
import HomePageDashboard from "../components/dashboards/HomePageDashboard";

const HomePage = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  return (
    <>
      <LoadingDialog open={isLoading} />
      {!isLoading && isAuthenticated && <HomePageDashboard />}
      {!isLoading && !isAuthenticated && <HomePageNoAuth />}
    </>
  );
};

export default HomePage;

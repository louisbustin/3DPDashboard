import React, {useState} from "react";
import LoadingDialog from "../components/LoadingDialog";
import useUser, {UserProfile} from "../hooks/use-user";
import {Card, CardActions, CardContent, Stack} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import SaveButton from "../components/buttons/SaveButton";
import MessageBanner from "../components/MessageBanner";
import useApiToken from "../hooks/use-api-token";

const apiUrl = `${process.env.REACT_APP_API_BASE_URL}user`;

const ProfilePage = () => {
  const {userProfile, isAuthenticated, isLoading} = useUser();
  const [userProf, setUserProf] = useState<UserProfile>();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = useApiToken();

  const saveProfile = async () => {
    if (userProf) {
      // save the profile
      const response = await fetch(apiUrl, {
        method: "POST", body: JSON.stringify(userProf),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setSuccessMessage("Profile saved successfully");
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setErrorMessage("Failed to save profile");
      }
    }
  }

  if (isAuthenticated && userProfile && !userProf) {
    setUserProf({...userProfile});
  }
  if (isLoading) {
    return <LoadingDialog open={true}></LoadingDialog>;
  }
  return (
    <div>
      {isAuthenticated && userProf && (
        <>
          <MessageBanner
            successMessage={successMessage}
            errorMessage={errorMessage}
            onClose={() => {
              setSuccessMessage("");
              setErrorMessage("");
            }}
          />
          <Stack spacing={2} direction="row" marginTop={2}>
            <Card sx={{
              minWidth: 200,
              textAlign: "center",
            }}>
              <CardContent>
                <Avatar
                  src={userProf.picture}
                  alt={userProf.name}
                  sx={{
                    width: 80,
                    height: 80,
                    margin: "auto",
                  }}/>
                <h2>{userProf.name}</h2>
                <p>{userProf.email}</p>
              </CardContent>
            </Card>
            <Card sx={{width: "100%"}}>
              <CardContent>
                <Typography variant="h6">Settings</Typography>
                <Typography variant="body1">
                  <Switch
                    checked={userProf?.isPublic || false}
                    onChange={(_event, checked
                    ) => {
                      setUserProf((prev) => {
                        return {...prev, isPublic: checked}
                      });
                    }}
                  />
                  Allow profile to be public
                </Typography>
              </CardContent>
              <CardActions>
                <SaveButton onClick={saveProfile}></SaveButton>
              </CardActions>
            </Card>
          </Stack>
        </>
      )}
    </div>
  );
};

export default ProfilePage;

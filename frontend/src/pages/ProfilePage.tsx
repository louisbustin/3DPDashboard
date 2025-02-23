import React, {useContext, useState} from "react";
import {LoadingDialog, MessageBannerContext} from "@eforge/eforge-common";
import useUser, {UserProfile} from "../hooks/use-user";
import {Card, CardActions, CardContent, Stack} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import SaveButton from "../components/buttons/SaveButton";
import useApiToken from "../hooks/use-api-token";

const apiUrl = `${import.meta.env.VITE_BASE_URL}user`;

const ProfilePage = () => {
  const {userProfile, isAuthenticated, isLoading} = useUser();
  const [userProf, setUserProf] = useState<UserProfile>();
  const token = useApiToken();
  const msgCtx = useContext(MessageBannerContext)

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
        msgCtx.setSuccessMessage("Profile saved successfully");
      } else {
        msgCtx.setErrorMessage("Failed to save profile");
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

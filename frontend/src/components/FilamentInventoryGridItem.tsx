import React, {PropsWithoutRef, useRef, useState} from "react";
import IFilament from "../models/IFilament";
import {Button, Card, CardActions, CardContent, Popper, Stack, styled, useTheme} from "@mui/material";
import Typography from "@mui/material/Typography";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline"
import TextField from "@mui/material/TextField";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {green, red} from "@mui/material/colors";
import useAPIToken from "../hooks/use-api-token";
import LoadingDialog from "./LoadingDialog";
import MessageBanner from "./MessageBanner";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}filament`;

const FilamentInventoryGridItem = (props: PropsWithoutRef<{
  filament: IFilament,
  onEditSuccess?: (filament: IFilament) => void
}>) => {
  const theme = useTheme();
  const [spoolCount, setSpoolCount] = useState(props.filament.numberOfSpools || 0);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [showOkCancel, setShowOkCancel] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const bearerToken = useAPIToken();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const StyledTypography = styled(Typography)({
    paddingInline: 1,
    textAlign: "center"
  });
  const updateFilament = async (filament: IFilament) => {
    return await fetch(apiURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filament),
    });
  }

  const handleCancel = () => {
    setShowOkCancel(false);
    setSpoolCount(props.filament.numberOfSpools || 0);
  }
  const handleOk = async () => {
    setShowOkCancel(false);
    setShowLoadingDialog(true);
    const filament = {...props.filament, numberOfSpools: spoolCount};
    const response = await updateFilament(filament);
    setShowLoadingDialog(false);
    if (response.ok) {
      setSuccessMessage("Filament updated successfully");
      if (props.onEditSuccess) {
        props.onEditSuccess({
          ...props.filament,
          numberOfSpools: spoolCount
        });
      } else {
        setErrorMessage("Filament update failed");
      }
    }
  }
  return <>
    <LoadingDialog open={showLoadingDialog}/>
    <MessageBanner successMessage={successMessage} errorMessage={errorMessage}/>
    <Card sx={{
      marginInline: 1,
      minWidth: 200,
      maxWidth: 200,
      minHeight: 275,
      maxHeight: 275,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      marginBottom: 2
    }}>
      <CardContent>
        <Stack direction="column" alignItems="center" justifyContent="center">
          <StyledTypography variant="h6">{props.filament.brand}</StyledTypography>
          {props.filament.name && <StyledTypography>{props.filament.name}</StyledTypography>}
          {props.filament.type && <StyledTypography>{props.filament.type}</StyledTypography>}
          {props.filament.color && <StyledTypography
              sx={{
                backgroundColor: props.filament.colorCode,
                color: props.filament.colorCode ? theme.palette.getContrastText(props.filament.colorCode) : "",
                borderRadius: 3,
                padding: 2,
                width: 100,
                maxWidth: 100,
                maxHeight: 100,
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginTop: 1,
              }}>{props.filament.color}</StyledTypography>}
        </Stack>
      </CardContent>
      <CardActions sx={{alignItems: "center", justifyContent: "center", justifyItems: "center"}}>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Button
            onClick={() => {
              setSpoolCount(spoolCount + 1);
              setShowOkCancel(true);
            }}
            sx={{margin: 0, marginRight: 0}}>
            <AddCircleOutline/>
          </Button>
          <TextField type="number" hiddenLabel
                     id={`spoolCount-${props.filament.id}`}
                     size="small"
                     margin="none"
                     value={spoolCount}
                     inputProps={{min: 0, style: {textAlign: 'center'}}}
                     sx={{
                       "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                         display: "none",
                       },
                       "& input[type=number]": {
                         MozAppearance: "textfield",
                       },
                     }}
                     onChange={(e) => {
                       setSpoolCount(Number(e.target.value));
                       setShowOkCancel(true);
                     }}
                     inputRef={textFieldRef}
          />
          <Popper
            id={`popover-${props.filament.id}`}
            open={showOkCancel}
            anchorEl={textFieldRef.current}
          >
            <Card sx={{marginTop: .5}}>
              <Button onClick={handleOk}><CheckIcon sx={{color: green[500]}}/></Button>
              <Button onClick={handleCancel}><CloseIcon sx={{color: red[500]}}/></Button>
            </Card>
          </Popper>
          <Button onClick={() => setSpoolCount(spoolCount - 1)} disabled={spoolCount === 0}>
            <RemoveCircleOutline/>
          </Button>
        </Stack>
      </CardActions>
    </Card>
  </>
};

export default FilamentInventoryGridItem;
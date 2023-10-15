import { PropsWithChildren, useEffect, useState } from "react";
import EditDrawer from "./EditDrawer";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import IFilament from "../../models/IFilament";
import useBearerToken from "../../hooks/use-bearer-token";
import LoadingDialog from "../LoadingDialog";
import MessageBanner from "../MessageBanner";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}filament`;

const EditFilamentDrawer = (
  props: PropsWithChildren<{
    open: boolean;
    onClose?: () => void;
    filamentId?: string;
  }>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [filament, setFilament] = useState<IFilament>({
    id: props.filamentId || "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const bearerToken = useBearerToken();
  useEffect(() => {
    const getFilament = async () => {
      setIsLoading(true);
      if (props.filamentId) {
        const response = await fetch(apiURL + "/" + props.filamentId, {
          method: "GET",
          headers: { Authorization: `Bearer ${bearerToken}` },
        });
        if (response.ok) {
          setFilament(await response.json());
        }
      } else {
        setFilament({
          id: props.filamentId || "",
        });
      }
      setIsLoading(false);
      // Click on the text field when done loading
      document.getElementById("brand")?.focus();
    };
    getFilament();
  }, [props.filamentId, bearerToken]);

  const onChangeBrand = (brand: string) => {
    setFilament((f) => {
      return { ...f, brand };
    });
  };
  const onChangeName = (name: string) => {
    setFilament((f) => {
      return { ...f, name };
    });
  };
  const onChangeType = (type: string) => {
    setFilament((f) => {
      return { ...f, type };
    });
  };

  const handleClose = () => {
    if (props.onClose) props.onClose();
    //clear out any saved filaments when we close the dialog
    setFilament({
      id: props.filamentId || "",
    });
  };
  const saveFilament = async () => {
    setIsLoading(true);
    const response = await fetch(apiURL, {
      method: "POST",
      body: JSON.stringify(filament),
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    if (response.ok) {
      setSuccessMessage("Filament created successfully.");
      handleClose();
      setTimeout(() => setSuccessMessage(""), 5000);
    } else {
      setErrorMessage(`Creation failed with message: ${response.statusText}`);
    }
    setIsLoading(false);
  };

  return (
    <>
      <LoadingDialog open={isLoading} />
      <MessageBanner
        successMessage={successMessage}
        errorMessage={errorMessage}
        onClose={() => {
          setErrorMessage("");
          setSuccessMessage("");
        }}
      />
      <EditDrawer
        open={props.open}
        onClose={handleClose}
        onSave={saveFilament}
        hideDeleteButton={true}
      >
        <Stack spacing={2}>
          <h2>{props.filamentId ? "Edit " : "New "}Filament</h2>
          <TextField
            required
            id="brand"
            label="Brand"
            value={filament.brand}
            onChange={(e) => onChangeBrand(e.target.value)}
          />
          <TextField
            id="name"
            label="Name"
            defaultValue=""
            onChange={(e) => onChangeName(e.target.value)}
          />
          <TextField
            id="type"
            label="Type"
            defaultValue=""
            onChange={(e) => onChangeType(e.target.value)}
          />
        </Stack>
      </EditDrawer>
    </>
  );
};

export default EditFilamentDrawer;

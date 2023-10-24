import { PropsWithChildren, useEffect, useState } from "react";
import EditDrawer from "./EditDrawer";
import { Stack } from "@mui/material";
import IFilament, { getDefaultFilament } from "../../models/IFilament";
import useBearerToken from "../../hooks/use-bearer-token";
import LoadingDialog from "../LoadingDialog";
import MessageBanner from "../MessageBanner";
import ShrunkTextField from "../formelements/ShrunkTextField";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}filament`;

const EditFilamentDrawer = (
  props: PropsWithChildren<{
    open: boolean;
    onClose?: (updateOccurred?: boolean) => void;
    filamentId?: string;
  }>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [filament, setFilament] = useState<IFilament>(getDefaultFilament());

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
          //make sure fields are default, not a null
          const filament = await response.json();
          const defaultFilament = getDefaultFilament();
          setFilament({ ...defaultFilament, ...filament });
        }
      } else {
        setFilament(getDefaultFilament());
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

  const onChangeTotalWeight = (totalWeight: string) => {
    setFilament((f) => {
      return { ...f, totalWeight: Number(totalWeight) };
    });
  };
  const onChangeLowTemp = (lowTemp: string) => {
    setFilament((f) => {
      return { ...f, lowTemp: Number(lowTemp) };
    });
  };
  const onChangeHighTemp = (highTemp: string) => {
    setFilament((f) => {
      return { ...f, highTemp: Number(highTemp) };
    });
  };
  const onChangeLowBedTemp = (lowBedTemp: string) => {
    setFilament((f) => {
      return { ...f, lowBedTemp: Number(lowBedTemp) };
    });
  };
  const onChangeHighBedTemp = (highBedTemp: string) => {
    setFilament((f) => {
      return { ...f, highBedTemp: Number(highBedTemp) };
    });
  };
  const onChangeColor = (color: string) => {
    setFilament((f) => {
      return { ...f, color };
    });
  };
  const handleClose = (updateOccurred: boolean) => {
    if (props.onClose) props.onClose(updateOccurred);
    //clear out any saved filaments when we close the dialog
    setFilament(getDefaultFilament());
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
      handleClose(true);
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
        onClose={() => handleClose(false)}
        onSave={saveFilament}
        hideDeleteButton={true}
      >
        <Stack spacing={2}>
          <h2>{props.filamentId ? "Edit " : "New "}Filament</h2>
          <ShrunkTextField
            required
            id="brand"
            label="Brand"
            value={filament.brand}
            onChange={(e) => onChangeBrand(e.target.value)}
          />
          <ShrunkTextField
            id="name"
            label="Name"
            value={filament.name}
            onChange={(e) => onChangeName(e.target.value)}
          />
          <ShrunkTextField
            id="color"
            label="Color"
            value={filament.color}
            onChange={(e) => onChangeColor(e.target.value)}
          />
          <ShrunkTextField
            id="type"
            label="Type"
            value={filament.type}
            onChange={(e) => onChangeType(e.target.value)}
          />{" "}
          <ShrunkTextField
            id="weight"
            label="Total Weight"
            value={filament.totalWeight}
            onChange={(e) => onChangeTotalWeight(e.target.value)}
            type="number"
          />
          <ShrunkTextField
            id="lowTemp"
            label="Lower Print Temp"
            value={filament.lowTemp}
            onChange={(e) => onChangeLowTemp(e.target.value)}
            type="number"
          />
          <ShrunkTextField
            id="highTemp"
            label="High Print Temp"
            value={filament.highTemp}
            onChange={(e) => onChangeHighTemp(e.target.value)}
            type="number"
          />
          <ShrunkTextField
            id="lowBedTemp"
            label="Low Bed Temp"
            value={filament.lowBedTemp}
            onChange={(e) => onChangeLowBedTemp(e.target.value)}
            type="number"
          />
          <ShrunkTextField
            id="highBedTemp"
            label="High Bed Temp"
            value={filament.highBedTemp}
            onChange={(e) => onChangeHighBedTemp(e.target.value)}
            type="number"
          />
        </Stack>
      </EditDrawer>
    </>
  );
};

export default EditFilamentDrawer;

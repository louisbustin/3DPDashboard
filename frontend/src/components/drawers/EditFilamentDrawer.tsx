import {PropsWithChildren, useContext, useEffect, useState} from "react";
import EditDrawer from "./EditDrawer";
import {MenuItem, Stack} from "@mui/material";
import IFilament, {
  FilamentStatus,
  getDefaultFilament,
} from "../../models/IFilament";
import useAPIToken from "../../hooks/use-api-token";
import {LoadingDialog} from "@eforge/eforge-common";
import ShrunkTextField from "../formelements/ShrunkTextField";
import StyledSelect from "../formelements/StyledSelect";
import {MessageBannerContext} from "@eforge/eforge-common";
import ColorPickerButton from "../buttons/ColorPickerButton";

const apiURL = `${import.meta.env.VITE_BASE_URL}filament`;

const EditFilamentDrawer = (
  props: PropsWithChildren<{
    open: boolean;
    onClose?: (updateOccurred?: boolean) => void;
    filamentId?: string;
  }>
) => {
  const msgCtx = useContext(MessageBannerContext);
  const [isLoading, setIsLoading] = useState(false);
  const [filament, setFilament] = useState<IFilament>(getDefaultFilament());

  const bearerToken = useAPIToken();
  useEffect(() => {
    const getFilament = async () => {
      setIsLoading(true);
      if (props.filamentId) {
        const response = await fetch(apiURL + "/" + props.filamentId, {
          method: "GET",
          headers: {Authorization: `Bearer ${bearerToken}`},
        });
        if (response.ok) {
          //make sure fields are default, not a null
          const filament = await response.json();
          const defaultFilament = getDefaultFilament();
          setFilament({...defaultFilament, ...filament});
        }
      } else {
        setFilament(getDefaultFilament());
      }

      setIsLoading(false);
      // Click on the text field when done loading
      document.getElementById("brand")?.focus();
    };
    if (props.open) {
      getFilament().then();
    }
  }, [props.filamentId, bearerToken, props.open]);

  const onChangeBrand = (brand: string) => {
    setFilament((f) => {
      return {...f, brand};
    });
  };
  const onChangeName = (name: string) => {
    setFilament((f) => {
      return {...f, name};
    });
  };
  const onChangeType = (type: string) => {
    setFilament((f) => {
      return {...f, type};
    });
  };

  const onChangeTotalWeight = (totalWeight: string) => {
    setFilament((f) => {
      return {...f, totalWeight: Number(totalWeight)};
    });
  };
  const onChangeLowTemp = (lowTemp: string) => {
    setFilament((f) => {
      return {...f, lowTemp: Number(lowTemp)};
    });
  };
  const onChangeHighTemp = (highTemp: string) => {
    setFilament((f) => {
      return {...f, highTemp: Number(highTemp)};
    });
  };
  const onChangeLowBedTemp = (lowBedTemp: string) => {
    setFilament((f) => {
      return {...f, lowBedTemp: Number(lowBedTemp)};
    });
  };
  const onChangeHighBedTemp = (highBedTemp: string) => {
    setFilament((f) => {
      return {...f, highBedTemp: Number(highBedTemp)};
    });
  };
  const onChangeColor = (color: string) => {
    setFilament((f) => {
      return {...f, color};
    });
  };
  const onChangeColorCode = (colorCode: string) => {
    setFilament((f) => {
      return {...f, colorCode};
    });
  };
  const onChangeStatus = (status: string | unknown) => {
    setFilament((f) => {
      return {...f, filamentStatus: Number(status)};
    });
  };
  const onChangeReorderThreshold = (threshold: number) => {
    setFilament((f) => {
      return {...f, reorderThreshold: Number(threshold)};
    })
  }
  const onChangeNumOfSpools = (numOfSpools: number) => {
    setFilament((f) => {
      return {...f, numberOfSpools: Number(numOfSpools)};
    })
  }
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
      headers: {Authorization: `Bearer ${bearerToken}`},
    });
    if (response.ok) {
      msgCtx.setSuccessMessage(
        filament.id
          ? "Filament updated successfully."
          : "Filament created successfully."
      );
      handleClose(true);
    } else {
      msgCtx.setErrorMessage(`Creation failed with message: ${response.statusText}`);
    }
    setIsLoading(false);
  };

  return (
    <>
      <LoadingDialog open={isLoading}/>
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
          <Stack direction="row">
            <ShrunkTextField
              id="color"
              label="Color"
              value={filament.color}
              onChange={(e) => onChangeColor(e.target.value)}
              sx={{mr: 1}}
            />
            <ColorPickerButton
              color={filament.colorCode}
              onChangeComplete={(color) => onChangeColorCode(color)}
            />
          </Stack>
          <ShrunkTextField
            id="type"
            label="Type"
            value={filament.type}
            onChange={(e) => onChangeType(e.target.value)}
          />
          <ShrunkTextField
            id="threshold"
            label="Reorder Threshold"
            value={filament.reorderThreshold || 0}
            type="number"
            onChange={(e) => onChangeReorderThreshold(Number(e.target.value))}
            InputProps={{inputProps: {min: 0}}}
          />
          <ShrunkTextField
            id="numOfSpools"
            label="Current Spools"
            value={filament.numberOfSpools || 0}
            type="number"
            onChange={(e) => onChangeNumOfSpools(Number(e.target.value))}
            InputProps={{inputProps: {min: 0}}}
          />
          <ShrunkTextField
            id="weight"
            label="Total Weight"
            value={filament.totalWeight}
            onChange={(e) => onChangeTotalWeight(e.target.value)}
            type="number"
            InputProps={{inputProps: {min: 0}}}
          />
          <ShrunkTextField
            id="lowTemp"
            label="Lower Print Temp"
            value={filament.lowTemp}
            onChange={(e) => onChangeLowTemp(e.target.value)}
            type="number"
            InputProps={{inputProps: {min: 0}}}
          />
          <ShrunkTextField
            id="highTemp"
            label="High Print Temp"
            value={filament.highTemp}
            onChange={(e) => onChangeHighTemp(e.target.value)}
            type="number"
            InputProps={{inputProps: {min: 0}}}
          />
          <ShrunkTextField
            id="lowBedTemp"
            label="Low Bed Temp"
            value={filament.lowBedTemp}
            onChange={(e) => onChangeLowBedTemp(e.target.value)}
            type="number"
            InputProps={{inputProps: {min: 0}}}
          />
          <ShrunkTextField
            id="highBedTemp"
            label="High Bed Temp"
            value={filament.highBedTemp}
            onChange={(e) => onChangeHighBedTemp(e.target.value)}
            type="number"
            InputProps={{inputProps: {min: 0}}}
          />
          <StyledSelect
            id="status"
            label="Status"
            value={
              filament.filamentStatus === undefined
                ? FilamentStatus.Active
                : filament.filamentStatus
            }
            onChange={(e) => {
              onChangeStatus(e.target.value);
            }}
          >
            <MenuItem value="0">Active</MenuItem>
            <MenuItem value="1">Inactive</MenuItem>
          </StyledSelect>
        </Stack>
      </EditDrawer>
    </>
  );
};

export default EditFilamentDrawer;

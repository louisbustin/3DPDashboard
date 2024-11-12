import {PropsWithoutRef, useState} from "react";
import IFilament, {FilamentStatus, FilamentType, filamentTypes} from "../../models/IFilament";
import {DataGrid, GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import {Button, Checkbox, FormControlLabel, Stack, Tooltip} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAPIToken from "../../hooks/use-api-token";
import EditFilamentDrawer from "../drawers/EditFilamentDrawer";
import _ from "lodash";
import ConfirmationDialog from "../ConfirmationDialog";
import LoadingDialog from "../LoadingDialog";
import MessageBanner from "../MessageBanner";
import ShrunkTextField from "../formelements/ShrunkTextField";
import StyledSelect from "../formelements/StyledSelect";
import MenuItem from "@mui/material/MenuItem";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}filament`;

const FilamentGrid = (props: PropsWithoutRef<{
  data: IFilament[],
  onDeleteSuccess?: () => void,
  onEditSuccess?: () => void,
  allowDelete?: boolean,
  allowEdit?: boolean,
  allowAdd?: boolean,
  allowInactive?: boolean,
  showSpoolAddRemove?: boolean
}>) => {
  const [selectedRowId, setSelectedRowId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const bearerToken = useAPIToken();
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilamentType | "all">("all");

  const openDrawer = (id?: string) => {
    setSelectedRowId(id || "");
    setDrawerOpen(true);
  };

  const deleteFilament = async () => {
    setDeleteDialogOpen(false);
    setShowLoadingDialog(true);
    const response = await fetch(`${apiURL}/${selectedRowId}`, {
      method: "DELETE",
      headers: {Authorization: `Bearer ${bearerToken}`},
    });
    if (response.ok) {
      if (props.onDeleteSuccess) {
        props.onDeleteSuccess();
      }
      setSuccessMessage("Filament successfully deleted.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } else {
      setErrorMessage("Error occurred deleting filament.");
    }
    setShowLoadingDialog(false);
  };

  const updateFilament = async (filament: IFilament) => {
    setShowLoadingDialog(true);
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filament),
    });
    if (response.ok) {
      if (props.onEditSuccess) {
        props.onEditSuccess();
      }
      setSuccessMessage("Filament successfully updated.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } else {
      setErrorMessage("Error occurred updating filament.");
    }
    setShowLoadingDialog(false);
  }

  const addSpool = async (filament: IFilament) => {
    filament.numberOfSpools = (filament.numberOfSpools || 0) + 1;
    await updateFilament(filament);
  }
  const removeSpool = async (filament: IFilament) => {
    filament.numberOfSpools = (filament.numberOfSpools || 0) - 1;
    await updateFilament(filament);
  }

  const columns: GridColDef<IFilament>[] = [
    {field: "brand", headerName: "Brand", flex: 1},
    {field: "name", headerName: "Name", flex: 1},
    {field: "type", headerName: "Type", flex: 1},
    {field: "color", headerName: "Color", flex: 1},
    {
      field: "numberOfSpools",
      headerName: "#Spools",
      flex: 1,
      valueFormatter: (params) => params.value || 0,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      width: 150,
      getActions: (params) => {
        const actions = [];
        if (props.showSpoolAddRemove) {
          actions.push(<Tooltip title="Add Spool" enterDelay={1000}>
            <GridActionsCellItem
              icon={<AddCircleOutline/>}
              label="Add Spool"
              onClick={() => addSpool(params.row)}
            />
          </Tooltip>);

          actions.push(<Tooltip title="Remove Spool" enterDelay={1000}><span>
            <GridActionsCellItem
              icon={<RemoveCircleOutline/>}
              label="Remove Spool"
              onClick={() => removeSpool(params.row)}
              disabled={(params.row.numberOfSpools || 0) < 1}
            /></span>
          </Tooltip>);
        }
        if (props.allowEdit) {
          actions.push(<Tooltip title="Edit" enterDelay={1000}>
            <GridActionsCellItem
              icon={<EditIcon/>}
              label="Edit"
              onClick={() => openDrawer(params.row.id.toString())}
            />
          </Tooltip>)
        }
        if (props.allowDelete) {
          actions.push(<Tooltip title="Delete" enterDelay={1000}>
            <GridActionsCellItem
              icon={<DeleteIcon/>}
              label="Delete"
              onClick={() => {
                setSelectedRowId(params.row.id.toString());
                setDeleteDialogOpen(true);
              }}
              color="inherit"
            />
          </Tooltip>)
        }
        return actions;
      },
    },
  ];
  return <>
    <MessageBanner successMessage={successMessage} errorMessage={errorMessage}/>
    <LoadingDialog open={showLoadingDialog}/>
    <EditFilamentDrawer
      open={drawerOpen}
      onClose={async (updateOccurred) => {
        if (updateOccurred) {
          setShowLoadingDialog(true);
          if (props.onEditSuccess) {
            props.onEditSuccess();
          }
        }
        setDrawerOpen(false);
        setShowLoadingDialog(false);
      }}
      filamentId={_.clone(selectedRowId)}
    />
    {(props.allowAdd || props.allowInactive) &&
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
            <StyledSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as FilamentType & "all")}
            >
                <MenuItem value="all">All</MenuItem>
              {[...filamentTypes].sort().map((type, index) => <MenuItem key={index} value={type}>{type}</MenuItem>)}
            </StyledSelect>
            <ShrunkTextField label="Search" sx={{paddingBottom: 1}} onChange={(e) => setFilter(e.target.value)}/>
            <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => setShowInactive(e.target.checked)}
                  ></Checkbox>
                }
                label="Show Inactive"
            ></FormControlLabel>
            <Button onClick={() => openDrawer()} aria-label="Add">
                <AddIcon/>
            </Button>
        </Stack>}
    <ConfirmationDialog
      open={deleteDialogOpen}
      onCancel={() => setDeleteDialogOpen(false)}
      onConfirm={() => deleteFilament()}
      okText="Yes"
      cancelText="No"
      title="Are you sure?"
    >
      This will completely remove this filament from the database. Understand
      that this operation is not reversible. Are you sure you want to delete
      this filament?
    </ConfirmationDialog>
    <DataGrid
      rows={props.data.filter((i) => {
          return (!showInactive
              ? i.filamentStatus === FilamentStatus.Active ||
              i.filamentStatus === undefined
              : true)
            && (
              filter === ""
              || i.name.toLowerCase().includes(filter.toLowerCase())
              || i.brand.toLowerCase().includes(filter.toLowerCase())
              || i.color.toLowerCase().includes(filter.toLowerCase())
            )
            && (
              typeFilter === "all"
              || i.type === typeFilter
            )
        }
      )}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {page: 0, pageSize: 10},
        },
      }}
      pageSizeOptions={[10, 50, 100]}
    />
  </>;
};

export default FilamentGrid;
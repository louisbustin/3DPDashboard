import useFilament from "../hooks/use-filament";
import {Stack} from "@mui/material";
import FilamentGrid from "../components/grids/FilamentGrid";
import {LoadingDialog} from "@eforge/eforge-common";
import FilamentInventoryGrid from "../components/FilamentInventoryGrid";

const InventoryPage = () => {
  const {filament, isLoading, refresh} = useFilament();
  const reorderFilament = filament ? filament.filter(f =>
    f.filamentStatus !== 1 && (f.reorderThreshold || 0) >= (f.numberOfSpools || 0)
  ) : [];
  const allOtherFilament = filament ? filament.filter(f => f.filamentStatus !== 1 && (f.reorderThreshold || 0) < (f.numberOfSpools || 0)) : [];
  return <><h2>Filament Inventory</h2>
    <LoadingDialog open={isLoading}/>
    <Stack direction="column" spacing={2}>
      <h3>Reorder</h3>
      <FilamentInventoryGrid data={reorderFilament} onEditSuccess={refresh}/>
      <h3>All Other</h3>
      <FilamentGrid data={allOtherFilament || []} showSpoolAddRemove/>
    </Stack>
  </>;
};

export default InventoryPage;
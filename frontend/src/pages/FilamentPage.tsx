import LoadingDialog from "../components/LoadingDialog";
import useFilament from "../hooks/use-filament";
import FilamentGrid from "../components/grids/FilamentGrid";

const FilamentPage = () => {
  const {filament: data, refresh, isLoading} = useFilament();

  return (
    <>
      <h2>Filaments</h2>
      <LoadingDialog open={isLoading}></LoadingDialog>
      <FilamentGrid
        data={data || []}
        onDeleteSuccess={() => refresh()}
        onEditSuccess={() => refresh()}
        allowDelete
        allowEdit
        allowAdd
        allowInactive
      />
    </>
  );
};

export default FilamentPage;

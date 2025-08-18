import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { MachineryStatus } from "../../../utils/const";
import { fetchUpdateMachinery } from "../model/actions";
import { Button, ButtonGroup } from "@mui/material";
import { selectCurrentMachinery } from "../model/selectors";

const MachineryStatusButtons: FC = () => {
  const dispatch = useAppDispatch();
  const currentMachinery = useAppSelector(selectCurrentMachinery);
  if (!currentMachinery) return null;
  const handleStatusChange = (newStatus: MachineryStatus) => {
    dispatch(fetchUpdateMachinery({ ...currentMachinery, status: newStatus }));
  };
  return (
    <ButtonGroup variant="outlined" aria-label="Basic button group">
      <Button
        color={currentMachinery.status === MachineryStatus.disActive ? "error" : "primary"}
        variant={currentMachinery.status === MachineryStatus.disActive ? "contained" : "outlined"}
        onClick={() => handleStatusChange(MachineryStatus.disActive)}
      >
        {MachineryStatus.disActive}
      </Button>
      <Button
        color={currentMachinery.status === MachineryStatus.repair ? "warning" : "primary"}
        variant={currentMachinery.status === MachineryStatus.repair ? "contained" : "outlined"}
        onClick={() => handleStatusChange(MachineryStatus.repair)}
      >
        {MachineryStatus.repair}
      </Button>
      <Button
        color={currentMachinery.status === MachineryStatus.active ? "success" : "primary"}
        variant={currentMachinery.status === MachineryStatus.active ? "contained" : "outlined"}
        onClick={() => handleStatusChange(MachineryStatus.active)}
      >
        {MachineryStatus.active}
      </Button>
    </ButtonGroup>
  );
};

export default MachineryStatusButtons;

import React, { FC } from "react";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { MachineryStatus } from "../../../../utils/const";
import { useAppSelector } from "../../../../hooks/redux";
import { getMachineryIsLoading } from "../../model/selectors";
import { IMachinery } from "../../../../models/iMachinery";

interface IProps {
  machinery: IMachinery;
  isEditMode: boolean;
  isValid: boolean;
  toggleIsEditMode: () => void;
  updateMachineryHandler: () => void;
  cancelUpdateMachineryHandler: () => void;
  changeMachineryStatusHandler: () => void;
}

const MachineryReportActionButtons: FC<IProps> = ({
  machinery,
  isEditMode,
  isValid,
  toggleIsEditMode,
  updateMachineryHandler,
  cancelUpdateMachineryHandler,
  changeMachineryStatusHandler,
}) => {
  const isLoading = useAppSelector(getMachineryIsLoading);
  return (
    <Stack direction="row" sx={{ width: "100%" }} alignItems="center" justifyContent="end" spacing={2}>
      {isEditMode ? (
        <>
          <Button onClick={cancelUpdateMachineryHandler} variant={"outlined"}>
            Отменить
          </Button>
          <LoadingButton
            onClick={updateMachineryHandler}
            variant={"contained"}
            loading={isLoading}
            disabled={!isValid}
            color={"success"}
          >
            Сохранить
          </LoadingButton>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            color={
              machinery && machinery.status && machinery.status === MachineryStatus.disActive ? "success" : "error"
            }
            disabled={isLoading}
            onClick={changeMachineryStatusHandler}
            sx={{ width: "150px" }}
          >
            {machinery && machinery.status && machinery.status === MachineryStatus.disActive
              ? "Востановить"
              : "Списать"}
          </Button>
          <LoadingButton onClick={toggleIsEditMode} variant={"contained"} loading={isLoading} color="primary">
            Редактировать
          </LoadingButton>
        </>
      )}
    </Stack>
  );
};

export default MachineryReportActionButtons;

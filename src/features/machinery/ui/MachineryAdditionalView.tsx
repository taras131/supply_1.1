import React, { ChangeEvent, FC } from "react";
import { IMachinery, INewMachinery } from "../../../models/iMachinery";
import { SelectChangeEvent, Stack } from "@mui/material";
import { tractionTypes, transmissionTypes } from "../utils/const";
import FieldControl from "../../../components/common/FieldControl";
import { ValidationErrors } from "../../../utils/validators";
import CreateUpdateUserInfo from "../../../components/common/CreateUpdateUserInfo";
import Box from "@mui/material/Box";

interface IProps {
  editedMachinery: IMachinery | INewMachinery | null;
  errors?: ValidationErrors;
  isEditMode?: boolean;
  machineryFieldChangeHandler: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | unknown>,
  ) => void;
}

const MachineryAdditionalView: FC<IProps> = ({
  editedMachinery,
  errors,
  isEditMode = false,
  machineryFieldChangeHandler,
}) => {
  if (!editedMachinery) return null;
  return (
    <>
      <FieldControl
        label="Тип движетеля"
        name="traction_type_id"
        id="traction_type_id"
        value={editedMachinery.traction_type_id}
        error={errors?.traction_type_id}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
        options={tractionTypes}
      />
      <FieldControl
        label="Номер шасси / рамы"
        name="frame_number"
        id="frame_number"
        value={editedMachinery.frame_number}
        error={errors?.frame_number}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
      />
      <FieldControl
        label="Тип трансмисии"
        name="transmission_type_id"
        id="transmission_type_id"
        value={editedMachinery.transmission_type_id}
        error={errors?.transmission_type_id}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
        options={transmissionTypes}
      />
      <FieldControl
        label="Марка двигателя"
        name="engine_brand"
        id="engine_brand"
        value={editedMachinery.engine_brand}
        error={errors?.engine_brand}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
      />
      <FieldControl
        label="Модель двигателя"
        name="engine_model"
        id="engine_model"
        value={editedMachinery.engine_model}
        error={errors?.engine_model}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
      />
      <FieldControl
        label="Марка трансмиссии"
        name="transmission_brand"
        id="transmission_brand"
        value={editedMachinery.transmission_brand}
        error={errors?.transmission_brand}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
      />
      <FieldControl
        label="Модель трансмиссии"
        name="transmission_model"
        id="transmission_model"
        value={editedMachinery.transmission_model}
        error={errors?.transmission_model}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
      />
      {!isEditMode && "author" in editedMachinery && (
        <Box
          sx={{
            display: "grid",
            gridColumn: "1 / -1",
            width: "100%",
            minWidth: "unset",
            maxWidth: "none",
            gap: "24px",
            gridTemplateColumns: `repeat(auto-fit, minmax(${isEditMode ? 240 : 200}px, 1fr))`,
          }}
        >
          <CreateUpdateUserInfo
            author={editedMachinery.author || null}
            updatedAuthor={editedMachinery.updated_author || null}
            createdAT={editedMachinery.created_at}
            updatedAt={editedMachinery.updated_at || null}
          />
        </Box>
      )}
    </>
  );
};

export default MachineryAdditionalView;

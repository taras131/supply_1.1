import React, { ChangeEvent, FC, useMemo } from "react";
import { IMachinery, INewMachinery } from "../../../models/iMachinery";
import { ValidationErrors } from "../../../utils/validators";
import { SelectChangeEvent } from "@mui/material";
import FieldControl from "../../../components/common/FieldControl";
import { engineTypes, machineryTypes } from "../utils/const";
import { yearsManufacture } from "../../../utils/const";

interface IProps {
  editedMachinery: IMachinery | INewMachinery | null;
  errors?: ValidationErrors;
  isEditMode?: boolean;
  machineryFieldChangeHandler: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | unknown>,
  ) => void;
}

const MachineryBasicView: FC<IProps> = ({
  editedMachinery,
  errors,
  machineryFieldChangeHandler,
  isEditMode = false,
}) => {
  const yearOptions = useMemo(() => yearsManufacture.map((year) => ({ id: year, title: year })), []);
  if (!editedMachinery) return null;
  return (
    <>
      <FieldControl
        label="Тип техники"
        name="type_id"
        id="type_id"
        value={editedMachinery.type_id}
        error={errors?.type_id}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
        options={machineryTypes}
        isRequired
      />
      <FieldControl
        label="Тип двигателя"
        name="engine_type_id"
        id="engine_type_id"
        value={editedMachinery.engine_type_id}
        error={errors?.engine_type_id}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
        options={engineTypes}
        isRequired
      />
      <FieldControl
        label="Наработка (час)"
        name="operating"
        id="operating"
        value={`${editedMachinery.operating}`}
        error={errors?.operating}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
      />
      <FieldControl
        label="Пробег (км)"
        name="odometer"
        id="odometer"
        value={`${editedMachinery.odometer}`}
        error={errors?.odometer}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
      />
      <FieldControl
        label="Марка"
        name="brand"
        id="brand"
        value={editedMachinery.brand}
        error={errors?.brand}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
        isRequired
      />
      <FieldControl
        label="Модель"
        name="model"
        id="model"
        value={editedMachinery.model}
        error={errors?.model}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
        isRequired
      />
      <FieldControl
        label="Год производства"
        name="year_manufacture"
        id="year_manufacture"
        value={`${editedMachinery.year_manufacture}`}
        error={errors?.year_manufacture}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
        options={yearOptions}
        isRequired
      />
      <FieldControl
        label="VIN"
        name="vin"
        id="vin"
        value={editedMachinery.vin}
        error={errors?.vin}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
      />
      <FieldControl
        label="Гос. номер"
        name="state_number"
        id="state_number"
        value={editedMachinery.state_number}
        error={errors?.state_number}
        isEditMode={isEditMode}
        onChange={machineryFieldChangeHandler}
      />
    </>
  );
};
export default MachineryBasicView;

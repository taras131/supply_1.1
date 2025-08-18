import React, { ChangeEvent, FC, useId, useMemo } from "react";
import { FormControl, FormHelperText, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { PRIORITIES } from "../../utils/const";

interface IProps {
  currentPriorityId: number;
  changeHandler: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => void;
}

const PrioritiesSelect: FC<IProps> = ({ currentPriorityId, changeHandler }) => {
  const priorityId = useId();
  const prioritiesList = useMemo(
    () =>
      PRIORITIES.map((priority) => (
        <MenuItem key={priority.id} value={priority.id}>
          {priority.title}
        </MenuItem>
      )),
    [],
  );
  return (
    <FormControl fullWidth>
      <Select
        id={priorityId}
        value={`${currentPriorityId}`}
        onChange={changeHandler}
        sx={{ overflow: "hidden" }}
        fullWidth
        name={"priority_id"}
        variant="outlined"
      >
        {prioritiesList}
      </Select>
      <FormHelperText>Приоритет</FormHelperText>
    </FormControl>
  );
};

export default PrioritiesSelect;

import React, { FC, useEffect } from "react";
import { CardActions, IconButton, Stack } from "@mui/material";
import FieldControl from "../../../components/common/FieldControl";
import { useEditor } from "../../../hooks/useEditor";
import { machineryCommentValidate } from "../../../utils/validators";
import { emptyMachineryComment, INewMachineryComment } from "../../../models/IMachineryComment";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchAddMachineryComment } from "../model/actions";
import { selectAllMachineryForOptions, selectCurrentMachineryId } from "../../machinery/model/selectors";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PerformerChip from "../../users/ui/PerformerChip";
import { getUserRoleById } from "../../users/utils/services";
import Divider from "@mui/material/Divider";
import { selectCurrentUser } from "../../users/model/selectors";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { fetchGetAllMachinery } from "../../machinery/model/actions";

interface IProps {
  isShowMachineryInfo: boolean;
}

const MachineryCommentsAddNew: FC<IProps> = ({ isShowMachineryInfo }) => {
  const dispatch = useAppDispatch();
  const currenUser = useAppSelector(selectCurrentUser);
  const machineryId = useAppSelector(selectCurrentMachineryId);
  const machineryOptions = useAppSelector(selectAllMachineryForOptions);
  const { editedValue, errors, handleFieldChange, resetValue } = useEditor<INewMachineryComment>({
    initialValue: JSON.parse(JSON.stringify(emptyMachineryComment)),
    validate: machineryCommentValidate(isShowMachineryInfo),
  });
  useEffect(() => {
    dispatch(fetchGetAllMachinery());
  }, []);
  const saveClickHandler = () => {
    dispatch(
      fetchAddMachineryComment({
        ...editedValue,
        machinery_id: isShowMachineryInfo ? editedValue.machinery_id : machineryId || "-1",
      }),
    );
    resetValue();
  };
  return (
    <Card
      sx={{
        width: "100%",
        mb: 1,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <CardContent
        sx={{
          width: "100%",
          display: "grid",
          alignItems: "center",
          padding: "10px",
          minHeight: "88px",
          height: "100%",
          gridTemplateColumns: "120px auto 10fr",
        }}
      >
        <PerformerChip
          name={currenUser?.first_name || ""}
          photo={currenUser?.avatar_path || ""}
          role={getUserRoleById(currenUser?.role_id || 0).title}
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        <Stack direction="row" spacing={2} alignItems={"center"} sx={{ marginTop: "16px" }}>
          <FieldControl
            label="Добавить заметку:"
            name="text"
            id="text"
            value={editedValue.text}
            error={errors?.text}
            isEditMode
            onChange={handleFieldChange}
          />
          {isShowMachineryInfo && (
            <FieldControl
              label="Техника"
              name="machinery_id"
              id="machinery_id"
              value={editedValue.machinery_id}
              error={errors?.machinery_id}
              onChange={handleFieldChange}
              options={machineryOptions}
              sx={{ width: "300px" }}
            />
          )}
        </Stack>
      </CardContent>
      <CardActions>
        <IconButton
          sx={{ marginTop: "16px" }}
          aria-label="add comment"
          onClick={saveClickHandler}
          color={"primary"}
          disabled={Object.keys(errors).length > 0}
        >
          <AddCommentIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default MachineryCommentsAddNew;

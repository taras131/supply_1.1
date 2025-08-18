import React from "react";
import { useAppSelector } from "../../../hooks/redux";
import {
  Paper,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import UserList from "./UserList";
import { selectAllUsers, selectIsUsersLoading } from "../model/selectors";
import AUsersMigration from "./AUsersMigration";
import Preloader from "../../../components/common/Preloader";

const UsersPage = () => {
  const matches_650 = useMediaQuery("(min-width:500px)");
  const matches_550 = useMediaQuery("(min-width:550px)");
  const users = useAppSelector(selectAllUsers);
  const isLoading = useAppSelector(selectIsUsersLoading);
  if (isLoading) {
    return <Preloader />;
  }
  if (!users) {
    return null;
  }
  return (
    <Stack style={{ minHeight: "calc(100vh - 60px" }} alignItems="center">
      <TableContainer component={Paper} sx={{ maxWidth: 850 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ padding: matches_650 ? "12px" : "4px" }}>
                <Typography fontSize={matches_650 ? "18px" : "14px"} fontWeight={600}>
                  {matches_550 ? "Имя" : "ФИО"}
                </Typography>
              </TableCell>
              {matches_550 && (
                <TableCell align="left" sx={{ padding: matches_650 ? "12px" : "4px" }}>
                  <Typography fontSize={matches_650 ? "18px" : "14px"} fontWeight={600}>
                    Отчество
                  </Typography>
                </TableCell>
              )}
              <TableCell align="left" sx={{ padding: matches_650 ? "12px" : "4px" }}>
                <Typography fontSize={matches_650 ? "18px" : "14px"} fontWeight={600}>
                  Email
                </Typography>
              </TableCell>
              <TableCell align="left" sx={{ padding: matches_650 ? "12px" : "4px" }}>
                <Typography fontSize={matches_650 ? "18px" : "14px"} fontWeight={600}>
                  Должность
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <UserList users={users} />
        </Table>
      </TableContainer>
      <AUsersMigration />
    </Stack>
  );
};

export default UsersPage;

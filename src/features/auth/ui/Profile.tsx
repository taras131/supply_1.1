import React, { useEffect } from "react";
import Preloader from "../../../components/Preloader";
import { useAppSelector } from "../../../hooks/redux";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../utils/routes";
import Stack from "@mui/material/Stack";
import { selectIsAuth, selectIsAuthLoading } from "../model/selectors";
import ProfileTabs from "./ProfileTabs";
import ProfileHeader from "./ProfileHeader";

const Profile = () => {
  const navigate = useNavigate();
  const isAuth = useAppSelector(selectIsAuth);
  const isAuthLoading = useAppSelector(selectIsAuthLoading);
  useEffect(() => {
    if (!isAuth) navigate(routes.login);
  }, [isAuth]);
  if (isAuthLoading || !isAuth) return <Preloader />;
  return (
    <Stack sx={{ maxWidth: "1350px", width: "100%", marginLeft: "auto", marginRight: "auto" }} spacing={4}>
      <ProfileHeader />
      <ProfileTabs />
    </Stack>
  );
};

export default Profile;

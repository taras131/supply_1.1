import { Container, Stack, Card, Avatar, Typography, useMediaQuery } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useEffect, FC, ReactNode, FormEvent } from "react";
import { useAppSelector } from "../../../hooks/redux";
import { routes } from "../../../utils/routes";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { selectIsAuth } from "../model/selectors";

interface IProps {
  title: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

const AuthLayout: FC<IProps> = ({ title, handleSubmit, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useAppSelector(selectIsAuth);
  const matches_600 = useMediaQuery("(min-width:600px)");
  useEffect(() => {
    if (isAuth) {
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate(routes.profile);
      }
    }
  }, [isAuth]);
  return (
    <Container component="div">
      <Stack justifyContent="center" alignItems="center" sx={{ minHeight: "80vh" }}>
        <Card sx={{ padding: matches_600 ? "24px" : "10px" }}>
          <Stack spacing={1} alignItems="center" justifyContent="center">
            <Avatar sx={{ m: 1, backgroundColor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {title}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                width: matches_600 ? "360px" : "320px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                alignItems: "center",
              }}
            >
              {children}
            </Box>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
export default AuthLayout;

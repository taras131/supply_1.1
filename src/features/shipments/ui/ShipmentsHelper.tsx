import React from "react";
import {Stack, Typography, useMediaQuery} from "@mui/material";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";
import DownloadIcon from "@mui/icons-material/Download";
import {SUCCESS_GRADIENT} from "../../../styles/const";

const ShipmentsHelper = () => {
    const matches_700 = useMediaQuery("(min-width:700px)");
    return (
        <Stack>
            <Stack>
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <div
                        style={{
                            height: "35px",
                            width: "35px",
                            backgroundColor: "white",
                            border: "1px solid black",
                        }}
                    ></div>
                    <Typography>- груз отправлен.</Typography>
                </Stack>
                <Stack direction={"row"} spacing={1} alignItems={"center"} mt={1}>
                    <div style={{height: "35px", width: "35px", background: SUCCESS_GRADIENT}}></div>
                    <Typography>- груз получен.</Typography>
                </Stack>
            </Stack>
            <Stack>
                <Stack direction={"row"} spacing={3} alignItems={"center"}>
                    <AirplanemodeActiveIcon/>
                    <Typography>- отправлен авиа доставкой.</Typography>
                </Stack>
                <Stack direction={"row"} spacing={3} alignItems={"center"} mt={matches_700 ? 2 : 1}>
                    <DirectionsSubwayIcon/>
                    <Typography>- отправлен ЖД доставкой.</Typography>
                </Stack>
                <Stack direction={"row"} spacing={3} alignItems={"center"} mt={matches_700 ? 2 : 1}>
                    <DownloadIcon/>
                    <Typography>- скачать транспортную накладную или счёт.</Typography>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default ShipmentsHelper;

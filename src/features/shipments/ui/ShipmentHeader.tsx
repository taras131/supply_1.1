import React, { FC } from "react";
import { IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";
import DownloadIcon from "@mui/icons-material/Download";
import {CENTER, COMPONENT_A, ROW, SPACE_BETWEEN} from "../../../styles/const";
import {convertMillisecondsToDate} from "../../../utils/services";
import Grid from "@mui/material/Grid";
import {IShipments} from "../../../models/iShipments";

interface IProps {
  shipment: IShipments;
}

const ShipmentHeader: FC<IProps> = ({ shipment }) => {
  const matches_430 = useMediaQuery("(min-width:420px)");
  const createdDate = convertMillisecondsToDate(+shipment.created_at);
  const handleDownloadClick = (e: any) => {
    e.stopPropagation();
  };
  return (
    <Stack >
      {matches_430 && (
        <Stack>
          <Typography sx={{ flexShrink: 0 }} fontWeight={600}>
            {createdDate}
          </Typography>
        </Stack>
      )}
      <Stack>
        <Stack direction={ROW} alignItems={CENTER} justifyContent={SPACE_BETWEEN} sx={{ width: "100%" }}>
          <Typography sx={{ flexShrink: 0 }} fontWeight={600}>
            {shipment.transporter}
          </Typography>
          {shipment.lading_file_path && (
            <IconButton
              sx={{ padding: 0 }}
              color="primary"
              aria-label="download lading number"
              component={COMPONENT_A}
              onClick={handleDownloadClick}
              href={shipment.lading_file_path}
              target="_blank"
            >
              <DownloadIcon />
            </IconButton>
          )}
        </Stack>
      </Stack>
      <Stack>
        <Typography sx={{ flexShrink: 0 }} fontWeight={600} ml={1}>
          {shipment.lading_number}
        </Typography>
      </Stack>
      <Stack>
        <Stack alignItems={CENTER} justifyContent={CENTER}>
          {shipment.type === "air" ? <AirplanemodeActiveIcon /> : <DirectionsSubwayIcon />}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ShipmentHeader;

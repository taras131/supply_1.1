import React from 'react';
import { Stack, Typography, useMediaQuery } from '@mui/material';
import {CENTER, COLUMN, ROW, START} from "../../../styles/const";

function SuppliersInfo() {
  const matches_500 = useMediaQuery('(min-width:500px)');
  const matches_400 = useMediaQuery('(min-width:400px)');
  const countSuppliers = 10; // useAppSelector((state) => getSuppliersCount(state));
  const totalTurnover = 10; // useAppSelector((state) => getTotalTurnover(state));
  return (
    <Stack
      sx={{ maxWidth: 1350, width: '100%' }}
      direction={matches_400 ? ROW : COLUMN}
      alignItems={matches_400 ? CENTER : START}
      justifyContent={START}
      spacing={matches_400 ? 2 : 1}
    >
      <Stack direction={ROW} spacing={1}>
        <Typography
          color="gray"
          fontSize={matches_500 ? '16px' : '12px'}
          fontWeight={matches_500 ? 600 : 500}
        >
          Поставщиков:
        </Typography>
        <Typography
          color="darkblue"
          fontSize={matches_500 ? '16px' : '12px'}
          fontWeight={matches_500 ? 600 : 500}
        >
          {countSuppliers}
        </Typography>
      </Stack>
      <Stack direction={ROW} spacing={1}>
        <Typography
          color="gray"
          fontSize={matches_500 ? '16px' : '12px'}
          fontWeight={matches_500 ? 600 : 500}
        >
          Оборот:
        </Typography>
        <Typography
          color="darkblue"
          fontSize={matches_500 ? '16px' : '12px'}
          fontWeight={matches_500 ? 600 : 500}
        >
          {new Intl.NumberFormat('ru-RU').format(totalTurnover)} руб.
        </Typography>
      </Stack>
    </Stack>
  );
}

export default SuppliersInfo;

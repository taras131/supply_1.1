import React, { FC, useEffect, useId, useState } from "react";
import {
  FormControl,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useNavigate } from "react-router-dom";
import {shipmentTypes, transporters} from "../../../utils/const";
import {routes} from "../../../utils/routes";
import {IShipmentsInvoice, Transporter, TShipmentInvoiceValue, TShipmentsType} from "../../../models/iShipments";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectCurrentUser} from "../../users/model/selectors";

export interface IInvoiceValue {
  value: TShipmentInvoiceValue;
  title: string;
}

export const invoiceValues: IInvoiceValue[] = [
  { value: "partly", title: "Часть" },
  { value: "completely", title: "Весь" },
];

const ShipmentsAddNewPage: FC = () => {
  const dispatch = useAppDispatch();
  const matches_870 = useMediaQuery("(min-width:870px)");
  const matches_700 = useMediaQuery("(min-width:700px)");
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const [transporter, setTransporter] = useState<Transporter>(transporters[0]);
  const [type, setType] = useState<TShipmentsType>(shipmentTypes[0].name);
  const [filePatch, setFilePatch] = useState("");
  const [isUploadFileLoading, setIsUploadFileLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isValidate, setIsValidate] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<IShipmentsInvoice[]>([]);
  const [ladingNumber, setLadingNumber] = useState("");
  const selectTransporterId = useId();
  const selectTypeId = useId();
  useEffect(() => {
    if (transporter && type && !isUploadFileLoading && selectedInvoices.length > 0 && ladingNumber) {
      setIsValidate(true);
    } else {
      setIsValidate(false);
    }
  }, [transporter, type, filePatch, isUploadFileLoading, selectedInvoices, ladingNumber]);
  const handleChangeSelectedInvoices = (invoiceId: string) => {
    const isContains = selectedInvoices.find((invoice) => invoice.invoiceId === invoiceId) !== undefined;
    if (isContains) {
      setSelectedInvoices((prev) => [...prev.filter((shipment) => shipment.invoiceId !== invoiceId)]);
    } else {
      setSelectedInvoices((prev) => [...prev, { invoiceId: invoiceId, volume: "completely" }]);
    }
  };
  const handleValueChange = (invoiceId: string, newValue: TShipmentInvoiceValue) => {
    setSelectedInvoices((prev) => [
      ...prev.map((selectedInvoice) => {
        if (selectedInvoice.invoiceId === invoiceId) {
          return { ...selectedInvoice, volume: newValue };
        } else {
          return selectedInvoice;
        }
      }),
    ]);
  };
  const transporterList = transporters.map((transporter) => (
    <MenuItem key={transporter} value={transporter}>
      {transporter}
    </MenuItem>
  ));
  const typeList = shipmentTypes.map((type) => (
    <MenuItem key={type.name} value={type.name}>
      {type.value}
    </MenuItem>
  ));
  const handleAddClick = () => {
/*    dispatch(
      fetchAddShipment({
        author: {
          userId: user.id,
          dateCreating: getDateInMilliseconds(),
        },
        receiving: {
          userId: "",
          dateCreating: 0,
          isReceived: false,
        },
        ladingNumber: ladingNumber,
        ladingNumberFilePath: filePatch,
        transporter: transporter,
        type: type,
        invoicesList: selectedInvoices,
      }),
    );
    setFilePatch("");
    setFileName("");
    setTransporter(transporters[0]);
    setType(shipmentTypes[0].name);
    setIsValidate(false);
    setSelectedInvoices([]);
    setLadingNumber("");
    navigate(routes.shipments);*/
  };
  const handleTransporterChange = (e: SelectChangeEvent) => {
    setTransporter(e.target.value as Transporter);
  };
  const handleTypeChange = (e: SelectChangeEvent) => {
    setType(e.target.value as TShipmentsType);
  };
  const updateFile = (name: string, filePatch: string) => {
    setFileName(name);
    setFilePatch(filePatch);
  };
  const handleChangeInputFile = (e: any) => {
    setIsUploadFileLoading(true);
   /* if (filePatch) {
      dispatch(fetchRemoveFile(fileName));
    }*/
/*    dispatch(
      fetchUploadFile({
        file: e.target.files[0],
        updateFile: updateFile,
        setIsUpdateFileLoading: setIsUploadFileLoading,
      }),
    );*/
    setFileName(e.target.files[0].name);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLadingNumber(e.target.value);
  };
  const handleBackClick = () => {
    navigate(routes.shipments);
  };
  return (
    <Stack maxWidth={1000}>
    {/*  <PageHeaderWithTitleAndTwoButtons
        leftButtonText={"Назад"}
        rightButtonText={"Сохранить"}
        title={"Новая отгрузка"}
        handleLeftButtonClick={handleBackClick}
        handleRightButtonClick={handleAddClick}
        isRightButtonDisabled={!isValidate}
      />*/}
      <Paper sx={{ maxWidth: "1000px", width: "100%", padding: matches_700 ? "20px" : "4px" }}>
        <Stack spacing={2} sx={{ width: "100%" }} pt={2}>
          <Stack >
            <Stack spacing={1}>
              <Typography color="gray" fontWeight={600}>
                Перевозчик:
              </Typography>
            </Stack>
            <Stack >
              <FormControl fullWidth sx={{ width: "100%" }}>
                <Select
                  id={selectTransporterId}
                  defaultValue={""}
                  value={transporter}
                  onChange={handleTransporterChange}
                  sx={{ overflow: "hidden" }}
                  variant={"standard"}
                >
                  {transporterList}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
          <Stack  sx={{ width: "100%" }} alignItems="center">
            <Stack spacing={1}>
              <Typography color="gray" fontWeight={600}>
                Транспортная накладная №
              </Typography>
            </Stack>
            <Stack >
              <TextField value={ladingNumber} fullWidth onChange={handleInputChange} name="ladingNumber" />
            </Stack>
          </Stack>
          <Stack  sx={{ width: "100%" }} alignItems="center">
            <Stack  spacing={1}>
              <Typography color="gray" fontWeight={600}>
                Тип перевозки:
              </Typography>
            </Stack>
            <Stack >
              <FormControl fullWidth sx={{ width: "100%" }}>
                <Select
                  id={selectTypeId}
                  defaultValue={""}
                  value={type}
                  onChange={handleTypeChange}
                  sx={{ overflow: "hidden" }}
                  variant={"standard"}
                >
                  {typeList}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
          <Stack  sx={{ width: "100%" }} alignItems="center">
            <Stack spacing={1}>
              <Typography color="gray" fontWeight={600}>
                Транспортная накладная:
              </Typography>
            </Stack>
            <Stack >
              <LoadingButton
                sx={{ height: "56px" }}
                variant="outlined"
                component="label"
                loading={isUploadFileLoading}
                fullWidth
                startIcon={fileName ? <AutorenewIcon /> : <AttachFileIcon />}
              >
                {fileName ? "Заменить накладную" : "Прикрепить накладную"}
                <input type="file" hidden onChange={handleChangeInputFile} />
              </LoadingButton>
              <Typography mt={1}>{fileName ? fileName : ""}</Typography>
            </Stack>
          </Stack>
{/*          <ShipmentsAddNewInvoiceList
            selectedInvoices={selectedInvoices}
            handleChangeSelectedInvoices={handleChangeSelectedInvoices}
            handleValueChange={handleValueChange}
          />*/}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ShipmentsAddNewPage;

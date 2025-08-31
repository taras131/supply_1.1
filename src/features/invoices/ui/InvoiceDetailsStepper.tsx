import React, {FC, useEffect, useState} from "react";
import {Stack, Step, StepLabel, Stepper, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {defaultInvoice, IInvoice} from "../../../models/iInvoices";
import {convertMillisecondsToDate} from "../../../utils/services";
import Card from "@mui/material/Card";
import {useAppSelector} from "../../../hooks/redux";
import {selectInvoicesIsLoading} from "../model/selectors";
import CircularProgress from "@mui/material/CircularProgress";
import CancelInvoiceButtons from "./CancelInvoiceButtons";

interface IProps {
    invoice: IInvoice | null;
}

const InvoiceDetailsStepper: FC<IProps> = ({invoice}) => {
    const [activeStep, setActiveStep] = useState(0);
    const isLoading = useAppSelector(selectInvoicesIsLoading)
    const delay = (time: number) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    };
    const {
        approved_is_approved, paid_is_paid, shipments, author_date, author,
        cancel_is_cancel, cancel_date, approved_date, cancel_user, approved_user,
        paid_date, paid_user
    } = invoice ? invoice : defaultInvoice;
    useEffect(() => {
        setActiveStep(0);
        delay(400)
            .then(() => {
                if (approved_is_approved) {
                    setActiveStep(1);
                }
                return delay(400);
            })
            .then(() => {
                if (paid_is_paid) {
                    setActiveStep(2);
                }
                return delay(400);
            })
            .then(() => {
                if (shipments && shipments.length > 0) {
                    setActiveStep(3);
                }
                return delay(400);
            })
            .then(() => {
                if (shipments && shipments[0] && shipments[0].receiving_is_receiving) {
                    setActiveStep(4);
                }
            });
    }, [approved_is_approved, paid_is_paid, shipments]);
    if (!invoice) return null;
    return (
        <Card sx={{padding: "24px"}}>
            {isLoading
                ? (<Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <CircularProgress/>
                </Box>)
                : (<Stack direction="row" justifyContent={"space-between"}>
                    <Stepper activeStep={activeStep} orientation={"vertical"} sx={{height: "100%"}}>
                        <Step key={"Добавлен"}>
                            <StepLabel>
                                <Box ml={2}>
                                    <Typography fontSize={"16px"} fontWeight={550}>
                                        {`Добавлен ${convertMillisecondsToDate(author_date)}`}
                                    </Typography>
                                    <Typography fontSize={"16px"} fontWeight={500}>
                                        {author ? `${author.first_name} ${author.middle_name}` : ""}
                                    </Typography>
                                </Box>
                            </StepLabel>
                        </Step>
                        <Step key={"Одобрен"}>
                            <StepLabel error={cancel_is_cancel}>
                                <Box ml={2}>
                                    <Typography fontSize={"16px"} fontWeight={550}>
                                        {cancel_is_cancel
                                            ? `Отменён ${convertMillisecondsToDate(cancel_date || 0)}`
                                            : `Одобрен ${convertMillisecondsToDate(approved_date || 0)}`}
                                    </Typography>
                                    <Typography fontSize={"16px"} fontWeight={500}>
                                        {cancel_is_cancel
                                            ? cancel_user ? `${cancel_user.first_name} ${cancel_user.middle_name}` : ""
                                            : approved_user ? `${approved_user.first_name} ${approved_user.middle_name}` : ""}
                                    </Typography>
                                </Box>
                            </StepLabel>
                        </Step>
                        <Step key={"Оплачен"}>
                            <StepLabel>
                                <Box ml={2}>
                                    <Typography fontSize={"16px"} fontWeight={550}>
                                        {paid_date
                                            ? `Оплачен ${convertMillisecondsToDate(paid_date)}`
                                            : "Оплачен"}
                                    </Typography>
                                    <Typography fontSize={"16px"} fontWeight={500}>
                                        {paid_user ? `${paid_user.first_name} ${paid_user.middle_name}` : ""}
                                    </Typography>
                                </Box>
                            </StepLabel>
                        </Step>
                        <Step key={"Отгружен"}>
                            <StepLabel>
                                <Box ml={2}>
                                    <Typography fontSize={"16px"} fontWeight={550}>
                                        {shipments && shipments[0]
                                            ? `Отгружен ${shipments[0].created_at}`
                                            : "Отгружен"}

                                    </Typography>
                                    <Typography fontSize={"16px"} fontWeight={500}>
                                        {shipments && shipments[0]
                                            ? `${shipments[0].created_at}`
                                            : ""}
                                    </Typography>
                                </Box>
                            </StepLabel>
                        </Step>
                        <Step key={"Получен"}>
                            <StepLabel>
                                <Box ml={2}>
                                    <Typography fontSize={"16px"} fontWeight={550}>
                                        {shipments && shipments[0]
                                            ? `Получен ${shipments && shipments[0].receiving_date}`
                                            : "Получен"}
                                    </Typography>
                                    <Typography fontSize={"16px"} fontWeight={500}>
                                        {shipments && shipments[0] && shipments[0].author
                                            ? `${shipments[0].author?.first_name} ${shipments[0].author?.middle_name}`
                                            : ""}
                                    </Typography>
                                </Box>
                            </StepLabel>
                        </Step>
                    </Stepper>
                    <Box>
                        <CancelInvoiceButtons invoice={invoice}/>
                    </Box>
                </Stack>)}
        </Card>
    );
};
export default InvoiceDetailsStepper;

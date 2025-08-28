import React, {FC, useEffect, useState} from "react";
import {Step, StepLabel, Stepper, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {IInvoice} from "../../../models/iInvoices";
import {IShipments} from "../../../models/iShipments";

interface IProps {
    invoice: IInvoice;
    shipment: IShipments | false;
}

const InvoiceDetailsStepper: FC<IProps> = ({invoice, shipment}) => {
    const [activeStep, setActiveStep] = useState(0);
    const delay = (time: number) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    };
    useEffect(() => {
        setActiveStep(0);
        delay(400)
            .then(() => {
                if (invoice.approved_is_approved) {
                    setActiveStep(1);
                }
                return delay(400);
            })
            .then(() => {
                if (invoice.paid_is_paid) {
                    setActiveStep(2);
                }
                return delay(400);
            })
            .then(() => {
                if (invoice.shipments && invoice.shipments.length > 0) {
                    setActiveStep(3);
                }
                return delay(400);
            })
            .then(() => {
                if (invoice.shipments && invoice.shipments[0]?.receiving_is_receiving) {
                    setActiveStep(4);
                }
            });
    }, [invoice]);
    return (
        <Stepper activeStep={activeStep} orientation={"vertical"} sx={{height: "100%"}}>
            <Step key={"Добавлен"}>
                <StepLabel>
                    <Box ml={2}>
                        <Typography fontSize={"16px"} fontWeight={550}>
                            {`Добавлен ${invoice.author_date}`}
                        </Typography>
                        <Typography fontSize={"16px"} fontWeight={500}>
                            {invoice.author && `${invoice.author.first_name} ${invoice.author.middle_name}`}
                        </Typography>
                    </Box>
                </StepLabel>
            </Step>
            <Step key={"Одобрен"}>
                <StepLabel error={invoice.cancel_is_cancel}>
                    <Box ml={2}>
                        <Typography fontSize={"16px"} fontWeight={550}>
                            {invoice.cancel_is_cancel
                                ? `Отменён ${invoice.cancel_date}`
                                : `Одобрен ${invoice.approved_date}`}
                        </Typography>
                        <Typography fontSize={"16px"} fontWeight={500}>
                            {invoice.cancel_is_cancel
                                ? invoice.cancel_user && `${invoice.cancel_user.first_name} ${invoice.cancel_user.middle_name}`
                                : invoice.approved_user && `${invoice.approved_user.first_name} ${invoice.approved_user.middle_name}`}
                        </Typography>
                    </Box>
                </StepLabel>
            </Step>
            <Step key={"Оплачен"}>
                <StepLabel>
                    <Box ml={2}>
                        <Typography fontSize={"16px"} fontWeight={550}>
                            {`Оплачен ${invoice.paid_date}`}
                        </Typography>
                        <Typography fontSize={"16px"} fontWeight={500}>
                            {invoice.paid_user && `${invoice.paid_user.first_name} ${invoice.paid_user.middle_name}`}
                        </Typography>
                    </Box>
                </StepLabel>
            </Step>
            <Step key={"Отгружен"}>
                <StepLabel>
                    <Box ml={2}>
                        <Typography fontSize={"16px"} fontWeight={550}>
                            {`Отгружен ${invoice.shipments && invoice.shipments[0].created_at}`}
                        </Typography>
                        <Typography fontSize={"16px"} fontWeight={500}>
                            {invoice.shipments &&
                                `${invoice.shipments[0].author?.first_name} ${invoice.shipments[0].author?.middle_name}`}
                        </Typography>
                    </Box>
                </StepLabel>
            </Step>
            <Step key={"Получен"}>
                <StepLabel>
                    <Box ml={2}>
                        <Typography fontSize={"16px"} fontWeight={550}>
                            {`Получен ${invoice.shipments && invoice.shipments[0].receiving_date}`}
                        </Typography>
                        <Typography fontSize={"16px"} fontWeight={500}>
                            {invoice.shipments && `${invoice.shipments[0].author?.first_name} ${invoice.shipments[0].author?.middle_name}`}
                        </Typography>
                    </Box>
                </StepLabel>
            </Step>
        </Stepper>
    );
};
export default InvoiceDetailsStepper;

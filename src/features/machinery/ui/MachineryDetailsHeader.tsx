import React, {FC} from "react";
import {Stack} from "@mui/material";
import {useAppSelector} from "../../../hooks/redux";
import {getCurrentMachineryTitle} from "../model/selectors";
import MachineryStatusButtons from "./MachineryStatusButtons";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";
import BackButton from "../../../components/common/BackButton";

const MachineryDetailsHeader: FC = () => {
    const title = useAppSelector(getCurrentMachineryTitle);
    return (
        <PageHeaderTemplate title={title}>
            <Stack direction="row" spacing={2}>
                <BackButton/>
                <MachineryStatusButtons/>
            </Stack>
        </PageHeaderTemplate>
    );
};

export default MachineryDetailsHeader;

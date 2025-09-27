import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {routes} from "../../../utils/routes";
import {Link} from "react-router-dom";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";

const MachineryPageHeader = () => {
    return (
        <PageHeaderTemplate title={"Техника"}>
            <Button
                component={Link}
                to={routes.addNewMachinery}
                startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                variant="contained"
            >
                Добавить
            </Button>
        </PageHeaderTemplate>
    );
};

export default MachineryPageHeader;

import React, {useState} from 'react';
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TechnicalLiteratureAddNew from "./TechnicalLiteratureAddNew";

const TechnicalLiteraturePageHeader = () => {
    const [isOpenAddDrawer, setIsOpenAddDrawer] = useState(false);
    const toggleIsOpenAddDrawer = () => {
        setIsOpenAddDrawer((prev) => !prev);
    };
    return (
        <PageHeaderTemplate title={"Техническая литература"}>
            <Button
                startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                variant="contained"
                onClick={toggleIsOpenAddDrawer}
            >
                Добавить
            </Button>
            <TechnicalLiteratureAddNew isOpen={isOpenAddDrawer} onClose={toggleIsOpenAddDrawer}/>
        </PageHeaderTemplate>
    );
};

export default TechnicalLiteraturePageHeader;
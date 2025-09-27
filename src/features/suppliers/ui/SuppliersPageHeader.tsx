import React, {FC} from 'react';
import AddIcon from '@mui/icons-material/Add';
import MyButton from "../../../styles/theme/customizations/MyButton";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";

interface IProps {
    handleAddClick: () => void;
}

const SuppliersPageHeader: FC<IProps> = ({
                                             handleAddClick,
                                         }) => {
    return (
        <PageHeaderTemplate title={"Поставщики"}>
            <MyButton onClick={handleAddClick}
                      startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                      variant="contained">
                Добавить
            </MyButton>
        </PageHeaderTemplate>
    );
};

export default SuppliersPageHeader;

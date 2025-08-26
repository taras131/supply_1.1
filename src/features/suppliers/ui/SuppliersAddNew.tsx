import React, { FC, useEffect, useState } from 'react';
import { Button, Drawer, Stack, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { useAppDispatch } from '../../../hooks/redux';
import { fetchAddSupplier, fetchCompanyDataByInn } from '../model/actions';
import SupplierView from './SupplierView';
import { useEditor } from '../../../hooks/useEditor';
import { emptySupplier, INewSupplier } from '../../../models/iSuppliers';
import { supplierValidate } from '../../../utils/validators';
import { setSupplierDate } from '../utils/services';

interface IProps {
  isOpen: boolean;
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const SupplierAddNew: FC<IProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { editedValue, errors, handleFieldChange, setEditedValue, validateValue } =
    useEditor<INewSupplier>({
      initialValue: emptySupplier,
      validate: supplierValidate,
    });
  useEffect(() => {
    const fetchData = async () => {
      if (`${editedValue.INN}`.length > 9 && `${editedValue.INN}`.length < 13) {
        setIsLoading(true);
        const res = await fetchCompanyDataByInn(+editedValue.INN);
        if (res && res[0]) {
          setEditedValue({ ...setSupplierDate(res[0]), INN: editedValue.INN });
        }
      }
      setIsLoading(false);
    };
    void fetchData();
  }, [editedValue.INN]);
  useEffect(() => {
    validateValue();
  }, [editedValue.name]);
  const saveClickHandler = (e: React.MouseEvent) => {
    dispatch(fetchAddSupplier({ ...editedValue }));
    onClose(e);
  };
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box
        sx={{
          padding: '16px',
          maxWidth: '500px',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <Typography variant="h5" color="primary" fontSize={18} fontWeight={500} mb={2}>
          Новый поставщик
        </Typography>
        <SupplierView
          supplier={editedValue}
          fieldChangeHandler={handleFieldChange}
          errors={errors}
          isEditMode
        />
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button onClick={onClose} variant="outlined">
            Назад
          </Button>
          <LoadingButton
            onClick={saveClickHandler}
            loading={isLoading}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!!Object.keys(errors).length}
            color="success"
          >
            Сохранить
          </LoadingButton>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default SupplierAddNew;

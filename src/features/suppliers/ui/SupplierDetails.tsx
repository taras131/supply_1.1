import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Drawer, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useEditor } from '../../../hooks/useEditor';
import { supplierValidate } from '../../../utils/validators';
import { selectCurrentSupplier } from '../model/selectors';
import { defaultSupplier, ISupplier } from '../../../models/iSuppliers';
import { setCurrentSupplier } from '../model/slice';
import { fetchUpdateSupplier } from '../model/actions';
import SupplierView from './SupplierView';
import ButtonsEditCancelSave from '../../../components/common/ButtonsEditCancelSave';

function SupplierDetails() {
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const currentSupplier = useAppSelector(selectCurrentSupplier);
  const { editedValue, errors, handleFieldChange, setEditedValue } = useEditor<ISupplier>({
    initialValue: currentSupplier || defaultSupplier,
    validate: supplierValidate,
  });
  useEffect(() => {
    if (currentSupplier) {
      setEditedValue(currentSupplier);
    }
  }, [setEditedValue, currentSupplier]);
  if (!currentSupplier) return null;
  const onClose = () => {
    dispatch(setCurrentSupplier(null));
  };
  const toggleIsEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const saveClickHandler = () => {
    dispatch(fetchUpdateSupplier(editedValue));
    toggleIsEditMode();
  };
  const cancelUpdateHandler = () => {
    toggleIsEditMode();
    setEditedValue(currentSupplier);
  };
  return (
    <Drawer anchor="right" open={!!currentSupplier} onClose={onClose}>
      <Box
        sx={{
          padding: '28px',
          width: '500px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <Typography variant="h5" color="primary" fontSize={18} fontWeight={500} mb={2}>
          Поставщик
        </Typography>
        <SupplierView
          supplier={editedValue}
          fieldChangeHandler={handleFieldChange}
          errors={errors}
          isEditMode={isEditMode}
        />
        <ButtonsEditCancelSave
          isEditMode={isEditMode}
          isValid={!Object.keys(errors).length}
          toggleIsEditMode={toggleIsEditMode}
          updateHandler={saveClickHandler}
          cancelUpdateHandler={cancelUpdateHandler}
        />
      </Box>
    </Drawer>
  );
}

export default SupplierDetails;

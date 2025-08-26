import React, {useEffect, useState} from 'react';
import {Stack} from '@mui/material';
import SuppliersPageHeader from './SuppliersPageHeader';
import {fetchGetSupplierById, fetchGetSuppliers} from '../model/actions';
import SuppliersTable from './SuppliersTable';
import SupplierAddNew from './SuppliersAddNew';
import {ISupplier} from '../../../models/iSuppliers';
import SupplierDetails from './SupplierDetails';
import ASuppliersMigration from './ASuppliersMigration';
import {useAppDispatch} from "../../../hooks/redux";

function SuppliersPage() {
    const dispatch = useAppDispatch();
    const [isOpenAddDrawer, setIsOpenAddDrawer] = useState(false);
    const toggleIsOpenAddDrawer = () => {
        setIsOpenAddDrawer((prev) => !prev);
    };
    useEffect(() => {
        dispatch(fetchGetSuppliers());
    }, [dispatch]);
    const supplierClickHandler = (supplier: ISupplier) => {
        dispatch(fetchGetSupplierById(supplier.id));
    };
    return (
        <Stack sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
            pt: 1.5,
        }}>
            <SuppliersPageHeader
                handleAddClick={toggleIsOpenAddDrawer}
            />
            <SuppliersTable supplierClickHandler={supplierClickHandler}/>
            {isOpenAddDrawer && (
                <SupplierAddNew isOpen={isOpenAddDrawer} onClose={toggleIsOpenAddDrawer}/>
            )}
            <SupplierDetails/>
            <ASuppliersMigration/>
        </Stack>
    );
}

export default SuppliersPage;

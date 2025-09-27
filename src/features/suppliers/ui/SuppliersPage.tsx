import React, {useEffect, useState} from 'react';
import SuppliersPageHeader from './SuppliersPageHeader';
import {fetchGetSupplierById, fetchGetSuppliers} from '../model/actions';
import SuppliersTable from './SuppliersTable';
import SupplierAddNew from './SuppliersAddNew';
import {ISupplier} from '../../../models/iSuppliers';
import SupplierDetails from './SupplierDetails';
import ASuppliersMigration from './ASuppliersMigration';
import {useAppDispatch} from "../../../hooks/redux";
import PageTemplate from "../../../components/templates/PageTemplate";

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
        <PageTemplate>
            <SuppliersPageHeader
                handleAddClick={toggleIsOpenAddDrawer}
            />
            <SuppliersTable supplierClickHandler={supplierClickHandler}/>
            {isOpenAddDrawer && (
                <SupplierAddNew isOpen={isOpenAddDrawer} onClose={toggleIsOpenAddDrawer}/>
            )}
            <SupplierDetails/>
            <ASuppliersMigration/>
        </PageTemplate>
    );
}

export default SuppliersPage;

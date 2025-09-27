import React, {useEffect} from "react";
import {useAppDispatch} from "../../../hooks/redux";
import ShipmentsHelper from "./ShipmentsHelper";
import ShipmentsPageHeader from "./ShipmentsPageHeader";
import {fetchGetAllShipment} from "../model/actions";
import AShipmentsMigration from "./AShipmentsMigration";
import ShipmentsSection from "./ShipmentsSection";
import PageTemplate from "../../../components/templates/PageTemplate";


const ShipmentsPage = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchGetAllShipment());
    }, [dispatch]);
    return (
        <PageTemplate>
            <ShipmentsPageHeader/>
            <ShipmentsSection/>
            <ShipmentsHelper/>
            <AShipmentsMigration/>
        </PageTemplate>
    );
};

export default ShipmentsPage;

import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IShipments, Transporter, TShipmentsType} from "../../../models/iShipments";
import {ALL} from "../../../utils/const";


interface IShipmentsState {
    list: IShipments[];
    isLoading: boolean;
    errorMessage: string;
    transporterFilter: Transporter | typeof ALL;
    shipmentTypeFilter: TShipmentsType | typeof ALL;
    search: string;
}

const initialState: IShipmentsState = {
    list: [],
    isLoading: false,
    errorMessage: "",
    transporterFilter: ALL,
    shipmentTypeFilter: ALL,
    search: "",
};

export const ShipmentSlice = createSlice({
    name: "shipments",
    initialState,
    reducers: {
        setShipments: (state, action: PayloadAction<IShipments[]>) => {
            state.list = action.payload;
        },
        setShipmentsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setTransporterFilter: (state, action: PayloadAction<Transporter | typeof ALL>) => {
            state.transporterFilter = action.payload;
        },
        setShipmentTypeFilter: (state, action: PayloadAction<TShipmentsType | typeof ALL>) => {
            state.shipmentTypeFilter = action.payload;
        },
        setShipmentSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
    },

});


export const {setShipments, setShipmentsLoading, setTransporterFilter, setShipmentTypeFilter, setShipmentSearch} =
    ShipmentSlice.actions;

export default ShipmentSlice.reducer;

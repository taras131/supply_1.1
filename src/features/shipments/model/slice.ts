import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IShipments, IShipmentsStatistics, Transporter, TShipmentsType} from "../../../models/iShipments";
import {ALL} from "../../../utils/const";
import {
    fetchAddShipment,
    fetchGetAllShipment,
    fetchGetShipmentsStatistics,
    fetchUpdateShipment,
    fetchUpdateShipmentInvoices
} from "./actions";

interface IShipmentsState {
    list: IShipments[];
    isLoading: boolean;
    errorMessage: string;
    transporterFilter: Transporter | typeof ALL;
    shipmentTypeFilter: TShipmentsType | typeof ALL;
    search: string;
    statistics: IShipmentsStatistics | null;
}

const initialState: IShipmentsState = {
    list: [],
    isLoading: false,
    errorMessage: "",
    transporterFilter: ALL,
    shipmentTypeFilter: ALL,
    search: "",
    statistics: null,
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
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddShipment.fulfilled, (state, action: PayloadAction<IShipments>) => {
                state.list = [action.payload, ...state.list]
                state.isLoading = false
            })
            .addCase(fetchGetAllShipment.fulfilled, (state, action: PayloadAction<IShipments[]>) => {
                state.list = action.payload.sort((a, b) => {
                    return b.author_date - a.author_date
                })
                state.isLoading = false
            })
            .addCase(fetchUpdateShipment.fulfilled, (state, action: PayloadAction<IShipments>) => {
                state.list = state.list.map(shipment => shipment.id === action.payload.id
                    ? action.payload
                    : shipment
                )
                state.isLoading = false
            })
            .addCase(fetchUpdateShipmentInvoices.fulfilled, (state, action: PayloadAction<IShipments>) => {
                state.list = [...state.list.map(shipment => shipment.id === action.payload.id
                    ? action.payload
                    : shipment
                )]
                state.isLoading = false
            })
            .addCase(fetchGetShipmentsStatistics.fulfilled, (state, action: PayloadAction<IShipmentsStatistics>) => {
                state.statistics = action.payload;
                state.isLoading = false
            })
            .addCase(fetchAddShipment.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchGetAllShipment.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchUpdateShipment.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchGetShipmentsStatistics.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchAddShipment.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(fetchGetAllShipment.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(fetchUpdateShipment.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(fetchGetShipmentsStatistics.rejected, (state) => {
                state.isLoading = false
            })
    }

});


export const {setShipments, setShipmentsLoading, setTransporterFilter, setShipmentTypeFilter, setShipmentSearch} =
    ShipmentSlice.actions;

export default ShipmentSlice.reducer;

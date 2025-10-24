import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/model/slice";
import MessageReducer from "../features/messages/model/slice";
import usersReducer from "../features/users/model/slice";
import companiesReducer from "../features/companies/model/slice";
import filesReducer from "../features/files/model/slice";
import SuppliersReducer from "../features/suppliers/model/slice";
import InvoicesReducer from "../features/invoices/model/slice";
import shipmentsReducer from "../features/shipments/model/slice";
import ordersReducer from "../features/orders/model/slice";
import ordersPositionsReducer from "../features/orders_positions/model/slice";
import machineryReducer from "../features/machinery/model/slice";
import machineryDocsReducer from "../features/machinery_docs/model/slice";
import machineryProblemsReducer from "../features/machinery_problems/model/slice";
import machineryTasksReducer from "../features/machinery_tasks/model/slice";
import machineryCommentsReducer from "../features/machinery_comments/model/slice";
import invoicesCommentsReducer from "../features/invoices_comments/model/slice";
import technicalLiteratureReducer from "../features/technical_literature/model/slice";

const rootReducer = combineReducers({
    invoices: InvoicesReducer,
    invoicesComments: invoicesCommentsReducer,
    suppliers: SuppliersReducer,
    message: MessageReducer,
    auth: authReducer,
    shipments: shipmentsReducer,
    orders: ordersReducer,
    ordersPositions: ordersPositionsReducer,
    machinery: machineryReducer,
    machineryDocs: machineryDocsReducer,
    machineryProblems: machineryProblemsReducer,
    machineryTasks: machineryTasksReducer,
    machineryComments: machineryCommentsReducer,
    users: usersReducer,
    files: filesReducer,
    companies: companiesReducer,
    technicalLiterature: technicalLiteratureReducer,
});
export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        /*    middleware: (getDefaultMiddleware) =>
                  getDefaultMiddleware().concat(machineryWebsocketMiddleware),*/
    });
};
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

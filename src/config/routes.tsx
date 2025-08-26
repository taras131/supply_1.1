import React from "react";
import {routes} from "../utils/routes";
/*import Invoices from "../features/invoices/ui/Invoices";*/
import {Navigate} from "react-router-dom";
/*import InvoiceDetails from "../features/invoices/ui/InvoiceDetails";
import InvoicesAddNew from "../features/invoices/ui/InvoicesAddNew";
import Shipments from "../features/shipments/ui/Shipments";
import ShipmentsAddNew from "../features/shipments/ui/ShipmentsAddNew";*/
import UsersPage from "../features/users/ui/UsersPage";
import Profile from "../features/auth/ui/Profile";
/*import MachineryPage from "../features/machinery/ui/MachineryPage";
import MachineryDetailsPage from "../features/machinery/ui/MachineryDetailsPage";
import MachineryAddNewPage from "../features/machinery/ui/MachineryAddNewPage";
import TaskAddNewPage from "../features/machinery_tasks/ui/TaskAddNewPage";
import TaskDetailsPage from "../features/machinery_tasks/ui/TaskDetailsPage";
import SigInPage from "../features/auth/ui/SigInPage";
import RegisterPage from "../features/auth/ui/RegisterPage";
import ProblemsPage from "../features/machinery_problems/ui/ProblemsPage";
import TasksPage from "../features/machinery_tasks/ui/TasksPage";
import MachineryCommentsPage from "../features/machinery_comments/ui/MachineryCommentsPage";
import MachineryMaintenancePage from "../features/machinery/ui/MachineryMaintenancePage";
import SuppliersPage from "../features/suppliers/ui/SuppliersPage";*/
import OrdersPage from "../features/orders/ui/OrdersPage";
import OrderDetailsPage from "../features/orders/ui/OrderDetailsPage";
import OrdersAddNewPage from "../features/orders/ui/OrdersAddNewPage";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LoginForm from "../features/auth/ui/LoginForm";
import RegisterForm from "../features/auth/ui/RegisterForm";
import TaskDetailsPage from "../features/machinery_tasks/ui/TaskDetailsPage";
import MachineryPage from "../features/machinery/ui/MachineryPage";
import ProblemsPage from "../features/machinery_problems/ui/ProblemsPage";
import MachineryCommentsPage from "../features/machinery_comments/ui/MachineryCommentsPage";
import MachineryDetailsPage from "../features/machinery/ui/MachineryDetailsPage";
import MachineryAddNewPage from "../features/machinery/ui/MachineryAddNewPage";
import TaskAddNewPage from "../features/machinery_tasks/ui/TaskAddNewPage";
import TasksPage from "../features/machinery_tasks/ui/TasksPage";
import MachineryMaintenancePage from "../features/machinery/ui/MachineryMaintenancePage";
import SuppliersPage from "../features/suppliers/ui/SuppliersPage";
import InvoicesPage from "../features/invoices/ui/InvoicesPage";
import InvoiceAddNewPage from "../features/invoices/ui/InvoiceAddNewPage";
import InvoiceDetailsPage from "../features/invoices/ui/InvoiceDetailsPage";

export interface IRouteConfig {
    icon: React.ReactNode;
    path: string;
    element: React.ReactNode;
    label: string; // Название для меню
    showInMenu?: boolean; // Показывать в меню или нет
    children?: IRouteConfig[];
}

export const routesConfig: IRouteConfig[] = [
    /* {icon: <HomeRoundedIcon />, path: routes.main, element:  <MainGrid />, label: "Главная", showInMenu: true},*/
    {icon: <HomeRoundedIcon/>, path: routes.invoices, element: <InvoicesPage/>, label: "Счета", showInMenu: true},
    {
        icon: <HomeRoundedIcon/>,
        path: routes.invoicesDetails,
        element: <InvoiceDetailsPage/>,
        label: "Подробности",
        showInMenu: false
    },
    {
        icon: <HomeRoundedIcon/>,
        path: routes.invoicesAddNew,
        element: <InvoiceAddNewPage/>,
        label: "Новый счёт",
        showInMenu: false
    },
    {
        icon: <HomeRoundedIcon/>,
        path: routes.suppliers,
        element: <SuppliersPage/>,
        label: "Поставщики",
        showInMenu: true
    },
    /*  {path: routes.shipments, element: <Shipments/>, label: "Отгрузки", showInMenu: true},*/
    /*   {path: routes.addNewShipments, element: <ShipmentsAddNew/>, label: "Новая отгрузка", showInMenu: false},*/
    {icon: <HomeRoundedIcon/>, path: routes.orders, element: <OrdersPage/>, label: "Заявки", showInMenu: true},
    {
        icon: <HomeRoundedIcon/>,
        path: routes.ordersAddNew,
        element: <OrdersAddNewPage/>,
        label: "Новая заявка",
        showInMenu: false
    },
    {
        icon: <HomeRoundedIcon/>,
        path: routes.ordersDetails,
        element: <OrderDetailsPage/>,
        label: "Подробности",
        showInMenu: false
    },
    {icon: <HomeRoundedIcon/>, path: routes.users, element: <UsersPage/>, label: "Сотрудники", showInMenu: true},
    {icon: <HomeRoundedIcon/>, path: routes.login, element: <LoginForm/>, label: "Вход", showInMenu: false},
    {
        icon: <HomeRoundedIcon/>,
        path: routes.register,
        element: <RegisterForm/>,
        label: "Регистрация",
        showInMenu: false
    },
    {icon: <HomeRoundedIcon/>, path: routes.profile, element: <Profile/>, label: "Профиль", showInMenu: false},
    {icon: <HomeRoundedIcon/>, path: routes.machinery, element: <MachineryPage/>, label: "Техника", showInMenu: true},
    {
        icon: <HomeRoundedIcon/>,
        path: routes.machineryMaintenance,
        element: <MachineryMaintenancePage/>,
        label: "Календарь ТО",
        showInMenu: true
    },
    {
        icon: <HomeRoundedIcon/>,
        path: routes.machineryProblems,
        element: <ProblemsPage/>,
        label: "Проблемы",
        showInMenu: true
    },
    {icon: <HomeRoundedIcon/>, path: routes.machineryTasks, element: <TasksPage/>, label: "Задачи", showInMenu: true,},
    {
        icon: <HomeRoundedIcon/>,
        path: routes.machineryComments,
        element: <MachineryCommentsPage/>,
        label: "Заметки",
        showInMenu: true
    },
    {
        icon: <HomeRoundedIcon/>,
        path: routes.machineryDetails,
        element: <MachineryDetailsPage/>,
        label: "Подробности",
        showInMenu: false
    },
    {
        icon: <HomeRoundedIcon/>,
        path: routes.addNewMachinery,
        element: <MachineryAddNewPage/>,
        label: "Новая техника",
        showInMenu: false
    },
    {
        icon: <HomeRoundedIcon/>,
        path: routes.machineryAddTask,
        element: <TaskAddNewPage/>,
        label: "Новая проблема",
        showInMenu: false
    },
    {
        icon: <HomeRoundedIcon/>,
        path: routes.machineryTaskDetails,
        element: <TaskDetailsPage/>,
        label: "Подробности задачи",
        showInMenu: false
    },
    {icon: <HomeRoundedIcon/>, path: "*", element: <Navigate to={routes.main}/>, label: "Not found", showInMenu: false},
];

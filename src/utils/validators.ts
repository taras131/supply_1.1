import {ICurrentMachinery, INewMachinery} from "../models/iMachinery";
import {INewTask} from "../models/IMachineryTasks";
import {ILoginData, IRegisterData} from "../models/iAuth";
import {INewCompany} from "../models/iCompanies";
import {IUser} from "../models/IUser";
import {INewMachineryDoc} from "../models/IMachineryDoc";
import {INewMachineryComment} from "../models/IMachineryComment";
import {INewSupplier, ISupplier} from "../models/iSuppliers";
import {IMachineryProblem, INewMachineryProblem} from "../models/IMachineryProblems";
import {INewOrder, IOrder} from "../models/iOrders";
import {IInvoice, INewInvoice} from "../models/iInvoices";
import {INewShipments, IShipments} from "../models/iShipments";
import {INewTechnicalLiterature, ITechnicalLiterature} from "../models/ITechnicalLiterature";

export type ValidationErrors = { [key: string]: string | null };

export const machineryValidate = (machinery: ICurrentMachinery | INewMachinery) => {
    const errors: ValidationErrors = {};
    if (machinery) {
        if (machinery.brand.trim().length < 2) errors.brand = "Марка должена быть не менее 2 символов";
        if (!machinery.brand) errors.brand = "Марка обязателена для заполнения";
        if (machinery.brand.trim().length > 32) errors.brand = "Марка должена быть длиннее 32 символов";
        if (machinery.model.trim().length < 2) errors.model = "Модель должна быть не менее 2 символов";
        if (!machinery.model) errors.model = "Модель обязательна для заполнения";
        if (machinery.model.trim().length > 32) errors.model = "Модель должна быть не длиннее 32 символов";
        if (machinery.type_id < 0) errors.type_id = "Выберите тип техники";
        if (machinery.engine_type_id < 0) errors.engine_type_id = "Выберите тип двигателя";
        if (machinery.year_manufacture === "-1") errors.year_manufacture = "Выберите год производства";
        // if (machinery.operating_type_id < 0) errors.operating_type_id = "Выберите еденицы измерения";
        if (machinery.vin.trim().length > 32) errors.vin = "VIN должен быть не длиннее 32 символов";
        if (machinery.state_number.trim().length > 32)
            errors.state_number = "Гос. номер должен быть не длиннее 32 символов";
        if (machinery.working_equipment.trim().length > 32)
            errors.working_equipment = "Поле должно быть не длиннее 32 символов";
        if (machinery.frame_number?.trim().length > 32) errors.frame_number = "Поле должно быть не длиннее 32 символов";
        if (machinery.engine_brand.trim().length > 32)
            errors.engine_brand = "Марка двигателя должна быть не длиннее 32 символов";
        if (machinery.engine_model.trim().length > 32)
            errors.engine_model = "Модель двигателя должна быть не длиннее 32 символов";
        if (machinery.transmission_brand.trim().length > 32)
            errors.transmission_brand = "Марка трансмиссии должна быть не длиннее 32 символов";
        if (machinery.transmission_model.trim().length > 32)
            errors.transmission_model = "Модель трансмиссии должна быть не длиннее 32 символов";
    }
    return errors;
};

export const docValidate = (doc: INewMachineryDoc) => {
    const errors: ValidationErrors = {};
    if (doc.title.length < 2) errors.title = "Название должно быть не менее 2 символов";
    if (doc.title.length > 32) errors.title = "Название должно быть не длиннее 32 символов";
    return errors;
};

export const commentValidate = <T extends { text: string }>(
    isShowMachineryInfo = false
) => (comment: T) => {
    const errors: ValidationErrors = {};

    if (comment.text.length < 5) errors.text = "Должно быть не менее 5 символов";

    // machinery_id только для machinery-комментариев
    if (
        isShowMachineryInfo &&
        "machinery_id" in comment &&
        comment.machinery_id === "-1"
    ) {
        errors.machinery_id = "Выберите технику";
    }

    return errors;
};

export const problemValidate = (problem: INewMachineryProblem | IMachineryProblem) => {
    const errors: ValidationErrors = {};
    if (problem.category_id < 0) errors.category_id = "Выберите категорию";
    if (+problem.operating === 0 && +problem.odometer === 0) {
        errors.operating = "Заполните км или часы";
        errors.odometer = "Заполните км или часы";
    }
    if (problem.operating > 1000000000) errors.operating = "Слишком большое значение";
    if (problem.odometer > 1000000000) errors.odometer = "Слишком большое значение";
    if (problem.title.length < 3) errors.title = "Не менее 3 символов";
    if (problem.title.length === 0) errors.title = "Заголовок должен быть";
    if (problem.title.length > 32) errors.title = "Не более 32 символов";
    if (problem.description.length === 0) errors.description = "Описание должно быть";
    if (problem.description.length < 3) errors.description = "Описание должно быть не менее 2 символов";
    if (problem.description.length > 400) errors.description = "Описание должно быть не длиннее 400 символов";
    return errors;
};

export const newTaskValidate = (task: INewTask) => {
    const errors: ValidationErrors = {};
    if (task.title.length < 3) errors.title = "Не менее 3 символов";
    if (task.title.length === 0) errors.title = "Заголовок должен быть";
    if (task.title.length > 32) errors.title = "Не более 32 символов";
    if (task.description.length === 0) errors.description = "Описание должно быть";
    if (task.description.length < 3) errors.description = "Описание должно быть не менее 2 символов";
    if (task.description.length > 400) errors.description = "Описание должно быть не длиннее 400 символов";
    if (task.priority_id < 0) errors.priority_id = "Выбирите приоритет";
    if (task.type_id < 0) errors.type_id = "Выбирите тип работ";
    if (task.machinery_id === "-1") errors.machinery_id = "Выбирите технику";
    if (task.type_id === 1 && !task.issue_odometer && !task.issue_operating) {
        errors.issue_odometer = "Заполните наработку или пробег";
        errors.issue_operating = "Заполните наработку или пробег";
    }
    return errors;
};

export const taskValidate = (task: INewTask) => {
    const errors: ValidationErrors = newTaskValidate(task);
    return errors;
};

export const loginValidate = (user: ILoginData) => {
    const errors: ValidationErrors = {};
    if (user.email.length === 0) {
        errors.email = "Email обязателен";
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(user.email)) {
            errors.email = "Некорректный формат email";
        } else if (user.email.length < 3) {
            errors.email = "Не менее 3 символов";
        }
    }
    if (user.password.length === 0) errors.password = "Пароль должен быть";
    if (user.password.length < 4) errors.password = "Пароль должен быть не короче 4 символов";
    if (user.password.length > 32) errors.password = "Пароль должен быть не длинее 32 символов";
    return errors;
};

export const registerValidate = (user: IRegisterData, companyName: string) => {
    const errors: ValidationErrors = loginValidate(user);
    if (user.first_name.length === 0) errors.first_name = "Имя должен быть";
    if (user.first_name.length < 2) errors.first_name = "Имя должен быть не короче 2 символов";
    if (user.first_name.length > 32) errors.first_name = "Имя должно быть не длинее 32 символов";
    if (user.middle_name.length === 0) errors.middle_name = "Отчество должено быть";
    if (user.middle_name.length < 2) errors.middle_name = "Отчество должено быть не короче 2 символов";
    if (user.middle_name.length > 32) errors.middle_name = "Отчество должно быть не длинее 32 символов";
    if (user.role_id < 1) errors.role_id = "Выберите роль";
    if (user.tab === "oldCompany") {
        if (!user.company_id || user.company_id.length < 2) {
            errors.company_id = "Укажите ключ существующей компании";
        } else if (!companyName) {
            // ← только так!
            errors.company_id = "Компания не найдена по введённому ключу";
        }
    }
    if (user.tab === "newCompany") {
        if (!user.company_name || user.company_name.length < 2) errors.company_name = "Укажите имя новой компании";
    }
    return errors;
};

export const companyValidate = (company: INewCompany) => {
    const errors: ValidationErrors = {};
    if (company.name.length < 2) errors.name = "Название должно быть не короче 2 символов";
    if (company.name.length > 40) errors.name = "Название должно быть не длинее 40 символов";
    return errors;
};

export const userUpdateValidate = (user: IUser) => {
    const errors: ValidationErrors = {};
    if (user.first_name.length === 0) errors.first_name = "Имя должен быть";
    if (user.first_name.length < 2) errors.first_name = "Имя должен быть не короче 2 символов";
    if (user.first_name.length > 32) errors.first_name = "Имя должно быть не длинее 32 символов";
    if (user.middle_name.length === 0) errors.middle_name = "Отчество должено быть";
    if (user.middle_name.length < 2) errors.middle_name = "Отчество должено быть не короче 2 символов";
    if (user.middle_name.length > 32) errors.middle_name = "Отчество должно быть не длинее 32 символов";
    if (user.email.length === 0) errors.email = "email должен быть";
    // if (user.role_id < 0) errors.role_id = "Выберите роль";

    return errors;
};

export const supplierValidate = (supplier: ISupplier | INewSupplier) => {
    const errors: ValidationErrors = {};
    if (supplier.name.length === 0) errors.name = "Наименование должно быть должен быть";
    if (supplier.name.length < 4) errors.name = "Наименование слишком короткое";
    if (supplier.name.length > 63) errors.name = "Наименование слишком длинное";
    if (supplier.INN.length === 0) errors.INN = "ИНН должен быть";
    if (`${supplier.INN}`.length < 10) errors.INN = "ИНН слишком короткий";
    if (`${supplier.INN}`.length > 28) errors.INN = "ИНН слишком длинный";
    return errors;
};

export const orderValidate = (order: INewOrder | IOrder) => {
    const errors: ValidationErrors = {};
    if (order.title.length === 0) errors.title = "Заголовок заявки должно быть";
    if (order.positions?.filter(position => !!position.name
        || !!position.catalog_number).length === 0) errors.title = "Должна быть хотя бы 1 позиция";
    return errors;
}

export const invoiceValidate = (invoice: INewInvoice | IInvoice) => {
    const errors: ValidationErrors = {};
    if (invoice.supplier_id === "-1") errors.supplier_id = "выберите поставщика";
    if (invoice.number.length < 1) errors.number = "введите номер счёта";
    if (+invoice.amount < 1) errors.amount = "введите сумму";
    return errors;
}

export const shipmentValidate = (shipment: INewShipments | IShipments) => {
    const errors: ValidationErrors = {};
    if (shipment.lading_number.length < 2) errors.lading_number = "введите номер накладной";
    if (shipment.transporter === "-1") errors.transporter = "выбирите перевозчика";
    if (shipment.type === "-1") errors.type = "выбирите тип отгрузки";
    return errors;
}

export const technicalLiteratureValidate = (literature: INewTechnicalLiterature | ITechnicalLiterature) => {
    const errors: ValidationErrors = {};
    if (+literature.literature_type_id < 0) errors.literature_type_id = "Выберите тип литературы.";
    if (+literature.machinery_type_id < 0) errors.machinery_type_id = "Выберите тип техники.";
    return errors;
};
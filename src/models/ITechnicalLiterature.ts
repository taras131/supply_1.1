import {IComment} from "./iComent";
import {IUser} from "./IUser";

export type TechnicalLiteratureType =
    'repair_manual'
    | 'parts_catalog'
    | 'service_manual'
    | 'operation_manual'
    | 'electrical_diagram'
    | 'hydraulic_diagram'
    | 'technical_specification';

export interface INewTechnicalLiterature {
    brand: string;
    model: string;
    machinery_type_id: number;
    literature_type_id: number; // ID типа литературы (каталог запчастей, руководство по ремонту и т.д.)
    engine_type_id: number;
    year_from: number;
    year_to: number;
    file_url: string;
    file_name: string;
    file_size: number; // в байтах
    language: string; // 'ru', 'en', 'de' и т.д.
    description?: string;
    traction_type_id?: number;
    transmission_type_id?: number;
    operating_type_id?: number;
    pages?: number; // количество страниц
    is_verified: boolean; // проверена ли модератором
    firebase_id?: string;
}

export interface ITechnicalLiterature extends INewTechnicalLiterature {
    id: string;
    author_id: string;
    author?: IUser;
    updated_author?: IUser;
    views_count: number; // количество просмотров
    downloads_count: number; // количество скачиваний
    rating: number; // рейтинг от 0 до 5
    ratings_count: number; // количество оценок
    tags?: string[]; // теги для поиска
    created_at: string;
    updated_at: string;
}

export interface ICurrentTechnicalLiterature extends ITechnicalLiterature {
    related_literature?: ITechnicalLiterature[]; // связанная литература
    comments?: IComment[]; // комментарии пользователей
}

export const emptyTechnicalLiterature: INewTechnicalLiterature = {
    brand: "",
    model: "",
    machinery_type_id: -1,
    literature_type_id: -1,
    engine_type_id: -1,
    year_from: new Date().getFullYear(),
    year_to: new Date().getFullYear(),
    file_url: "",
    file_name: "",
    file_size: 0,
    language: "ru",
    description: "",
    traction_type_id: -1,
    transmission_type_id: -1,
    operating_type_id: -1,
    pages: 0,
    is_verified: false,
};

export const defaultTechnicalLiterature: ICurrentTechnicalLiterature = {
    ...emptyTechnicalLiterature,
    id: "",
    author_id: "",
    views_count: 0,
    downloads_count: 0,
    rating: 0,
    ratings_count: 0,
    tags: [],
    created_at: "",
    updated_at: "",
    related_literature: [],
    comments: [],
};

export const literatureTypes = [
    {id: 1, title: "Руководство по ремонту"},
    {id: 2, title: "Каталог запчастей"},
    {id: 3, title: "Руководство по эксплуатации"},
    {id: 4, title: "Схема электрическая"},
    {id: 5, title: "Схема гидравлическая"},
    {id: 6, title: "Техническое описание"},
]
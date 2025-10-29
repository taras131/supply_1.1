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
    engine_type_ids: number []
    year_from: number;
    year_to: number;
    file_url: string;
    file_name: string;
    file_size: number; // в байтах
    language: string; // 'ru', 'en', 'de' и т.д.
    tags: string[]; // теги для поиска
    description?: string;
    traction_type_id?: number;
    transmission_type_id?: number;
    operating_type_id: number;
    pages?: number; // количество страниц
    is_verified: boolean; // проверена ли модератором
    firebase_id?: string;
    code: string,
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
    engine_type_ids: [-1],
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
    code: "",
    tags: [],
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
    {id: 1, title: "Анализ износа и поломок"},
    {id: 2, title: "Каталог запчастей"},
    {id: 3, title: "Коды ошибок"},
    {id: 4, title: "Общее"},
    {id: 5, title: "Руководство по ремонту"},
    {id: 6, title: "Руководство по эксплуатации"},
    {id: 7, title: "Схема гидравлическая"},
    {id: 8, title: "Схема электрическая"},
    {id: 9, title: "Сервисный бюллетень"},
    {id: 10, title: "Техническое описание"},
    {id: 11, title: "Тренинг / Тесты"},
    {id: 12, title: "Управление Сервисом"},
    {id: 13, title: "Управление клиентом"},
];

export const literatureLanguage = [
    {id: "ru", title: "Русский"},
    {id: "ar", title: "Арабский"},
    {id: "en", title: "Английский"},
    {id: "da", title: "Датский"},
    {id: "de", title: "Немецкий"},
    {id: "fi", title: "Финский"},
    {id: "fr", title: "Французский"},
    {id: "hu", title: "Венгерский"},
    {id: "it", title: "Итальянский"},
    {id: "ja", title: "Японский"},
    {id: "ko", title: "Корейский"},
    {id: "cs", title: "Чешский"},
    {id: "zh", title: "Китайский"},
    {id: "nl", title: "Голландский"},
    {id: "no", title: "Норвежский"},
    {id: "pl", title: "Польский"},
    {id: "pt", title: "Португальский"},
    {id: "es", title: "Испанский"},
    {id: "sv", title: "Шведский"},
    {id: "tr", title: "Турецкий"},
];
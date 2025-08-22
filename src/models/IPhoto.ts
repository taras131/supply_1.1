export type PhotoItem = {
    id: string;        // ID на сервере или временный ID FilePond
    src: string;       // URL полноразмерного изображения
    thumb?: string;    // URL миниатюры (по желанию)
    name?: string;     // отображаемое имя файла
};
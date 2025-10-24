import {FC} from "react";
import {engineTypes, machineryTypes, tractionTypes, transmissionTypes} from "../../machinery/utils/const";
import {INewTechnicalLiterature, ITechnicalLiterature, literatureTypes} from "../../../models/ITechnicalLiterature";
import {Stack, Box} from "@mui/material";
import FieldControl from "../../../components/common/FieldControl";
import TitleWithValue from "../../../components/TitleWithValue";
import {formatDateDDMMYYYY} from "../../../utils/services";
import {ValidationErrors} from "../../../utils/validators";

interface IProps {
    literature: INewTechnicalLiterature | ITechnicalLiterature;
    errors?: ValidationErrors;
    isEditMode: boolean;
    fieldChangeHandler: (e: any) => void;
}

const TechnicalLiteratureView: FC<IProps> = ({
                                                 literature,
                                                 errors,
                                                 isEditMode,
                                                 fieldChangeHandler,

                                             }) => {
    if (!literature) return null;

    return (
        <>
            {/* Основная информация */}
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                <FieldControl
                    label="Марка"
                    name="brand"
                    id="brand"
                    value={literature.brand}
                    error={errors?.brand}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                    isRequired
                />
                <FieldControl
                    label="Модель"
                    name="model"
                    id="model"
                    value={literature.model}
                    error={errors?.model}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                    isRequired
                />
            </Stack>

            {/* Типы и классификация */}
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                <FieldControl
                    label="Тип техники"
                    name="machinery_type_id"
                    id="machinery_type_id"
                    value={literature.machinery_type_id}
                    error={errors?.machinery_type_id}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                    options={machineryTypes}
                    isRequired
                />
                <FieldControl
                    label="Тип литературы"
                    name="literature_type_id"
                    id="literature_type_id"
                    value={literature.literature_type_id}
                    error={errors?.literature_type_id}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                    options={literatureTypes}
                    isRequired
                />
            </Stack>

            {/* Год выпуска */}
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                <FieldControl
                    label="Год выпуска с"
                    name="year_from"
                    id="year_from"
                    value={literature.year_from}
                    error={errors?.year_from}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                    isRequired
                />
                <FieldControl
                    label="Год выпуска по"
                    name="year_to"
                    id="year_to"
                    value={literature.year_to}
                    error={errors?.year_to}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                    isRequired
                />
            </Stack>

            {/* Типы двигателя и трансмиссии */}
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                <FieldControl
                    label="Тип двигателя"
                    name="engine_type_id"
                    id="engine_type_id"
                    value={literature.engine_type_id}
                    error={errors?.engine_type_id}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                    options={engineTypes}
                    isRequired
                />
                <FieldControl
                    label="Тип трансмиссии"
                    name="transmission_type_id"
                    id="transmission_type_id"
                    value={literature.transmission_type_id || -1}
                    error={errors?.transmission_type_id}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                    options={transmissionTypes}
                />
            </Stack>

            {/* Дополнительные типы */}
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                <FieldControl
                    label="Тип сцепления"
                    name="traction_type_id"
                    id="traction_type_id"
                    value={literature.traction_type_id || -1}
                    error={errors?.traction_type_id}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                    options={tractionTypes}
                />
                {/*  <FieldControl
                    label="Тип использования"
                    name="operating_type_id"
                    id="operating_type_id"
                    value={literature.operating_type_id}
                    error={errors?.operating_type_id}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                    options={operatingTypes}
                />*/}
            </Stack>

            {/* Информация о файле */}
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                <FieldControl
                    label="Имя файла"
                    name="file_name"
                    id="file_name"
                    value={literature.file_name}
                    error={errors?.file_name}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                    isRequired
                />
                <FieldControl
                    label="URL файла"
                    name="file_url"
                    id="file_url"
                    value={literature.file_url}
                    error={errors?.file_url}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                    isRequired
                />
            </Stack>

            {/* Размер файла и количество страниц */}
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                {!isEditMode && literature.file_size && (
                    <Box>
                        <TitleWithValue
                            title="Размер файла"
                            value={`${(literature.file_size / 1024 / 1024).toFixed(2)} МБ`}
                        />
                    </Box>
                )}
                <FieldControl
                    label="Количество страниц"
                    name="pages"
                    id="pages"
                    value={literature.pages || ''}
                    error={errors?.pages}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                />
                <FieldControl
                    label="Язык"
                    name="language"
                    id="language"
                    value={literature.language}
                    error={errors?.language}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                />
            </Stack>

            {/* Описание */}
            <FieldControl
                label="Описание"
                name="description"
                id="description"
                value={literature.description || ''}
                error={errors?.description}
                isEditMode={isEditMode}
                onChange={fieldChangeHandler}
                isMultiline
                sx={{
                    flexGrow: 1,
                    height: '100%',
                }}
            />

            {/* Теги */}
            {/*            <FieldControl
                label="Теги (разделены запятой)"
                name="tags"
                id="tags"
                value={Array.isArray(literature.tags) ? literature.tags.join(', ') : ''}
                error={errors?.tags}
                isEditMode={isEditMode}
                onChange={(e) => {
                    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                    fieldChangeHandler({
                        ...e,
                        target: {
                            ...e.target,
                            name: 'tags',
                            value: tagsArray,
                        },
                    });
                }}
                isMultiline
            />*/}

            {/* Информация для просмотра (не редактирования) */}
            {!isEditMode && 'id' in literature && (
                <Stack spacing={2}>
                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                        {literature.is_verified && (
                            <Box>
                                <TitleWithValue
                                    title="Статус"
                                    value="Проверена модератором"
                                />
                            </Box>
                        )}
                        {literature.rating > 0 && (
                            <Box>
                                <TitleWithValue
                                    title="Рейтинг"
                                    value={`${literature.rating.toFixed(2)} / 5 (${literature.ratings_count} оценок)`}
                                />
                            </Box>
                        )}
                    </Stack>

                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                        <Box>
                            <TitleWithValue
                                title="Просмотров"
                                value={literature.views_count}
                            />
                        </Box>
                        <Box>
                            <TitleWithValue
                                title="Скачиваний"
                                value={literature.downloads_count}
                            />
                        </Box>
                    </Stack>

                    {literature.created_at && (
                        <Box>
                            <TitleWithValue
                                title="Добавлена"
                                value={formatDateDDMMYYYY(literature.created_at)}
                            />
                        </Box>
                    )}

                    {literature.updated_at && literature.updated_at !== literature.created_at && (
                        <Box>
                            <TitleWithValue
                                title="Обновлена"
                                value={formatDateDDMMYYYY(literature.updated_at)}
                            />
                        </Box>
                    )}
                </Stack>
            )}
        </>
    );
};

export default TechnicalLiteratureView;
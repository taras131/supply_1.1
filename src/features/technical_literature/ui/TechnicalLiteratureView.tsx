import {FC, useState} from "react";
import {
    engineTypes,
    machineryTypes,
    tractionTypes,
    transmissionTypes
} from "../../machinery/utils/const";
import {
    INewTechnicalLiterature,
    ITechnicalLiterature,
    literatureLanguage,
    literatureTypes
} from "../../../models/ITechnicalLiterature";
import {Stack, Box, MenuItem, FormControl, Chip, InputLabel} from "@mui/material";
import FieldControl, {
    StyledInput,
    StyledLabel,
    StyledSelect,
    StyledTypography
} from "../../../components/common/FieldControl";
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
    const [tagInput, setTagInput] = useState('');
    if (!literature) return null;
    const handleTagAdd = () => {
        if (tagInput.trim() && !literature.tags.includes(tagInput.trim())) {
            fieldChangeHandler({
                target: {
                    name: 'tags',
                    value: [...literature.tags, tagInput.trim()]
                }
            });
            setTagInput('');
        }
    };

    const handleTagDelete = (tagToDelete: string) => {
        fieldChangeHandler({
            target: {
                name: 'tags',
                value: literature.tags.filter(tag => tag !== tagToDelete)
            }
        });
    };

    const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTagAdd();
        }
    };
    console.log(literature)
    return (
        <>
            <FieldControl
                label="Название"
                name="description"
                id="description"
                value={literature.description || ''}
                error={errors?.description}
                isEditMode={isEditMode}
                onChange={fieldChangeHandler}
            />
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
                />
                <FieldControl
                    label="Модель"
                    name="model"
                    id="model"
                    value={literature.model}
                    error={errors?.model}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
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
                />
                <FieldControl
                    label="Год выпуска по"
                    name="year_to"
                    id="year_to"
                    value={literature.year_to}
                    error={errors?.year_to}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                />
            </Stack>
            {/* Дополнительные типы */}
            <Stack direction={{xs: 'column', sm: 'row'}}
                   spacing={2}
            >
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
                <FieldControl
                    label="Тип движетеля"
                    name="traction_type_id"
                    id="traction_type_id"
                    value={literature.traction_type_id || -1}
                    error={errors?.traction_type_id}
                    isEditMode={isEditMode}
                    onChange={fieldChangeHandler}
                    options={tractionTypes}
                />
            </Stack>
            <Stack spacing={2} direction={"row"}>
                <FieldControl
                    label="Код книги"
                    name="code"
                    id="code"
                    value={literature.code}
                    error={errors?.code}
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
                    options={literatureLanguage}
                />
            </Stack>
            <FormControl fullWidth>
                <StyledLabel shrink htmlFor={"engine_type_ids"}>
                    Типы двигателей
                </StyledLabel>
                {isEditMode
                    ? (<StyledSelect
                        multiple
                        variant={"outlined"}
                        id="engine_type_ids"
                        name="engine_type_ids"
                        value={literature.engine_type_ids || []}
                        onChange={fieldChangeHandler}
                        error={!!errors?.engine_type_ids}
                    >
                        {engineTypes.map(engine => (
                            <MenuItem key={engine.id} value={engine.id}>
                                {engine.title}
                            </MenuItem>
                        ))}
                    </StyledSelect>)
                    : (<StyledTypography>
                        {literature.engine_type_ids && literature.engine_type_ids.length > 0
                            ? engineTypes
                                .filter(engine => literature.engine_type_ids.includes(engine.id))
                                .map(engine => engine.title)
                                .join(', ')
                            : "-------"}
                    </StyledTypography>)}
            </FormControl>
            <Box mt={1}
                 sx={{
                     flexGrow: 1,
                     height: '100%',
                 }}>
                <InputLabel htmlFor={"tags"}
                            sx={{
                                fontSize: "14px",

                                marginLeft: "5px"
                            }}>
                    Теги
                </InputLabel>
                {isEditMode ? (
                    <Stack spacing={1} mt={0.5}>
                        <StyledInput
                            id="tags-input"
                            placeholder="Введите тег и нажмите Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagInputKeyDown}
                            size="small"
                            fullWidth
                            error={!!errors?.tags}
                            helperText={errors?.tags}
                        />
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                            {literature.tags && literature.tags.length > 0 ? (
                                literature.tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={() => handleTagDelete(tag)}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))
                            ) : (
                                <StyledTypography>Теги не добавлены</StyledTypography>
                            )}
                        </Box>
                    </Stack>
                ) : (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                        {literature.tags && literature.tags.length > 0 ? (
                            literature.tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    color="primary"
                                    variant="outlined"
                                    disabled
                                />
                            ))
                        ) : (
                            <StyledTypography>-------</StyledTypography>
                        )}
                    </Box>
                )}
            </Box>
            {!isEditMode && 'id' in literature && (
                <>
                    <Stack direction={'row'} spacing={2} justifyContent={"space-between"}>
                        {literature.is_verified && (
                            <TitleWithValue
                                title="Статус"
                                value="Проверена модератором"
                            />
                        )}
                        {literature.rating > 0 && (
                            <TitleWithValue
                                title="Рейтинг"
                                value={`${literature.rating.toFixed(2)} / 5 (${literature.ratings_count} оценок)`}
                            />
                        )}
                    </Stack>
                    <Stack direction={'row'} spacing={2} justifyContent={"space-between"}>
                        <TitleWithValue
                            title="Просмотров"
                            value={literature.views_count}
                        />
                        <TitleWithValue
                            title="Скачиваний"
                            value={literature.downloads_count}
                        />
                    </Stack>
                    <Stack direction={'row'} spacing={2} justifyContent={"space-between"}>
                        {literature.created_at && (
                            <TitleWithValue
                                title="Добавлена"
                                value={formatDateDDMMYYYY(literature.created_at)}
                            />
                        )}
                        {literature.updated_at && (
                            <TitleWithValue
                                title="Обновлена"
                                value={formatDateDDMMYYYY(literature.updated_at)}
                            />
                        )}
                    </Stack>
                </>
            )}
            {literature.file_size && (
                <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
                    <TitleWithValue
                        title="Размер файла"
                        value={`${(literature.file_size / 1024 / 1024).toFixed(2)} МБ`}
                    />
                    <TitleWithValue
                        title="Количество страниц"
                        value={literature.pages || ''}
                    />
                </Stack>
            )}
        </>
    );
};

export default TechnicalLiteratureView;
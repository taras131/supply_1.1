import React, { FC } from "react";
import { formatDateDDMMYYYY } from "../../utils/services";
import { IUser } from "../../models/IUser";
import TitleWithValue from "../TitleWithValue";

interface IProps {
  author: IUser;
  updatedAuthor: IUser | null;
  createdAT: string;
  updatedAt: string | null;
}

const CreateUpdateUserInfo: FC<IProps> = ({ author, updatedAuthor, createdAT, updatedAt }) => {
  return (
    <>
      <TitleWithValue title={"Добавлено:"} value={formatDateDDMMYYYY(createdAT)} />
      <TitleWithValue
        title={"Автор:"}
        value={`${author.first_name}
                 ${author.middle_name}`}
      />
      {updatedAuthor && updatedAt && (
        <>
          <TitleWithValue title={"Обновлено:"} value={formatDateDDMMYYYY(updatedAt)} />
          <TitleWithValue title={"Обновил:"} value={`${updatedAuthor.first_name} ${updatedAuthor.middle_name}`} />
        </>
      )}
    </>
  );
};

export default CreateUpdateUserInfo;

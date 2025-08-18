import React from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { IRegisterData, registerValues } from "../../../models/iAuth";
import { fetchRegister } from "../../auth/model/actions";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { Button } from "@mui/material";
import { selectCurrentCompany } from "../../companies/model/selectors";
import {db} from "../../../firebase";

const AUsersMigration = () => {
  const dispatch = useAppDispatch();
  const currentCompany = useAppSelector(selectCurrentCompany);
  const clickHandler = () => {
    const q = query(collection(db, "users"));
    const arr: IRegisterData[] = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc: any) => {
        const data = doc.data();
        const user = {
          ...registerValues,
          firebase_id: doc.id || "",
          first_name: data.firstName,
          middle_name: data.middleName,
          email: data.email,
          password: "9559",
          company_id: currentCompany?.id || "",
        };
        arr.push(user);
      });
      const dispatchWithDelay = (items: IRegisterData[], index = 0) => {
        if (index >= items.length) return;
        console.log(items[index]);
        dispatch(fetchRegister(items[index]));
        setTimeout(() => {
          dispatchWithDelay(items, index + 1);
        }, 1000);
      };
      dispatchWithDelay(arr);
    });
  };
  return <Button onClick={clickHandler}>Стащить</Button>;
};

export default AUsersMigration;

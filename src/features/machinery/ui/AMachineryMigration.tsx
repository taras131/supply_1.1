import React from "react";
import { Button } from "@mui/material";
import { useAppDispatch } from "../../../hooks/redux";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../firebase";
import { fetchAddMachinery } from "../model/actions";
import { emptyMachinery, INewMachinery } from "../../../models/iMachinery";

const AMachineryMigration = () => {
  const dispatch = useAppDispatch();

  const clickHandler = () => {
    const q = query(collection(db, "machinery"));
    const arr: INewMachinery[] = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc: any) => {
        const data = doc.data();
        const machinery = {
          ...emptyMachinery,
          firebase_id: doc.id || "",
          brand: data.brand || "sadfasd",
          model: data.model || "sdfsadf",
          year_manufacture: data.yearManufacture?.toString() || "2455",
          type_id: 1,
          vin: data.vin || "sdfg",
          engine_type_id: 1,
          state_number: data.stateNumber || "",
        };
        arr.push(machinery);
      });
      const dispatchWithDelay = (items: INewMachinery[], index = 0) => {
        console.log(items[index]);
        if (index >= items.length) return;
        dispatch(fetchAddMachinery({ newMachinery: { ...items[index] }, files: [] }));
        setTimeout(() => {
          dispatchWithDelay(items, index + 1);
        }, 1000);
      };
      dispatchWithDelay(arr);
    });
  };
  return <Button onClick={clickHandler}>Стащить</Button>;
};

export default AMachineryMigration;

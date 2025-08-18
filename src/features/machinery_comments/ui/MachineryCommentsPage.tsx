import React, { useEffect } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { fetchGetAllMachineryComment } from "../model/actions";
import MachineryComments from "./MachineryComments";

const MachineryCommentsPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchGetAllMachineryComment());
  });
  return (
    <div>
      MachineryCommentsPage
      <MachineryComments isShowMachineryInfo />
    </div>
  );
};

export default MachineryCommentsPage;

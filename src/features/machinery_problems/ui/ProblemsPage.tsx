import React, { useEffect } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { fetchGetAllMachineryProblem } from "../model/actions";
import Problems from "./Problems";

const ProblemsPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchGetAllMachineryProblem());
  }, [dispatch]);
  return <Problems isShowMachineryInfo />;
};

export default ProblemsPage;

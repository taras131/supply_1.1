import React, { FC } from "react";
import MachineryDocsItem from "./MachineryDocsItem";
import Box from "@mui/material/Box";
import MachineryDocsAddNew from "./MachineryDocsAddNew";
import { useAppSelector } from "../../../hooks/redux";
import { selectAllMachineryDocs } from "../model/selectors";

const MachineryDocs: FC = () => {
  const docs = useAppSelector(selectAllMachineryDocs);
  const docList = docs?.map((doc) => <MachineryDocsItem key={doc.id} doc={doc} />) || null;
  return (
    <div style={{ width: "100%" }}>
      {docList && (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(225px, 100%), 1fr))",
            gap: "16px",
          }}
        >
          <MachineryDocsAddNew />
          {docList}
        </Box>
      )}
    </div>
  );
};

export default MachineryDocs;

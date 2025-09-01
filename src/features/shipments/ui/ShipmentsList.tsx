import React, {FC} from "react";
import {IShipments} from "../../../models/iShipments";

interface IProps {
    shipments: IShipments[];
    extendShipmentId?: string | false;
}

const ShipmentsList: FC<IProps> = ({shipments, extendShipmentId = false}) => {
    const [expanded, setExpanded] = React.useState<string | false>(extendShipmentId);
    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return <div style={{width: "100%"}}>shipmentsList</div>;
};

export default ShipmentsList;

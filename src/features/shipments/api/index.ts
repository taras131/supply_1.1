import {addDoc, collection, doc, updateDoc} from "firebase/firestore";
import {db} from "../../../firebase";
import {INewShipments} from "../../../models/iShipments";

export const shipmentsAPI = {
    addShipment: async (shipment: INewShipments) => {
        return await addDoc(collection(db, "shipments"), shipment);
    },

};
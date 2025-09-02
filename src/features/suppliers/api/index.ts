import {appAPI, nestServerPath} from "../../../api";
import {INewSupplier, ISupplier} from "../../../models/iSuppliers";

const suppliersPath = `${nestServerPath}/suppliers`;

export const suppliersAPI = {
    add: async (supplier: INewSupplier) => {
        const res = await appAPI.post(suppliersPath, supplier);
        return await res.data;
    },
    getAll: async () => {
        const res = await appAPI.get(suppliersPath);
        return await res.data;
    },
    getById: async (supplierId: string) => {
        const res = await appAPI.get(`${suppliersPath}/${supplierId}`);
        return await res.data;
    },
    getByFirebaseId: async (firebase_id: string) => {
        console.log(firebase_id);
        const res = await appAPI.get(`${suppliersPath}/firebase/${firebase_id}`)
        return await res.data.id;
    },
    update: async (supplier: ISupplier) => {
        const res = await appAPI.put(suppliersPath, supplier);
        return await res.data;
    },
    delete: async (supplierId: string) => {
        const res = await appAPI.delete(`${suppliersPath}/${supplierId}`);
        return await res.data;
    },
};

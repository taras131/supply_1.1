import {emptySupplier, INewSupplier} from "../../../models/iSuppliers";

export const setSupplierDate = (res: any): INewSupplier => {
  return {
    ...emptySupplier,
    name: res.value,
    legal_address: res.data.address.unrestricted_value,
    city: (() => {
      const match = res.data.address.unrestricted_value.match(/г\.?\s*([А-ЯЁа-яё\- ]+)/);
      return match ? match[1].trim() : '';
    })(),
    kpp: res.data.kpp,
    okato: res.data.okato,
    ogrn: res.data.ogrn,
    okogu: res.data.okogu,
    okpo: res.data.okpo,
  };
};

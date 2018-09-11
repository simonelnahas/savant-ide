import { KVPair } from '../store/contract/types';

export interface Field {
  value: any;
  type: string;
  touched: boolean;
  error: boolean;
}

export interface MsgField {
  value: any;
  touched: boolean;
  error: boolean;
}

export interface FieldDict {
  [key: string]: Field;
}

export interface MsgFieldDict {
  [key: string]: MsgField;
}

export const isField = (field: Field | MsgField): field is Field => {
  return !!(<Field>field).type;
};

export const toScillaParams = (fields: FieldDict): KVPair[] => {
  return Object.keys(fields).map((name) => {
    return { vname: name, value: fields[name].value, type: fields[name].type };
  });
};

export const toMsgFields = (fields: MsgFieldDict) => {
  return Object.keys(fields).reduce(
    (acc, fName) => ({
      ...acc,
      [fName]: fields[fName].value,
    }),
    {} as { [key: string]: any },
  );
};

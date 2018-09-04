interface Validator {
  type: string;
  match: (type: string) => boolean;
  validatorFn: (value: string) => boolean;
}

const Matchers: { [type: string]: RegExp } = {
  ByStrX: /^ByStr[0-9]+$/,
  String: /^String$/,
  Uint: /^Uint(32|64|128|256)$/,
  Int: /^Int(32|64|128|256)$/,
  BNum: /^BNum$/,
};

const Validators: { [type: string]: RegExp } = {
  ByStrX: /^0x[A-F0-9]{20,65}$/i,
  String: /w+/i,
  Uint: /^[0-9]+$/,
  Int: /^(-|\+)?[0-9]+$/,
  BNum: /^[1-9]([0-9])*$/,
};

const validators: Validator[] = [
  {
    type: 'ByStrX',
    match: (type: string) => Matchers.ByStrX.test(type),
    validatorFn: (value) => Validators.ByStrX.test(value),
  },
  {
    type: 'UInt',
    match: (type: string) => Matchers.Uint.test(type),
    validatorFn: (value) => Validators.Uint.test(value),
  },
  {
    type: 'Int',
    match: (type: string) => Matchers.Int.test(type),
    validatorFn: (value) => Validators.Int.test(value),
  },
  {
    type: 'BNum',
    match: (type: string) => Matchers.BNum.test(type),
    validatorFn: (value) => Validators.BNum.test(value),
  },
  {
    type: 'String',
    match: (type: string) => Matchers.String.test(type),
    validatorFn: (value) => Validators.String.test(value),
  },
];

export const validate = (type: string, value: string) => {
  return validators.some((val) => val.match(type) && val.validatorFn(value));
};

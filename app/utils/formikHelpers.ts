export const formikFilterForm = <T extends object>(
  touched: { [key: string]: boolean },
  errors: T,
  values: T
) => {
  const touchedKeys = Object.entries(touched).map(([key, value]) => {
    if (value) return key;
  });

  const finalErrors: string[] = [];

  Object.entries(errors).map(([key, value]) => {
    if (touchedKeys.includes(key) && values) finalErrors.push(value);
  });
  return finalErrors;
};

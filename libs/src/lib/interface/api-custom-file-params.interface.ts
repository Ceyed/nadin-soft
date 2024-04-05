export interface ApiCustomFileParamsInterface {
  requiredBodyFields: string[];
  body: {
    [key: string]: { type: string };
  };
}

import { VisQueryResponse } from "../../../types";
import { VisType } from "../types";

type VisQueryResponseValidationResponse =
  | {
      isValid: true;
    }
  | {
      isValid: false;
      errorMessage: string;
      errorTitle: string;
    };

export const isValidQueryResponse = (
  queryResponse: VisQueryResponse,
  visType: VisType
): VisQueryResponseValidationResponse => {
  if (queryResponse.fields.dimensions.length !== 1) {
    return {
      isValid: false,
      errorMessage:
        "Remove a dimension in the data panel (or add if not present)",
      errorTitle: "Only one dimension is allowed",
    };
  }

  if (!queryResponse.fields.dimensions[0].type.startsWith("date_")) {
    return {
      isValid: false,
      errorMessage: "Use a date dimension",
      errorTitle: "The dimension must be a date",
    };
  }

  if (visType === VisType.SUM && queryResponse.fields.measures.length !== 1) {
    return {
      isValid: false,
      errorMessage: "Add a measure in the data panel (or remove)",
      errorTitle: "Only one measure for Sum measure type",
    };
  }

  if (
    (visType === VisType.DIVIDE || visType === VisType.RATIO) &&
    queryResponse.fields.measures.length !== 2
  ) {
    return {
      isValid: false,
      errorMessage: "Add another measure in the data panel",
      errorTitle: "Two measures are required for Divide or Ratio measure type",
    };
  }

  return { isValid: true };
};

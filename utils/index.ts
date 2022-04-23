import { sanitizeUrl } from "@braintree/sanitize-url";

export const invalidUrlString = "about:blank";

export function isString(x: any): x is string {
  return typeof x === "string";
}

export const isValidWebUrl = (url: any) => {
  if (sanitizeWebUrl(url) != invalidUrlString) {
    return true;
  } else {
    return false;
  }
};

export const sanitizeWebUrl = (url: any) => {
  if (
    isString(url) &&
    (url.startsWith("https://") || url.startsWith("http://"))
  ) {
    return sanitizeUrl(url);
  } else {
    return invalidUrlString;
  }
};

export const stringToBoolParam = (inputParam: string | Array<string>) => {
  if (inputParam === "true") {
    return true;
  } else if (inputParam === "false") {
    return false;
  } else {
    throw 'Parameter must be boolean string - "true" or "false"';
  }
};

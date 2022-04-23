import axios from "axios";
import { ScrapeOptions, scrapeSite, SiteData } from "./lib/scrape";
import { isString, isValidWebUrl, stringToBoolParam } from "./utils";
import { ExtraData, getExceptionSiteData } from "./utils/exceptions";

export const getLinkPreviewParams = (req) => {
  const { url, stealth, search, validate } = req.query;
  let urlString = "";
  let stealthBool: boolean | undefined;
  let searchBool: boolean | undefined;
  let validateBool: boolean | undefined;
  let errors: Array<string> = [];
  if (url && isString(url)) {
    const decodedUrl = decodeURIComponent(url).toString();
    if (isValidWebUrl(decodedUrl)) {
      urlString = decodedUrl;
    } else {
      errors.push("Url is invalid.");
    }
  } else {
    errors.push(
      "Url string required. Only non array string parameter allowed."
    );
  }
  if (stealth)
    try {
      stealthBool = stringToBoolParam(stealth);
    } catch (err) {
      errors.push(`Stealth ${err}`);
    }
  if (search)
    try {
      searchBool = stringToBoolParam(search);
    } catch (err) {
      errors.push(`Search ${err}`);
    }
  if (validate)
    try {
      validateBool = stringToBoolParam(validate);
    } catch (err) {
      errors.push(`Validate ${err}`);
    }
  return {
    data: {
      url: urlString,
      stealth: stealthBool,
      search: searchBool,
      validate: validateBool,
    },
    errors: errors,
  };
};

// Get preview data from site will fallbacks - site scraping (standard + stealth) and bing search for images
export const getLinkPreviewData = async (
  url: string,
  stealth?: boolean,
  search?: boolean,
  validate?: boolean
) => {
  // Default vars for api data result and errors
  let siteData: SiteData | undefined = undefined;
  let imageResults: Array<string> = [];
  let topImage: string | undefined = undefined;
  let extraData: ExtraData | undefined = undefined;
  let errors: Array<any> = [];

  // Default scraping options
  let scrapeOptions: ScrapeOptions | undefined = {
    scrape: true,
    stealth: stealth,
  };

  // Check exception sites - adjust scrape options and assign extra data if needed
  // Currently this API contains exceptions for sites such Amazon, Twitter, etc.
  const exceptionData = await getExceptionSiteData(url, stealth);
  if (exceptionData.scrapeOptions) scrapeOptions = exceptionData.scrapeOptions;
  if (exceptionData.extraData) extraData = exceptionData.extraData;
  if (scrapeOptions.scrape) {
    // Scrape given url/link to get site data
    const scrapedSite = await scrapeSite(url, scrapeOptions);
    errors.concat(scrapedSite.errors);

    // Check scraped data and search data to construct api data result
    if (scrapedSite.data && scrapedSite.data.title) {
      siteData = scrapedSite.data;
      if (validate !== false)
        topImage = await getTopImage(imageResults, scrapedSite.data);
    } else {
      if (validate !== false) topImage = await getTopImage(imageResults);
    }
  }

  return {
    errors: errors,
    success: true,
    result: {
      siteData: siteData,
    },
  };
};

// Get the "best" image i.e. valid image from results
const getTopImage = async (
  imageResults: Array<string>,
  siteData?: SiteData
) => {
  if (siteData) {
    // First check if there is site image from meta tags
    if (siteData.image) {
      if (await checkIfValidImageUrl(siteData.image.src)) {
        return siteData.image.src;
      }
    }
  }
  // Iterate through bing search results for at least some image
  for (const imageUrl of imageResults) {
    if (await checkIfValidImageUrl(imageUrl)) {
      return imageUrl;
    }
  }
};

export const checkIfValidImageUrl = async (imageUrl: string) => {
  try {
    const response = await axios.get(imageUrl);
    if (
      response.status == 200 &&
      response.headers["content-type"]?.match(/(image)+\//g)?.length != 0
    ) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { ScrapeOptions, scrapeSite, SiteData } from "../../lib/scrape";
import { isString, isValidWebUrl, stringToBoolParam } from "../../utils";
import { getExceptionSiteData } from "../../utils/exceptions";
import withAllowCORS from "../../middleware/withAllowCORS";

interface ApiData {
  success: boolean;
  result?: {
    siteData?: SiteData;
  };
  errors?: Array<any>;
  error?: any;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiData>) => {
  const params = getLinkPreviewParams(req);
  if (params.errors.length == 0) {
    const { url, stealth } = params.data;

    console.log(params.data);

    switch (req.method) {
      case "GET":
        try {
          const linkPreviewData = await getLinkPreviewData(url, stealth);
          return res.status(200).json(linkPreviewData);
        } catch {
          res.status(500).end();
        }

      default:
        return res
          .status(404)
          .json({ success: false, error: `Method ${req.method} not allowed` });
    }
  } else {
    return res.status(400).json({ success: false, errors: params.errors });
  }
};

export const getLinkPreviewParams = (req: any) => {
  const { url, stealth } = req.query;
  let urlString = "";
  let stealthBool: boolean | undefined;

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

  return {
    data: {
      url: urlString,
      stealth: stealthBool,
    },
    errors: errors,
  };
};

// Get preview data from site will fallbacks - site scraping (standard + stealth) and bing search for images
export const getLinkPreviewData = async (url: string, stealth?: boolean) => {
  // Default vars for api data result and errors
  let siteData: SiteData | undefined = undefined;
  let errors: Array<any> = [];

  // Default scraping options
  let scrapeOptions: ScrapeOptions | undefined = {
    scrape: true,
    stealth: stealth,
  };

  // Check exception sites - adjust scrape options and assign extra data if needed
  // Currently this API contains exceptions for sites such Amazon, Twitter, etc.
  const exceptionData = getExceptionSiteData(url, stealth);
  if (exceptionData.scrapeOptions) scrapeOptions = exceptionData.scrapeOptions;
  if (scrapeOptions.scrape) {
    // Scrape given url/link to get site data
    const scrapedSite = await scrapeSite(url, scrapeOptions);
    errors.concat(scrapedSite.errors);

    // Check scraped data and search data to construct api data result
    if (scrapedSite.data && scrapedSite.data.title) {
      siteData = scrapedSite.data;
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

export const checkIfValidImageUrl = async (imageUrl: string) => {
  try {
    // handle url format like //cdn1.edgedatg.com/tml/assets/content/abc/abc-icon-2021.png
    if (imageUrl.startsWith("//")) {
      imageUrl = `https:${imageUrl}`;
    }

    console.log("image url is", imageUrl);
    const response = await axios.get(imageUrl);
    return (
      response.status == 200 &&
      response.headers["content-type"]?.match(/(image)+\//g)?.length != 0
    );
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default withAllowCORS(handler);

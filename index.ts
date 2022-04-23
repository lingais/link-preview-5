import cors from "cors";
import express from "express";
import { getLinkPreviewData, getLinkPreviewParams } from "./preview";

const accesskey = require("./accesskey.json").key;
const app = express();

app.use(cors());

app.get("/healthz", (req: any, res: any) => {
  return res.status(200).end();
});

// predicate the router with a check and bail out when needed
app.use((req, res, next) => {
  if (req.headers["x-api-key"] != accesskey) return res.status(403).end();
  next();
});

app.get(`/preview`, async (req, res, next) => {
  const params = getLinkPreviewParams(req);
  if (params.errors.length > 0) {
    return res.status(400).json(params.errors[0]);
  }

  console.log(params.data?.stealth);

  const preview = await getLinkPreviewData(
    params.data.url,
    params.data?.stealth,
    params.data?.search,
    params.data?.validate
  );

  return res.status(200).json(preview);
});

// start API
const port = process.env.PORT || 8088;
app.listen(port, function () {
  console.log(`listening on port ${port}`);
});

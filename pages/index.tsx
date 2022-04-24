import Head from "next/head";
import Image from "next/image";

import LinkPreview from "../components/LinkPreview";

export default function Home() {
  return (
    <div style={{ marginLeft: "10px", marginRight: "10px" }}>
      <Head>
        <title>Link Preview</title>
        <meta
          name="description"
          content="A simple API site for getting link preview data."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
        />
      </Head>

      <style jsx>{`
        .main {
          padding: 3rem 0;
        }
        .footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
        }
      `}</style>

      <main className="main">
        <h2>Try it out!</h2>
        <LinkPreview />
        <h2>
          GET request to <code>/api/preview?url=</code>
        </h2>
        <p>
          Requires "url" parameter to fetch link preview.
          <br />
          <br />
          Optional boolean parameters "stealth" (default to true):
        </p>
        <ul style={{ paddingInlineStart: 20 }}>
          <li>
            "stealth" - includes stealth browser emulation (longer fetch but
            very accurate results)
          </li>
        </ul>
      </main>
    </div>
  );
}

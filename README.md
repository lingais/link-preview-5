# link-preview

An API for getting link preview data

Works with multiple fallbacks, such as stealth emulation of a browser

## Usage

For link previews, make GET requests to `/preview?url=` with a valid `x-api-key` header

Requires "url" parameter to fetch link preview.

Optional boolean parameters "stealth", "search", "validate" (all default to true):

"stealth" - includes stealth browser emulation (longer fetch but very accurate results)

## Example Link Preview

Link preview for [https://www.youtube.com/](https://www.youtube.com/)

Preview route: [https://favorited-link-preview.herokuapp.com/api/link-preview?url=https://www.youtube.com/](https://favorited-link-preview.herokuapp.com/api/link-preview?url=https://www.youtube.com/)

Result:

```
{
  "errors": [
    null
  ],
  "success": true,
  "result": {
    "siteData": {
      "url": "https://www.youtube.com/",
      "title": "YouTube",
      "favicon": "https://www.youtube.com/s/desktop/6b6f031c/img/favicon.ico",
      "description": "Enjoy the videos and music that you love, upload original content and share it all with friends, family and the world on YouTube.",
      "image": "https://www.youtube.com/img/desktop/yt_1200.png"
    }
  }
}
```

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

Result:

```
{
  "errors": [],
  "success": true,
  "result": {
    "siteData": {
      "url": "https://www.youtube.com/",
      "title": "YouTube",
      "favicon": "https://www.youtube.com/s/desktop/7c6fa3df/img/favicon.ico",
      "description": "YouTube でお気に入りの動画や音楽を楽しみ、オリジナルのコンテンツをアップロードして友だちや家族、世界中の人たちと共有しましょう。",
      "image": {
          "src": "https://www.youtube.com/img/desktop/yt_1200.png",
          "width": 1200,
          "height": 1200,
          "mimetype": "image/png"
      }
    }
  }
}
```

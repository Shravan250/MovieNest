const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

module.exports = async ({ req, res, log, error }) => {
  if (req.method === "OPTIONS") {
    return res.send("", 200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
  }

  try {
    const { url: rawUrl, ...params } = req.query || {};

    if (!rawUrl || typeof rawUrl !== "string") {
      log("Missing or invalid target URL parameter");
      return res.json(
        {
          success: false,
          error: "Missing or invalid target URL parameter",
        },
        400,
        CORS_HEADERS
      );
    }

    let decodedUrl;
    try {
      decodedUrl = decodeURIComponent(rawUrl);
    } catch (err) {
      log("Failed to decode URL: " + rawUrl);
      return res.json(
        {
          success: false,
          error: "Failed to decode URL parameter",
        },
        400,
        CORS_HEADERS
      );
    }

    let urlObj;
    try {
      urlObj = new URL(decodedUrl);
    } catch (err) {
      log("Invalid URL after decoding: " + decodedUrl);
      return res.json(
        {
          success: false,
          error: "Invalid URL parameter",
        },
        400,
        CORS_HEADERS
      );
    }

    Object.keys(params).forEach((key) => {
      urlObj.searchParams.append(key, params[key]);
    });

    log(`Proxying request to: ${urlObj.toString()}`);

    // Use Authorization header from environment variable
    const authHeader = `Bearer ${process.env.TMDB_API_KEY}`;

    const response = await fetch(urlObj.toString(), {
      method: req.method,
      headers: {
        Authorization: authHeader,
        "User-Agent": "Appwrite-Proxy/1.0",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errText}`
      );
    }

    const data = await response.json();

    return res.json(data, 200, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    });
  } catch (err) {
    error("Proxy error: " + err.message);

    return res.json(
      {
        success: false,
        error: "Failed to fetch data from TMDB API",
        details: err.message,
      },
      500,
      CORS_HEADERS
    );
  }
};

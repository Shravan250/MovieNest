module.exports = async ({ req, res, log, error }) => {
  log("Function started, method: " + req.method);
  log("Query: " + JSON.stringify(req.query));
  log("Headers: " + JSON.stringify(req.headers));

  if (req.method === "OPTIONS") {
    return res.send("", 200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
  }

  try {
    const { url: targetUrl, ...params } = req.query || {};

    if (!targetUrl || typeof targetUrl !== "string") {
      log("Missing or invalid target URL parameter");
      return res.json(
        {
          success: false,
          error: "Missing or invalid target URL parameter",
        },
        400,
        {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        }
      );
    }

    let urlObj;
    try {
      urlObj = new URL(targetUrl);
    } catch (err) {
      log("Invalid URL: " + targetUrl);
      return res.json(
        {
          success: false,
          error: "Invalid URL: " + targetUrl,
        },
        400,
        {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        }
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
      {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      }
    );
  }
};

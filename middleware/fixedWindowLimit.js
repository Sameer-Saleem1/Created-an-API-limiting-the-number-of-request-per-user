const requestCounts = {};
function fixedWindowLimit(limit, windowMs) {
  return (req, res, next) => {
    const ip = req.ip;
    // Create a unique key based on the IP and the current time window
    const currentTime = Date.now();
    const windowIdentifier = Math.floor(currentTime / windowMs);
    const key = `${ip}-${windowIdentifier}`;

    if (!requestCounts[key]) {
      requestCounts[key] = 1;
    } else {
      requestCounts[key]++;
    }

    console.log(`IP: ${ip}, Count: ${requestCounts[key]}`);
    if (requestCounts[key] > limit) {
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
      });
    }

    next();
  };
}

module.exports = fixedWindowLimit;

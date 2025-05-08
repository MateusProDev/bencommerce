const express = require("express");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const router = express.Router();

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: "credentials.json",
});

router.post("/api/ga4-relatorio", async (req, res) => {
  const { propertyId } = req.body;

  if (!propertyId) {
    return res.status(400).json({ error: "propertyId é obrigatório" });
  }

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
    });

    const data = response.rows.map((row) => ({
      date: row.dimensionValues[0].value,
      activeUsers: row.metricValues[0].value,
    }));

    res.json({ data });
  } catch (err) {
    console.error("Erro ao buscar dados GA4:", err.message);
    res.status(500).json({ error: "Erro ao buscar dados GA4" });
  }
});

module.exports = router;

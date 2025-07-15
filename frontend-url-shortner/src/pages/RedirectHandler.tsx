import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { logger } from "../utils/logger";

interface ShortUrl {
  shortcode: string;
  url: string;
  createdAt: string;
  expiresAt: string;
  clicks: number;
  clickDetails: ClickDetail[];
}

interface ClickDetail {
  timestamp: string;
  source: string;
  country?: string;
  region?: string;
}

const STORAGE_KEY = "urlshort_urls";

function getStoredShortUrls(): ShortUrl[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveShortUrls(urls: ShortUrl[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
}

const getSource = () => {
  // Simple source detection (browser/email)
  if (document.referrer && document.referrer.includes("mail")) return "email";
  return "browser";
};

async function getGeo(): Promise<{ country?: string; region?: string }> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return {};
    const data = await res.json();
    return { country: data.country_name, region: data.region };
  } catch {
    return {};
  }
}

const RedirectHandler: React.FC = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error" | "expired" | "notfound" | "redirect">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function handleRedirect() {
      if (!shortcode) {
        setStatus("error");
        setMessage("No shortcode provided.");
        return;
      }
      const urls = getStoredShortUrls();
      const idx = urls.findIndex((u) => u.shortcode === shortcode);
      if (idx === -1) {
        setStatus("notfound");
        setMessage("Shortcode not found.");
        logger.warn(`Redirection failed: shortcode ${shortcode} not found`);
        return;
      }
      const urlObj = urls[idx];
      const now = new Date();
      if (now > new Date(urlObj.expiresAt)) {
        setStatus("expired");
        setMessage("This link has expired.");
        logger.warn(`Redirection failed: shortcode ${shortcode} expired`);
        return;
      }
      // Log click
      const geo = await getGeo();
      const click: ClickDetail = {
        timestamp: now.toISOString(),
        source: getSource(),
        ...geo,
      };
      urlObj.clicks += 1;
      urlObj.clickDetails.push(click);
      urls[idx] = urlObj;
      saveShortUrls(urls);
      logger.info(`Redirected /${shortcode} to ${urlObj.url}`);
      setStatus("redirect");
      setTimeout(() => {
        window.location.href = urlObj.url;
      }, 1200);
    }
    handleRedirect();
    // eslint-disable-next-line
  }, [shortcode]);

  return (
    <Paper sx={{ p: 3, textAlign: "center" }}>
      {status === "loading" && <><CircularProgress /><Typography>Redirecting...</Typography></>}
      {status === "redirect" && <><CircularProgress color="success" /><Typography>Redirecting to destination...</Typography></>}
      {status === "error" && <Alert severity="error">{message}</Alert>}
      {status === "notfound" && <Alert severity="error">{message}</Alert>}
      {status === "expired" && <Alert severity="warning">{message}</Alert>}
    </Paper>
  );
};

export default RedirectHandler; 
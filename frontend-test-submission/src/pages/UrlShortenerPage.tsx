import React, { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Grid,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import { validateUrl, validateShortcode, validateValidityPeriod } from "../utils/validation";
import { generateShortcode } from "../utils/shortcode";
import { logger } from "../utils/logger";

interface UrlInput {
  url: string;
  validity: string;
  shortcode: string;
}

interface ShortUrl {
  shortcode: string;
  url: string;
  createdAt: string;
  expiresAt: string;
  clicks: number;
  clickDetails: any[];
}

const STORAGE_KEY = "urlshort_urls";

function getStoredShortUrls(): ShortUrl[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveShortUrls(urls: ShortUrl[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
}

const defaultInputs: UrlInput[] = Array.from({ length: 5 }, () => ({
  url: "",
  validity: "",
  shortcode: "",
}));

const UrlShortenerPage: React.FC = () => {
  const [inputs, setInputs] = useState<UrlInput[]>(defaultInputs);
  const [errors, setErrors] = useState<string[][]>([[], [], [], [], []]);
  const [output, setOutput] = useState<ShortUrl[]>([]);
  const [success, setSuccess] = useState<string>("");

  const handleInputChange = (idx: number, field: keyof UrlInput, value: string) => {
    setInputs((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    const newErrors: string[][] = [[], [], [], [], []];
    const results: ShortUrl[] = [];
    let hasError = false;
    const stored = getStoredShortUrls();
    const existingCodes = new Set(stored.map((u) => u.shortcode));

    inputs.forEach((input, idx) => {
      const errs: string[] = [];
      if (!input.url && !input.shortcode && !input.validity) {
        // skip empty row
        return;
      }
      if (!input.url) {
        errs.push("URL is required.");
      } else if (!validateUrl(input.url)) {
        errs.push("Invalid URL format.");
      }
      let validity = input.validity.trim() ? input.validity : "30";
      if (!validateValidityPeriod(validity)) {
        errs.push("Validity must be a positive integer.");
      }
      let code = input.shortcode.trim();
      if (code) {
        if (!validateShortcode(code)) {
          errs.push("Shortcode must be alphanumeric and up to 16 chars.");
        } else if (existingCodes.has(code)) {
          errs.push("Shortcode already exists.");
        }
      } else {
        code = generateShortcode(existingCodes);
      }
      if (errs.length === 0) {
        existingCodes.add(code);
        const now = new Date();
        const expires = new Date(now.getTime() + parseInt(validity) * 60000);
        const shortUrl: ShortUrl = {
          shortcode: code,
          url: input.url,
          createdAt: now.toISOString(),
          expiresAt: expires.toISOString(),
          clicks: 0,
          clickDetails: [],
        };
        results.push(shortUrl);
        logger.info(`Shortened URL: ${input.url} as /${code} valid for ${validity} min`);
      } else {
        hasError = true;
      }
      newErrors[idx] = errs;
    });
    setErrors(newErrors);
    if (!hasError && results.length > 0) {
      const all = [...stored, ...results];
      saveShortUrls(all);
      setOutput(results);
      setSuccess("Shortened successfully!");
      setInputs(defaultInputs);
    } else {
      setOutput([]);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {inputs.map((input, idx) => (
            <Box key={idx}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}>
                  <TextField
                    label="Long URL"
                    value={input.url}
                    onChange={(e) => handleInputChange(idx, "url", e.target.value)}
                    fullWidth
                    required={idx === 0}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Validity (minutes)"
                    value={input.validity}
                    onChange={(e) => handleInputChange(idx, "validity", e.target.value)}
                    fullWidth
                    placeholder="30"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Custom Shortcode"
                    value={input.shortcode}
                    onChange={(e) => handleInputChange(idx, "shortcode", e.target.value)}
                    fullWidth
                    placeholder="(optional)"
                  />
                </Grid>
              </Grid>
              {errors[idx].length > 0 && (
                <Box mt={1}>
                  {errors[idx].map((err, i) => (
                    <Alert severity="error" key={i}>{err}</Alert>
                  ))}
                </Box>
              )}
              {idx < 4 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
          <Button type="submit" variant="contained" color="primary">
            Shorten URL(s)
          </Button>
        </Stack>
      </form>
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {output.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Shortened URLs</Typography>
          <Stack spacing={1} mt={1}>
            {output.map((o) => (
              <Paper key={o.shortcode} sx={{ p: 2 }}>
                <Typography>
                  <b>Short URL:</b> <a href={`/${o.shortcode}`}>{window.location.origin}/{o.shortcode}</a>
                </Typography>
                <Typography>
                  <b>Expires at:</b> {new Date(o.expiresAt).toLocaleString()}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default UrlShortenerPage; 
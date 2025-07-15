import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Stack,
} from "@mui/material";

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

const StatisticsPage: React.FC = () => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);

  useEffect(() => {
    setUrls(getStoredShortUrls());
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      <TableContainer component={Box}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shortcode</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Click Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((u) => (
              <TableRow key={u.shortcode}>
                <TableCell>
                  <b>{u.shortcode}</b>
                  <br />
                  <a href={`/${u.shortcode}`}>{window.location.origin}/{u.shortcode}</a>
                </TableCell>
                <TableCell sx={{ maxWidth: 200, wordBreak: "break-all" }}>{u.url}</TableCell>
                <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(u.expiresAt).toLocaleString()}</TableCell>
                <TableCell>{u.clicks}</TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    {u.clickDetails && u.clickDetails.length > 0 ? (
                      u.clickDetails.map((c, i) => (
                        <Chip
                          key={i}
                          label={`[${new Date(c.timestamp).toLocaleTimeString()}] ${c.source}${c.country ? ` (${c.country}${c.region ? ", " + c.region : ""})` : ""}`}
                          size="small"
                        />
                      ))
                    ) : (
                      <Chip label="No clicks" size="small" />
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default StatisticsPage; 
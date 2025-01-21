import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import "../styles/HomePage.css";

const HomePage = () => {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Text input is required.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/api/classify/", {
        text,
      });

      const { classification, confidence } = response.data;

      setHistory((prev) => [
        {
          text,
          label: classification === "Spam" ? "Spam" : "Ham",
          confidence,
          timestamp: new Date(),
        },
        ...prev,
      ]);

      setText("");
    } catch (err) {
      console.error("Error analyzing text:", err);
      setError(err.response?.data?.error || "Failed to classify the text. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 4, overflow: "hidden" }}>
      <Container maxWidth="md">
        <Paper
          sx={{ p: 4, mb: 4, background: "linear-gradient(135deg, #f0f4f7, #ffffff)" }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}
          >
            Twitter Spam Detection
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="Enter Tweet or Text (max 280 chars)"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{ mb: 2 }}
              disabled={isAnalyzing}
              helperText={`${text.length}/280 characters`}
              inputProps={{ maxLength: 280 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAnalyze}
              disabled={isAnalyzing || !text.trim()}
              sx={{ py: 1.5, transition: "all 0.3s ease-in-out" }}
            >
              {isAnalyzing ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Analyzing...</span>
                </Box>
              ) : (
                "Classify"
              )}
            </Button>
          </Box>
        </Paper>

        {history.length > 0 && (
          <Paper sx={{ p: 4, boxShadow: 3 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}
            >
              Classification History
            </Typography>
            <List sx={{ width: "100%" }}>
              {history.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: 1,
                    borderColor: "grey.200",
                    borderRadius: 1,
                    mb: 2,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    p: 2,
                    transition: "transform 0.2s",
                    '&:hover': { transform: "scale(1.02)" },
                    overflow: "hidden",
                  }}
                >
                  <ListItemText
                    primary={item.text}
                    sx={{
                      mb: 1,
                      fontWeight: "bold",
                      wordWrap: "break-word",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "block",
                      maxWidth: "100%",
                    }}
                  />
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Chip
                      label={item.label}
                      color={item.label === "Ham" ? "success" : "error"}
                      variant="outlined"
                      sx={{
                        borderColor: item.label === "Ham" ? "green" : "red",
                        color: item.label === "Ham" ? "green" : "red",
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {item.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: item.label === "Ham" ? "green" : "red" }}
                  >
                    Confidence: {item.confidence * 100}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={item.confidence * 100}
                    sx={{
                      mt: 2,
                      width: "100%",
                      backgroundColor: item.label === "Ham" ? "#e8f5e9" : "#ffebee",
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: item.label === "Ham" ? "green" : "red",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;

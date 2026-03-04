import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "motion/react";
import { Skull } from "lucide-react";
import { Box, Button, TextField, Typography, Container, Paper } from "@mui/material";

export function Auth() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the link.");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%' }}
      >
        <Paper elevation={24} sx={{ p: 5, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'rgba(244, 114, 182, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                border: '1px solid rgba(244, 114, 182, 0.2)',
                boxShadow: '0 0 30px rgba(244, 114, 182, 0.15)',
              }}
            >
              <Skull size={32} color="#f472b6" />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom color="text.primary" fontWeight="bold">
              Tab Graveyard
            </Typography>
            <Typography variant="body2" color="text.secondary" fontFamily="monospace">
              v1.0
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              type="email"
              label="Enter your email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 3 }}
              InputProps={{
                sx: { fontFamily: 'monospace' }
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ height: 48 }}
            >
              {loading ? "Summoning..." : "Send Link"}
            </Button>
          </form>

          {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography mt={3} mb={3} textAlign="center" variant="body2" color="primary" fontFamily="monospace">
                {message}
              </Typography>
            </motion.div>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
}

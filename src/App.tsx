import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Auth } from "@/pages/Auth";
import { Dashboard } from "@/pages/Dashboard";
import { Session } from "@supabase/supabase-js";
import { ThemeProvider, CssBaseline, CircularProgress, Box } from "@mui/material";
import { theme } from "@/theme";

// slighty had help with authethication feature as im new to supabase!
export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" minHeight="100vh" alignItems="center" justifyContent="center" bgcolor="background.default">
          <CircularProgress color="primary" />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!session ? <Auth /> : <Dashboard session={session} />}
    </ThemeProvider>
  );
}

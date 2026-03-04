import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { GhostCard } from "@/components/GhostCard";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, Plus, Skull, RefreshCw, Archive } from "lucide-react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  Grid, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  TextField, 
  CircularProgress,
  Tabs,
  Tab,
  Chip
} from "@mui/material";

interface TabData {
  id: string;
  url: string;
  title: string;
  summary: string;
  category?: string;
  status: string;
  created_at: string;
}

export function Dashboard({ session }: { session: any }) {
  const [tabs, setTabs] = useState<TabData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDump, setShowDump] = useState(false);
  const [dumpText, setDumpText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [view, setView] = useState<"active" | "archived">("active");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchTabs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tabs")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("status", view)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tabs:", error);
    } else {
      setTabs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTabs();

    const params = new URLSearchParams(window.location.search);
    const saveUrl = params.get("saveUrl");
    if (saveUrl) {
      setDumpText(saveUrl);
      setShowDump(true);

      // Clean up url
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [view]);

  const handleDump = async () => {
    if (!dumpText.trim()) return;
    setProcessing(true);

    const urls = dumpText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("http"));

    for (const url of urls) {
      try {
        const scrapeResponse = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!scrapeResponse.ok) {
          console.error("Failed to scrape URL:", url);
          continue;
        }

        const { title, description } = await scrapeResponse.json();

        let summary = description || "No description available for this page.";
        let category = "Unknown";
        
        try {
          const domain = new URL(url).hostname.replace('www.', '');
          category = domain.split('.')[0];
          category = category.charAt(0).toUpperCase() + category.slice(1);
        } catch (e) {
          category = "Web";
        }

        await supabase.from("tabs").insert({
          user_id: session.user.id,
          url,
          title: title || url,
          summary,
          category,
          status: "active",
        });
      } catch (err) {
        console.error("Failed to process URL:", url, err);
      }
    }

    setDumpText("");
    setShowDump(false);
    setProcessing(false);
    fetchTabs();
  };

  const handleOpen = async (id: string, url: string) => {
    window.open(url, "_blank");
    await supabase.from("tabs").update({ status: "archived" }).eq("id", id);
    fetchTabs();
  };

  const handleArchive = async (id: string) => {
    await supabase.from("tabs").update({ status: "archived" }).eq("id", id);
    fetchTabs();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("tabs").update({ status: "deleted" }).eq("id", id);
    fetchTabs();
  };

  const categories = Array.from(new Set(tabs.map(t => t.category).filter(Boolean))) as string[];
  const filteredTabs = tabs.filter(t => !selectedCategory || t.category === selectedCategory);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Skull size={24} color="#f472b6" />
            <Typography variant="h6" component="div" fontWeight="bold" letterSpacing="-0.02em">
              Tab Graveyard
            </Typography>
          </Box>
          <Button 
            color="secondary" 
            onClick={() => supabase.auth.signOut()}
            startIcon={<LogOut size={16} />}
          >
            Depart
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box mb={6} display="flex" flexDirection="column" gap={3}>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2}>
            <Tabs 
              value={view} 
              onChange={(_, newValue) => setView(newValue)} 
              textColor="primary" 
              indicatorColor="primary"
              sx={{ 
                minHeight: 40,
                '& .MuiTab-root': { minHeight: 40, py: 1, px: 3, fontFamily: 'monospace', fontSize: '0.875rem' }
              }}
            >
              <Tab value="active" label="Saved for Later" />
              <Tab value="archived" label="Archive" />
            </Tabs>

            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowDump(true)}
              startIcon={<Plus size={16} />}
            >
              Mass Import
            </Button>
          </Box>

          {categories.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip
                label="All"
                onClick={() => setSelectedCategory(null)}
                color={selectedCategory === null ? "primary" : "default"}
                variant={selectedCategory === null ? "outlined" : "filled"}
                sx={{ bgcolor: selectedCategory === null ? 'rgba(244, 114, 182, 0.1)' : 'rgba(255,255,255,0.05)' }}
              />
              {categories.map(cat => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => setSelectedCategory(cat)}
                  color={selectedCategory === cat ? "primary" : "default"}
                  variant={selectedCategory === cat ? "outlined" : "filled"}
                  sx={{ bgcolor: selectedCategory === cat ? 'rgba(244, 114, 182, 0.1)' : 'rgba(255,255,255,0.05)' }}
                />
              ))}
            </Box>
          )}

          {view === "active" && (
            <Box p={2} borderRadius={2} bgcolor="rgba(244, 114, 182, 0.05)" border="1px solid rgba(244, 114, 182, 0.1)">
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <strong style={{ color: '#f472b6' }}>Saved for Later:</strong> Focus on your top 3 highlighted tabs. Open, archive, or delete them to bring older tabs into focus.
              </Typography>
            </Box>
          )}

          {view === "archived" && (
            <Box p={2} borderRadius={2} bgcolor="rgba(244, 114, 182, 0.05)" border="1px solid rgba(244, 114, 182, 0.1)">
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <strong style={{ color: '#f472b6' }}>Archive:</strong> These are tabs you've already read or saved for long-term storage. You can open them again or delete them permanently.
              </Typography>
            </Box>
          )}
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={250}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {filteredTabs.map((tab, index) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={tab.id}>
                  <GhostCard
                    tab={tab}
                    onOpen={handleOpen}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                    isHighlighted={view === "active" ? tabs.findIndex(t => t.id === tab.id) < 3 : true}
                  />
                </Grid>
              ))}
            </AnimatePresence>

            {!loading && filteredTabs.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  justifyContent="center" 
                  height={250} 
                  border="1px dashed rgba(255,255,255,0.1)" 
                  borderRadius={3} 
                  bgcolor="rgba(255,255,255,0.02)"
                  color="text.secondary"
                >
                  <Skull size={48} opacity={0.2} style={{ marginBottom: 16 }} />
                  <Typography variant="body2" fontFamily="monospace">
                    No tabs found
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>

      <Dialog 
        open={showDump} 
        onClose={() => !processing && setShowDump(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', pb: 1 }}>
          <Archive size={20} />
          Import Tabs
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'monospace', fontSize: '0.875rem', mb: 3 }}>
            Paste your URLs here, one per line. The app will scrape and save them
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            rows={10}
            fullWidth
            variant="outlined"
            placeholder="https://example.com&#10;https://another.com"
            value={dumpText}
            onChange={(e) => setDumpText(e.target.value)}
            disabled={processing}
            InputProps={{
              sx: { fontFamily: 'monospace', fontSize: '0.875rem', bgcolor: 'rgba(0,0,0,0.5)' }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setShowDump(false)} 
            color="secondary" 
            disabled={processing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDump} 
            variant="contained" 
            color="primary" 
            disabled={processing || !dumpText.trim()}
            startIcon={processing ? <RefreshCw size={16} className="animate-spin" /> : null}
          >
            {processing ? "Processing..." : "Import Tabs"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

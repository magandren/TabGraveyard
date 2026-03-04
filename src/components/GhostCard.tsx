import { motion } from "motion/react";
import { ExternalLink, Archive, Trash2 } from "lucide-react";
import React from "react";
import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from "@mui/material";

interface TabData {
  id: string;
  url: string;
  title: string;
  summary: string;
  category?: string;
  status: string;
  created_at: string;
}

interface GhostCardProps {
  key?: React.Key;
  tab: TabData;
  onOpen: (id: string, url: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  isHighlighted?: boolean;
}

export function GhostCard({
  tab,
  onOpen,
  onArchive,
  onDelete,
  isHighlighted = true,
}: GhostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ height: "100%" }}
    >
      <Card sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column", 
        position: "relative", 
        overflow: "hidden",
        opacity: isHighlighted ? 1 : 0.6,
        transition: "all 0.3s ease",
        "&:hover": {
          opacity: 1,
        }
      }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom right, rgba(244, 114, 182, 0.05), transparent)",
            opacity: 0,
            transition: "opacity 0.5s",
            "&:hover": { opacity: 1 },
          }}
        />
        
        <CardContent sx={{ flexGrow: 1, position: "relative", zIndex: 1, pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1} gap={1}>
            <Typography variant="h6" component="h3" color="text.primary" sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.3,
              fontSize: "1.1rem"
            }}>
              {tab.title || tab.url}
            </Typography>
            {tab.category && tab.category !== "Unknown" && (
              <Chip 
                label={tab.category} 
                size="small" 
                color="primary" 
                variant="outlined" 
                sx={{ fontSize: "0.65rem", height: 20 }} 
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace", lineHeight: 1.6, mt: 2 }}>
            {tab.summary}
          </Typography>
        </CardContent>
        
        <CardActions sx={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)", px: 2, py: 1.5, justifyContent: "space-between" }}>
          <Box display="flex" gap={1}>
            <Button 
              size="small" 
              variant="outlined" 
              color="primary"
              onClick={() => onOpen(tab.id, tab.url)}
              startIcon={<ExternalLink size={16} />}
              sx={{ py: 0.5, px: 1.5, fontSize: "0.75rem" }}
            >
              Open
            </Button>
            
            {tab.status === "active" && (
              <Button 
                size="small" 
                variant="text" 
                color="secondary"
                onClick={() => onArchive(tab.id)}
                startIcon={<Archive size={16} />}
                sx={{ py: 0.5, px: 1.5, fontSize: "0.75rem", "&:hover": { color: "text.primary", bgcolor: "rgba(255,255,255,0.05)" } }}
              >
                Archive
              </Button>
            )}
          </Box>
          
          <Button 
            size="small" 
            variant="outlined" 
            color="error"
            onClick={() => onDelete(tab.id)}
            startIcon={<Trash2 size={16} />}
            sx={{ py: 0.5, px: 1.5, fontSize: "0.75rem" }}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
}

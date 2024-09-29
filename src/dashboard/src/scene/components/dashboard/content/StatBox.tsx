import { Box, Typography, useTheme, Skeleton } from "@mui/material";
import { tokens } from "../../../../theme";
import ProgressCircle from "../ProgressCircle";

interface StatBoxProps {
  loading: boolean;
  Icon: React.ComponentType<{ sx?: object }>; // Accepts MUI props
  title: string;
  subtitle: string;
  progress?: number;
  increase?: number;
}

const StatBox: React.FC<StatBoxProps> = ({ title, subtitle, Icon, progress, increase, loading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box gridColumn="span 4" bgcolor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
      <Box
        sx={{
          width: "100%",
          p: "0 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box width="75%" display="flex" flexDirection="column" alignItems="flex-start">
          {loading ? (
            <Skeleton variant="text" sx={{ width: "100%", height: "30px" }} />
          ) : (
            <Icon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
          )}
          {loading ? (
            <Skeleton variant="text" sx={{ width: "100%", height: "30px" }} />
          ) : (
            <Typography variant="h4" fontWeight="bold" sx={{ color: colors.grey[100] }}>
              {`${title}`}
            </Typography>
          )}
          {loading ? (
            <Skeleton variant="text" sx={{ width: "100%", height: "30px" }} />
          ) : (
            <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
              {`${subtitle} (${
                increase !== undefined ? (increase > 0 ? `+${increase}%` : `-${Math.abs(increase)}%`) : "N/A"
              })`}
            </Typography>
          )}
        </Box>

        <Box width="20%">
          {loading ? (
            <Skeleton variant="circular" sx={{ height: "100%", aspectRatio: "1 / 1" }} />
          ) : (
            <ProgressCircle progress={progress} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StatBox;

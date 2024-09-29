import { Box, Typography, useTheme, Skeleton } from "@mui/material";
import { tokens } from "../../../theme";
import ProgressCircle from "./ProgressCircle";

interface StatBoxProps {
  title?: string; // Make optional for loading
  subtitle?: string; // Make optional for loading
  icon: React.ReactElement;
  progress?: number; // Make optional for loading
  increase?: string; // Make optional for loading
  loading?: boolean; // New loading prop
}

const StatBox: React.FC<StatBoxProps> = ({ title, subtitle, icon, progress, increase, loading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" p="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {loading ? <Skeleton variant="text" width="80%" height={30} /> : icon}
          {loading ? (
            <Skeleton variant="text" width="60%" height={40} sx={{ mt: 1 }} />
          ) : (
            <Typography variant="h4" fontWeight="bold" sx={{ color: colors.grey[100] }}>
              {title}
            </Typography>
          )}
        </Box>
        <Box>
          {loading ? <Skeleton variant="circular" width={40} height={40} /> : <ProgressCircle progress={progress} />}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        {loading ? (
          <Skeleton variant="text" width="60%" height={30} />
        ) : (
          <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
            {subtitle}
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" width="40%" height={30} />
        ) : (
          <Typography variant="h5" fontStyle="italic" sx={{ color: colors.greenAccent[600] }}>
            {increase}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default StatBox;

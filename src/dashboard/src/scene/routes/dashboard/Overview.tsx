import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
  Skeleton, // Import Skeleton
} from "@mui/material";
import { tokens } from "../../../theme";
import { mockTransactions } from "../../components/dashboard/mock/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/dashboard/Header";
import LineChart from "../../components/dashboard/LineChart";
import GeographyChart from "../../components/dashboard/GeographyChart";
import BarChart from "../../components/dashboard/BarChart";
import StatBox from "../../components/dashboard/content/StatBox";
import ProgressCircle from "../../components/dashboard/ProgressCircle";
import { useState } from "react";

function Overview() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [recordTime, setRecordTime] = useState("1");
  const [loading, setLoading] = useState(true); // State to control loading

  const handleChange = (event: SelectChangeEvent) => {
    switch (Number(event.target.value)) {
      case 3:
        setRecordTime("3");
        break;
      case 7:
        setRecordTime("7");
        break;
      case 30:
        setRecordTime("30");
        break;
      default:
        setRecordTime("1");
        break;
    }
  };

  // Simulate loading delay
  setTimeout(() => {
    setLoading(false);
  }, 2000);

  return (
    <Box p="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" maxHeight="10vh">
        <Header title="Overview: Thiên Hà Của Sứa" subtitle="Welcome to SuwaClient dashboard" />
        <Box>
          <Button
            sx={{
              bgcolor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px 0px">
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography
            variant="h4"
            color={colors.greenAccent[400]}
            fontWeight="bold"
            paddingRight="1rem"
            sx={{ m: "0 0 5px 0" }}
          >{`Last: ${recordTime} day(s)`}</Typography>
        </Box>
        <FormControl sx={{ m: "5px", minWidth: 120 }} size="small">
          <InputLabel id="demo-simple-select-label">{`Time (day)`}</InputLabel>
          <Select
            sx={{
              color: "white",
            }}
            labelId="demo-simple-select-label"
            value={recordTime}
            label="Time (day)"
            onChange={handleChange}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* GRID & CHARTS */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="130px" gap="20px">
        {/* ROW 1 */}
        <StatBox
          loading={loading}
          Icon={EmailIcon} // Pass the component type directly
          title="0"
          subtitle="Message Sent"
          progress={0.75}
          increase={14}
        />
        <StatBox
          loading={loading}
          Icon={PersonAddIcon}
          title="32,441"
          subtitle="New Members"
          progress={0.3}
          increase={5}
        />
        <StatBox
          loading={loading}
          Icon={TrafficIcon}
          title="1,325,134"
          subtitle="Traffic Received"
          progress={0.8}
          increase={43}
        />

        {/* ROW 2 */}
        <Box gridColumn="span 6" gridRow="span 2" bgcolor={colors.primary[400]}>
          <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              {loading ? (
                <Skeleton variant="text" width={150} />
              ) : (
                <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                  Revenue Generated
                </Typography>
              )}
              {loading ? (
                <Skeleton variant="text" width={100} />
              ) : (
                <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                  $59,342.32
                </Typography>
              )}
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.greenAccent[500] }} />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            {loading ? <Skeleton variant="rectangular" height="250px" /> : <LineChart isDashboard={true} />}
          </Box>
        </Box>
        <Box gridColumn="span 6" gridRow="span 2" bgcolor={colors.primary[400]}>
          <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              {loading ? (
                <Skeleton variant="text" width={150} />
              ) : (
                <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                  Revenue Generated
                </Typography>
              )}
              {loading ? (
                <Skeleton variant="text" width={100} />
              ) : (
                <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                  $59,342.32
                </Typography>
              )}
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.greenAccent[500] }} />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            {loading ? <Skeleton variant="rectangular" height="250px" /> : <LineChart isDashboard={true} />}
          </Box>
        </Box>
        {/* <Box gridColumn="span 4" gridRow="span 2" bgcolor={colors.primary[400]} overflow="auto">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            color={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {loading ? (
            <Skeleton variant="rectangular" height="200px" />
          ) : (
            mockTransactions.map((transaction, i) => (
              <Box
                key={`${transaction.txId}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
              >
                <Box>
                  <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                    {transaction.txId}
                  </Typography>
                  <Typography color={colors.grey[100]}>{transaction.user}</Typography>
                </Box>
                <Box color={colors.grey[100]}>{transaction.date}</Box>
                <Box bgcolor={colors.greenAccent[500]} p="5px 10px" borderRadius="4px">
                  ${transaction.cost}
                </Box>
              </Box>
            ))
          )}
        </Box> */}

        {/* ROW 3 */}
        <Box gridColumn="span 4" gridRow="span 2" bgcolor={colors.primary[400]} p="30px">
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
            {loading ? <Skeleton variant="circular" width={125} height={125} /> : <ProgressCircle size="125" />}
            {loading ? (
              <Skeleton variant="text" width={200} />
            ) : (
              <Typography variant="h5" color={colors.greenAccent[500]} sx={{ mt: "15px" }}>
                $48,352 revenue generated
              </Typography>
            )}
            {loading ? (
              <Skeleton variant="text" width={150} />
            ) : (
              <Typography>Includes extra misc expenditures and costs</Typography>
            )}
          </Box>
        </Box>
        <Box gridColumn="span 4" gridRow="span 2" bgcolor={colors.primary[400]}>
          <Typography variant="h5" fontWeight="600" sx={{ padding: "30px 30px 0 30px" }}>
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            {loading ? <Skeleton variant="rectangular" height="250px" /> : <BarChart isDashboard={true} />}
          </Box>
        </Box>
        <Box gridColumn="span 4" gridRow="span 2" bgcolor={colors.primary[400]} padding="30px">
          <Typography variant="h5" fontWeight="600" sx={{ marginBottom: "15px" }}>
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            {loading ? <Skeleton variant="rectangular" height="200px" /> : <GeographyChart isDashboard={true} />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Overview;

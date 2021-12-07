import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function TabPanel(props) {
  const { children, value, index, sx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, ...sx }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default TabPanel;

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'

const FLayout = ({
  FToolbar = () => <div />,
  FContent = () => <div />,
  FLeftContent = () => <div />,
  FRightContent = () => <div />,
  FTopContent = () => <div />,
  FBottomContent = () => <div />,
}) => {
  return (
    <Box
      sx={{
        height: '100%',
        weight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FToolbar />
      <Container sx={{ flex: 1, display: 'flex' }}>
        <Paper
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            marginBottom: '0.25rem',
          }}
        >
          <FLeftContent />
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <FTopContent />
            <FContent />
            <FBottomContent />
          </Box>
          <FRightContent />
        </Paper>
      </Container>
    </Box>
  )
}

export default FLayout

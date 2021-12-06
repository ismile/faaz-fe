import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import useModal from '../components/hooks/useModal'
import { useSnackbar } from 'notistack'

export default function UserForm() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const _openModal = useModal(
    (s) => s._openModal,
    () => true
  )

  const _handleConfirmDialog = async () => {
    var d = await _openModal({ body: 'Konfirmasi Dialog' })
    if(d) {
      enqueueSnackbar('Confirmed!', {variant: 'success'})
    } else {
      enqueueSnackbar('Cancelled!', {variant: 'info'})
    }
  }

  const _handleClosOnlyButton = async () => {
    var d = await _openModal({
      title: 'Info',
      body: 'Just Info, you can close it!',
      cancelText: 'Tutup',
      okText: false,
    })
    enqueueSnackbar('closed', {variant: 'info'})
  }

  const _handleCustomAction = async () => {
    var d = await _openModal({
      title: 'Custom Action',
      body: 'Hello World!',
      Actions: ({ _resolve }) => (
        <>
          <Button
            onClick={() => {
              _resolve('bye!', true)
              enqueueSnackbar('Bye!', {variant: 'warning'})
            }}
            color="secondary"
          >
            Say Bye
          </Button>
          <Button
            onClick={() => {
              _resolve('hi!', true)
              enqueueSnackbar('Hi!', {variant: 'warning'})
            }}
            color="secondary"
          >
            Say Hi
          </Button>
          <Button
            onClick={() => {
              _resolve('hello!', true)
              enqueueSnackbar('Hello!', {variant: 'success'})
            }}
            color="primary"
            variant="contained"
          >
            Say Hello
          </Button>
        </>
      ),
    })
    console.log(d)
  }

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toolbar className="animate__animated animate__delay-200ms animate__faster animate__fadeInDown">
        <Box sx={{ flex: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          SAMPLE GRID
        </Typography>
        <Box sx={{ flex: 1, display: 'flex' }}></Box>
      </Toolbar>
      <Container sx={{ flex: 1 }}>
        <Paper sx={{ marginBottom: '0.5rem', padding: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              color="primary"
              onClick={_handleConfirmDialog}
            >
              Confirm Dialog
            </Button>
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              color="primary"
              onClick={_handleClosOnlyButton}
            >
              Close Only Button
            </Button>
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              color="primary"
              onClick={_handleCustomAction}
            >
              Custom Action
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

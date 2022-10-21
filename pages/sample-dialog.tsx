import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import useModal from '../components/faaz/hooks/useModal'
import { useSnackbar } from 'notistack'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import TextField from '../components/faaz/form/TextField'
import { useEffect, useState } from 'react'
import TabPanel from '../components/others/TabPanel'
import AppBar from '@mui/material/AppBar'

export default function UserForm() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const _openModal = useModal(
    (s) => s._openModal,
    () => true
  )

  const _handleConfirmDialog = async (id = 'default') => {
    var d = await _openModal(
      { body: 'Konfirmasi Dialog', fullWidth: false },
      id
    )
    console.log(d)
    if (d) {
      enqueueSnackbar('Confirmed!', { variant: 'success' })
    } else {
      enqueueSnackbar('Cancelled!', { variant: 'info' })
    }
  }

  const _handleClosOnlyButton = async () => {
    var d = await _openModal({
      title: 'Info',
      body: 'Just Info, you can close it!',
      cancelText: 'Tutup',
      okText: false,
    })
    enqueueSnackbar('closed', { variant: 'info' })
  }

  const _handleCustomAction = async (id = 'default') => {
    var d = await _openModal(
      {
        title: 'Custom Action',
        body: 'Hello World!',
        actions: ({ _resolve }) => (
          <>
            <Button
              onClick={() => {
                _resolve('bye!', true)
                enqueueSnackbar('Bye!', { variant: 'warning' })
              }}
              color="secondary"
            >
              Say Bye
            </Button>
            <Button
              onClick={() => {
                _resolve('hi!', true)
                enqueueSnackbar('Hi!', { variant: 'warning' })
              }}
              color="secondary"
            >
              Say Hi
            </Button>
            <Button
              onClick={() => {
                _resolve('hello!', true)
                enqueueSnackbar('Hello!', { variant: 'success' })
              }}
              color="primary"
              variant="contained"
            >
              Say Hello
            </Button>
          </>
        ),
      },
      id
    )
    console.log(d)
  }

  const _handleFormDialog = async () => {
    var d = await _openModal({
      title: 'Sign Up',
      body: ({ _setCustomProps }) => {
        const { control, handleSubmit, reset } = useForm({})

        useEffect(() => {
          _setCustomProps({ handleSubmit, reset })
        }, [_setCustomProps])

        return (
          <Box sx={{ padding: '20px 24px', paddingTop: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: '100%' }}
                  control={control}
                  label="First Name"
                  name="firstName"
                  rules={{ required: 'First name required' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: '100%' }}
                  control={control}
                  label="Lirst Name"
                  name="lastName"
                  rules={{ required: 'Last name required' }}
                />
              </Grid>
            </Grid>
          </Box>
        )
      },
      okText: 'Submit',
      onOk: (_resolve, customProps) => {
        customProps.handleSubmit((value) => {
          _resolve(value, true)
        })()
      },
    })

    if (d) {
      enqueueSnackbar(`hello ${d.lastName}, ${d.firstName}!`, {
        variant: 'info',
      })
    }
  }

  const _handleFormDialogCustomAction = async () => {
    var d = await _openModal({
      title: 'Sign Up Custom Action',
      body: ({ _setCustomProps }) => {
        const { control, handleSubmit, reset } = useForm({
          defaultValues: { firstName: '', lastName: '' },
        })

        useEffect(() => {
          _setCustomProps({ handleSubmit, reset })
        }, [_setCustomProps])

        return (
          <Box sx={{ padding: '20px 24px', paddingTop: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: '100%' }}
                  control={control}
                  label="First Name"
                  name="firstName"
                  rules={{ required: 'First name required' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: '100%' }}
                  control={control}
                  label="Lirst Name"
                  name="lastName"
                  rules={{ required: 'Last name required' }}
                />
              </Grid>
            </Grid>
          </Box>
        )
      },
      actions: ({ _resolve, customProps }) => (
        <>
          <Button
            onClick={() => {
              _resolve(false, true)
            }}
            color="primary"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              customProps.reset()
            }}
            color="primary"
          >
            Reset
          </Button>
          <Button
            onClick={() => {
              customProps.handleSubmit((value) => {
                _resolve(value, true)
              })()
            }}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </>
      ),
    })

    if (d) {
      enqueueSnackbar(`hello ${d.lastName}, ${d.firstName}!`, {
        variant: 'info',
      })
    }
  }

  const _handleDialogWithTab = async () => {
    var d = await _openModal({
      title: false,
      body: () => {
        const [value, setValue] = useState('one')

        const handleChange = (event, newValue) => {
          setValue(newValue)
        }
        return (
          <>
            <AppBar position="static" color="transparent">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                textColor="inherit"
                aria-label="wrapped label tabs example"
              >
                <Tab
                  value="one"
                  label="New Arrivals in the Longest Text of Nonfiction that should appear in the next line"
                  wrapped
                />
                <Tab value="two" label="Item Two" />
                <Tab value="three" label="Item Three" />
              </Tabs>
            </AppBar>
            <TabPanel value="one" index={value} sx={{ height: 200 }}>
              ONE (1)
            </TabPanel>
            <TabPanel value="two" index={value} sx={{ height: 200 }}>
              TWO (2)
            </TabPanel>
            <TabPanel value="three" index={value} sx={{ height: 200 }}>
              THREE (3)
            </TabPanel>
          </>
        )
      },
    })
  }

  const _handleNestedDialog = async () => {
    var d = await _openModal({
      body: 'Nested Dialog',
      actions: ({ _resolve }) => (
        <>
          <Button
            onClick={() => {
              _handleConfirmDialog('id-nested')
              // _resolve('hi!', true)
              // enqueueSnackbar('Hi!', { variant: 'warning' })
            }}
            color="secondary"
          >
            Another Dialog
          </Button>
          <Button
            onClick={() => {
              _resolve('hello!', true)
              enqueueSnackbar('Hello!', { variant: 'success' })
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
    if (d) {
      enqueueSnackbar('Confirmed!', { variant: 'success' })
    } else {
      enqueueSnackbar('Cancelled!', { variant: 'info' })
    }
  }

  const _handleFullScreenDialog = async (id = 'default') => {
    var d = await _openModal(
      { body: 'Full Screen Dialog', fullScreen: true },
      id
    )
    console.log(d)
    if (d) {
      enqueueSnackbar('Confirmed!', { variant: 'success' })
    } else {
      enqueueSnackbar('Cancelled!', { variant: 'info' })
    }
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
        <Box sx={{ flex: 1, display: { xs: 'none', sm: 'flex' } }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Modal/Dialog
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
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              color="primary"
              onClick={_handleFormDialog}
            >
              Form Dialog
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              color="primary"
              onClick={_handleFormDialogCustomAction}
            >
              Form Dialog With Custom Action
            </Button>
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              color="primary"
              onClick={_handleDialogWithTab}
            >
              Dialog With Tab
            </Button>

            <Button
              sx={{ m: 2 }}
              variant="outlined"
              color="primary"
              onClick={_handleNestedDialog}
            >
              Nested Dialog
            </Button>

            <Button
              sx={{ m: 2 }}
              variant="outlined"
              color="primary"
              onClick={_handleFullScreenDialog}
            >
              Full Screen Dialog
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

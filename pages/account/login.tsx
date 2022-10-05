import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import TextField from '../../components/faaz/form/TextField'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Avatar from '@mui/material/Avatar'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useAuthStore } from '../../stores/AuthStore'
import { useRouter } from 'next/router'
import { showSnackbar } from '../../stores/NotificationStore'

function Login() {
  const router = useRouter()
  const { control, handleSubmit, reset } = useForm({defaultValues: {username: 'admin', password: 'admin'}})
  const [_login] = useAuthStore(
    (state) => [state._login],
    (ps, ns) => true
  )

  const _onSubmit = async (data) => {
    var res = await _login(data)
    router.push('/')
  }

  return (
    <Paper
      sx={{
        bgcolor: 'background.main',
        width: 700,
        margin: { xs: 10, sm: 0 },
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Box
        sx={{
          width: 240,
          padding: 10,
          display: { sm: 'flex', xs: 'none' },
          bgcolor: 'primary.main',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flex: 1 }} />
        <Link href="#" variant="body2" sx={{ color: 'white' }}>
          {"Don't have an account? Sign Up"}
        </Link>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 10,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <Box sx={{ padding: '8px 14px' }}>
            <Grid container spacing={2} padding={4}>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: '100%' }}
                  control={control}
                  label="Username"
                  name="username"
                  rules={{ required: 'First name required' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: '100%' }}
                  control={control}
                  label="Password"
                  name="password"
                  type="password"
                  rules={{ required: 'First name required' }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} padding={4}>
              <Grid item xs={6}>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={6}></Grid>

              <Grid item xs={12} sx={{ mt: 4 }}>
                <Button
                  sx={{ width: '100%' }}
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleSubmit(_onSubmit)}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
            <br />
          </Box>
          <Box
            sx={{
              height: 80,
              width: '100%',
              padding: 10,
              display: { sm: 'none', xs: 'flex' },
              bgcolor: 'primary.main',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ flex: 1 }} />
            <Link href="#" variant="body2" sx={{ color: 'white' }}>
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

Login.Layout = function ({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '100%',
        position: 'absolute',
        zIndex: 1000,
        top: 0,
        left: 0,
        overflow: 'hidden',
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='3000' height='2000' preserveAspectRatio='none' viewBox='0 0 3000 2000'%3e%3cg mask='url(%26quot%3b%23SvgjsMask3558%26quot%3b)' fill='none'%3e%3crect width='3000' height='2000' x='0' y='0' fill='url(%23SvgjsLinearGradient3559)'%3e%3c/rect%3e%3cpath d='M0 0L920.74 0L0 745.44z' fill='rgba(255%2c 255%2c 255%2c .1)'%3e%3c/path%3e%3cpath d='M0 745.44L920.74 0L1580.55 0L0 1265.7800000000002z' fill='rgba(255%2c 255%2c 255%2c .075)'%3e%3c/path%3e%3cpath d='M0 1265.7800000000002L1580.55 0L2237.92 0L0 1616.9900000000002z' fill='rgba(255%2c 255%2c 255%2c .05)'%3e%3c/path%3e%3cpath d='M0 1616.9900000000002L2237.92 0L2420.8 0L0 1737.5500000000002z' fill='rgba(255%2c 255%2c 255%2c .025)'%3e%3c/path%3e%3cpath d='M3000 2000L1601.3 2000L3000 1380.17z' fill='rgba(0%2c 0%2c 0%2c .1)'%3e%3c/path%3e%3cpath d='M3000 1380.17L1601.3 2000L1421 2000L3000 1337.91z' fill='rgba(0%2c 0%2c 0%2c .075)'%3e%3c/path%3e%3cpath d='M3000 1337.9099999999999L1421 2000L1240.35 2000L3000 688.3899999999999z' fill='rgba(0%2c 0%2c 0%2c .05)'%3e%3c/path%3e%3cpath d='M3000 688.3899999999999L1240.35 2000L1046.96 2000L3000 200.00999999999988z' fill='rgba(0%2c 0%2c 0%2c .025)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask3558'%3e%3crect width='3000' height='2000' fill='white'%3e%3c/rect%3e%3c/mask%3e%3clinearGradient x1='8.33%25' y1='-12.5%25' x2='91.67%25' y2='112.5%25' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient3559'%3e%3cstop stop-color='rgba(87%2c 198%2c 248%2c 1)' offset='0'%3e%3c/stop%3e%3cstop stop-color='rgba(3%2c 169%2c 244%2c 1)' offset='1'%3e%3c/stop%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e")`,
        // bgcolor: 'primary.main',
        // flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Box>
  )
}

export default Login

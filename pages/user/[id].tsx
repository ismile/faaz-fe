import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import TextField from '../../components/form/TextField'
import { useUserStore } from '../../stores/UserStore'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/dist/client/router'
import Button from '@material-ui/core/Button'

export default function UserForm() {
  const { control, handleSubmit } = useForm({})
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const router = useRouter()

  const [_create] = useUserStore(
    (state) => [state._create],
    (ps, ns) => true
  )

  const _onSubmit = async (data) => {
    await _create({...data, isActive: true})
    enqueueSnackbar('Data telah berhasil dibuat')
    router.back()
  }

  const _handleBack = async () => {
    router.back()
  }
  return (
    <div className="h-full w-full flex flex-col">
      <Toolbar>
        <Typography variant="h6">SAMPLE GRID</Typography>
        <div className="flex-1" />
      </Toolbar>
      <Paper className="ag-theme-material mb-1">
        <div className="grid grid-cols-12 gap-4 p-4">
          <TextField
            control={control}
            label="First Name"
            name="firstName"
            className="col-span-6"
            rules={{ required: 'First name required' }}
          />
          <TextField
            control={control}
            label="Last Name"
            name="lastName"
            className="col-span-6"
            rules={{ required: 'First name required' }}
          />
        </div>
        <div className="p-4 bg-gray-100 flex flex-row">
          <div className="flex-1"></div>
          <Button
            className="mr-2"
            variant="text"
            onClick={_handleBack}
          >
            Kembali
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit(_onSubmit)}
          >
            Submit
          </Button>
        </div>
      </Paper>
    </div>
  )
}

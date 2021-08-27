import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import TextField from '../../components/form/TextField'
import CheckBoxField from '../../components/form/CheckBoxField'
import { useUserStore } from '../../stores/UserStore'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/dist/client/router'
import Button from '@material-ui/core/Button'
import { useEffect } from 'react'
import tw from 'twin.macro'
import RadioField from '../../components/form/RadioField'


export default function UserForm() {
  const { control, handleSubmit, reset } = useForm({})
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const router = useRouter()
  const [_create, _getOne, _update] = useUserStore(
    (state) => [state._create, state._getOne, state._update],
    (ps, ns) => true
  )

  useEffect(() => {
    if(router.query.id != 'new') {
      _getInitialValues()
    }
  }, [router.query.id])

  const _getInitialValues = async () => {
    var res = await _getOne(router.query.id)
    reset({...res.data, role: 'user', gender: {name: 'male'}})
  }

  const _onSubmit = async (data) => {
    console.log(data)
    return true
    if(router.query.id != 'new') {
      await _update(data)
      enqueueSnackbar('Data telah berhasil diupdate', {
        variant: 'success',
      })
    } else {
      await _create(data)
      enqueueSnackbar('Data telah berhasil dibuat', {
        variant: 'success',
      })
    }

    router.back()
  }

  const _handleBack = async () => {
    router.back()
  }
  return (
    <div tw="h-full w-full flex flex-col">
      <Toolbar>
        <Typography variant="h6">SAMPLE GRID</Typography>
        <div tw="flex-1" />
      </Toolbar>
      <Paper tw="mb-1">
        <div tw="grid grid-cols-12 gap-4 p-4">
          <TextField
            control={control}
            label="First Name"
            name="firstName"
            tw="col-span-6"
            rules={{ required: 'First name required' }}
          />
          <TextField
            control={control}
            label="Last Name"
            name="lastName"
            tw="col-span-6"
            rules={{ required: 'First name required' }}
          />
          <CheckBoxField
            control={control}
            label="Is Active"
            name="isActive"
            tw="col-span-12"
            rules={{ required: 'First name required' }}
          />
          <RadioField
            control={control}
            label="Roles"
            name="role"
            options={[{value: 'user', label: 'user'}, {value: 'admin', label: 'admin'}]}
            tw="col-span-12"
            rules={{ required: 'First name required' }}
          />
          <RadioField
            control={control}
            label="Gender"
            name="gender"
            options={[{id: 'male', name: 'Male'}, {id: 'female', name: 'Female'}]}
            valueField='id'
            labelField='name'
            tw="col-span-12"
            rules={{ required: 'First name required' }}
          />
        </div>
        <div tw="p-4 bg-gray-100 flex flex-row">
          <div tw="flex-1"></div>
          <Button
            tw="mr-2"
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

import { useController } from 'react-hook-form'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import tw from 'twin.macro'
import Switch from '@mui/material/Switch';

export default function SwitchField({
  control,
  label,
  className,
  name,
  rules = {},
}: {
  control: any
  label: string
  className?: string
  name: string
  rules?: Object
}) {
  const {
    field: { ref, onChange, value },
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
    rules: rules,
    defaultValue: '',
  })

  return (
    <FormControl
      required
      error={!!error}
      component="fieldset"
      className={className}
    >
      <FormControlLabel
        control={
          <Switch
            checked={Boolean(value)}
            onChange={onChange}
            name="checkedB"
            color="primary"
          />
        }
        label={label}
        inputRef={ref}
      />
      {error && <FormHelperText tw="ml-4">{error.message}</FormHelperText>}
    </FormControl>
  )
}

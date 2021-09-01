import { useController } from 'react-hook-form'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import tw from 'twin.macro'
import Switch from '@material-ui/core/Switch';

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

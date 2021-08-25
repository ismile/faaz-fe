import { useForm, Controller, useController, useFormContext} from 'react-hook-form'
import TextFieldReact from '@material-ui/core/TextField'

export default function TextField({
  control,
  label,
  className,
  name,
  variant = 'filled',
  rules = {},
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
    <TextFieldReact
      label={label}
      className={className}
      variant={variant}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error ? error.message : null}
      inputRef={ref}
    />
  )
}

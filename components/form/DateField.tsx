import {
  useForm,
  Controller,
  useController,
  useFormContext,
} from 'react-hook-form'
import TextFieldReact from '@mui/material/TextField'
import DatePicker from '@mui/lab/DatePicker'
import Dayjs from 'dayjs'

export default function DateField({
  control,
  label,
  className,
  name,
  variant = 'filled',
  rules = {},
  serialize = null,
  normalize = null,
  sx
}: {
  control: any
  label: string
  className?: string
  name: string
  variant?: 'filled' | 'standard' | 'outlined'
  rules?: Object,
  serialize?: Function,
  normalize?: Function,
  sx?: Object
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

  const _handleChange = (e) => {
    if(normalize) {
      console.log(e, 'asd')
      onChange( normalize(e))
    } else {
      onChange(e)
    }
  }

  const getInputValue = ()=> {
    if(serialize) {
      return serialize(value)
    } else {
      value
    }
  }

  return (
    <DatePicker
      label={label}
      value={getInputValue()}
      onChange={_handleChange}
      inputRef={ref}
      renderInput={(params) => (
        <TextFieldReact
          sx={sx}
          {...params}
          variant={variant}
          label={label}
          className={className}
          error={!!error}
          helperText={error ? error.message : null}
        />
      )}
    />
  )
}

DateField.jsonSerialize = function(e) {
  return Dayjs(e)
}

DateField.jsonNormalize = function(e) {
  return e.toJSON()
}

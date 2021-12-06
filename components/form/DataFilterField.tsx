import {
  useForm,
  Controller,
  useController,
  useFormContext,
} from 'react-hook-form'
import TextFieldReact from '@mui/material/TextField'
import DataFilter, {TYPE_STRING, TYPE_NUMBER} from '../others/Datafilter'


function DataFilterField({
  control,
  label,
  className,
  name,
  variant = 'filled',
  rules = {},
  options = null,
  sx
}: {
  control: any
  label: string
  className?: string
  name: string
  variant?: 'filled' | 'standard' | 'outlined'
  rules?: Object,
  options?: Array<any>,
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

  return (
    <DataFilter options={options} value={value?value:[]} onChange={onChange} />
  )
}

DataFilterField.TYPE_STRING = TYPE_STRING
DataFilterField.TYPE_NUMBER = TYPE_NUMBER

export default DataFilterField;

import { useController } from 'react-hook-form'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import tw from 'twin.macro'
import { useEffect, useState } from 'react'

export default function RadioField({
  control,
  className,
  name,
  label,
  rules = {},
  options = [],
  valueField = null,
  labelField = null,
}: {
  control: any
  label: string
  className?: string
  name: string
  rules?: Object
  valueField?: string
  labelField?: string
  options: Array<{value: any, label: string}| any>
}) {
  const [optionMap, setOptionMap] = useState({})
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

  useEffect(()=> {
    if(valueField) {
      setOptionMap(options.reduce((pv, cv)=> {
        pv[cv[valueField]] = cv
        return pv
      }, {}))
    }
  }, [JSON.stringify(options)])

  const _handleChange = (e) => {
    if(valueField) {
      onChange({...e, target: {...e.target, value: optionMap[e.target.value]}})
    } else {
      onChange(e)
    }
  }

  return (
    <FormControl
      required
      error={!!error}
      component="fieldset"
      className={className}
    >
      <FormLabel component="legend" >{label}</FormLabel>
      <RadioGroup
        aria-label={`${name}-label`}
        name={name}
        value={valueField?value[valueField]:value}
        onChange={_handleChange}
      >
        {options.map((d, i)=> {
          var value = d.value;
          var label = d.label
          if(valueField) {
            value = d[valueField]
            label = d[labelField]
          }
          return <FormControlLabel key={`${name}-${i}`} value={value} label={label} control={<Radio />} />
        })}
      </RadioGroup>
      {error && <FormHelperText tw="ml-4">{error.message}</FormHelperText>}
    </FormControl>
  )
}

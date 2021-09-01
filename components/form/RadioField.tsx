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
  dataKey = null,
  labelField = null,
  getOptionValue= (d, valueField)=> (d[valueField]),
  getOptionLabel= (d, labelField)=> (d[labelField])
}: {
  control: any
  label: string
  className?: string
  name: string
  rules?: Object
  valueField?: string
  dataKey?: string
  getOptionValue?: Function
  labelField?: string
  getOptionLabel?: Function
  get
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
        if(valueField === 'object') {
          pv[cv[dataKey]] = cv
        } else {
          pv[cv[valueField]] = cv
        }
        return pv
      }, {}))
    }
  }, [JSON.stringify(options)])

  const _handleChange = (e) => {
    if(valueField && valueField === 'object') {
        onChange({...e, target: {...e.target, value: optionMap[e.target.value]}})
    } else {
      onChange(e)
    }
  }

  const getInputValue = ()=> {
    var v = null
    if(valueField && valueField === 'object') {
      v = value?value[dataKey]:null
    } else {
      v = value
    }
    return v?v:''
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
        value={getInputValue()}
        onChange={_handleChange}
      >
        {options.map((d, i)=> {
          var value = d.value;
          var label = d.label
          if(valueField) {
            if(valueField === 'object') {
              value = getOptionValue(d, dataKey)
            } else {
              value = getOptionValue(d, valueField)
            }
            label = getOptionLabel(d, labelField)
          }
          return <FormControlLabel key={`${name}-${i}`} value={value} label={label} control={<Radio />} />
        })}
      </RadioGroup>
      {error && <FormHelperText tw="ml-4">{error.message}</FormHelperText>}
    </FormControl>
  )
}

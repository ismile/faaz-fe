import {
  useForm,
  Controller,
  useController,
  useFormContext,
} from 'react-hook-form'
import tw from 'twin.macro'
import React, { useEffect, useState } from 'react'
import TextFieldReact from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/core/Autocomplete'

export default function AutocompleteField({
  control,
  label,
  className,
  name,
  variant = 'filled',
  rules = {},
  options = [],
  labelField = null,
  valueField = null,
  getOptionLabel = (d, labelField) => d[labelField],
  renderOption = null,
  multiple = false,
}: {
  control: any
  label: string
  className?: string
  name: string
  variant?: 'filled' | 'standard' | 'outlined'
  rules?: Object
  valueField?: string
  labelField?: string
  options?: Array<any>
  getOptionLabel?: Function
  renderOption?: Function
  multiple?: boolean
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

  const [inputValue, setInputValue] = useState('')
  const [optionMap, setOptionMap] = useState({})

  useEffect(() => {
    if (valueField && valueField != 'object') {
      setOptionMap(
        options.reduce((pv, cv) => {
          pv[cv[valueField]] = cv
          return pv
        }, {})
      )
    }
  }, [JSON.stringify(options)])

  const _handleChange = (e, value) => {
    if (valueField && valueField != 'object') {
      var v = value[valueField]
      if(multiple) {
        v = value.map(d => d[valueField])
      }
      onChange({ ...e, target: { ...e.target, value: v } })
    } else {
      onChange({ ...e, target: { ...e.target, value: value } })
    }
  }

  const _handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue)
  }

  const _getOptionLabel = (option) => {
    return getOptionLabel(option, labelField)
      ? getOptionLabel(option, labelField)
      : ''
  }

  const getInputValue = () => {
    var v = value
    if (valueField && valueField != 'object') {
      if(multiple) {
        v = v.map((d)=> optionMap[d])
      } else {
        v = optionMap[value]
      }

    }
    if (!v) {
      if (multiple) {
        v = []
      } else {
        v = {}
      }
    }
    return v
  }

  return (
    <Autocomplete
      multiple={multiple}
      disablePortal
      id={`${name}-select`}
      options={options}
      value={getInputValue()}
      onChange={_handleChange}
      inputValue={inputValue}
      onInputChange={_handleInputChange}
      getOptionLabel={_getOptionLabel}
      classes={{
        root: className,
      }}
      renderOption={renderOption}
      renderInput={(params) => (
        <TextFieldReact
          {...params}
          label={label}
          error={!!error}
          helperText={error ? error.message : null}
        />
      )}
    />
  )
}

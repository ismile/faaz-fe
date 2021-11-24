import {
  useForm,
  Controller,
  useController,
  useFormContext,
} from 'react-hook-form'
import React, { useEffect, useMemo, useState } from 'react'
import TextFieldReact from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import debounce from 'lodash/debounce'
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
  fetchOption = undefined,
  isOptionEqualToValue = undefined,
  sx
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
  fetchOption?: Function
  isOptionEqualToValue?: Function,
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

  const [inputValue, setInputValue] = useState('')
  const [optionMap, setOptionMap] = useState({})
  const [open, setOpen] = React.useState(false)
  const [asyncOption, setAsyncOption] = useState([])

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
      if (multiple) {
        v = value.map((d) => d[valueField])
      }
      onChange({ ...e, target: { ...e.target, value: v } })
    } else {
      onChange({ ...e, target: { ...e.target, value: value } })
    }
  }

  const _handleInputChange = (event, newInputValue) => {
    _fetchData(inputValue)
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
      if (multiple) {
        v = v.map((d) => optionMap[d])
      } else {
        v = optionMap[value]
      }
    }
    if (!v) {
      if (multiple) {
        v = []
      } else {
        v = null
      }
    }
    return v
  }

  // async

  useEffect(() => {
    if (!open) {
      _fetchData()
    }
  }, [open])

  useEffect(() => {}, [inputValue])

  const _fetchData = useMemo(
    () =>
      debounce(async (text) => {
        if (fetchOption) {
          const res = await fetchOption(text)
          setAsyncOption(res)
        }
      }, 1000),
    []
  )

  const _handleOpen = () => {
    setOpen(true)
  }
  const _handleClose = () => {
    setOpen(false)
  }

  return (
    <Autocomplete
      sx={sx}
      multiple={multiple}
      disablePortal
      onOpen={fetchOption ? _handleOpen : null}
      onClose={fetchOption ? _handleClose : null}
      id={`${name}-select`}
      options={fetchOption ? asyncOption : options}
      value={getInputValue()}
      onChange={_handleChange}
      inputValue={inputValue}
      onInputChange={_handleInputChange}
      getOptionLabel={_getOptionLabel}
      classes={{
        root: className,
      }}
      renderOption={renderOption}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params) => (
        <TextFieldReact
          {...params}
          variant={variant}
          label={label}
          error={!!error}
          helperText={error ? error.message : null}
        />
      )}
    />
  )
}

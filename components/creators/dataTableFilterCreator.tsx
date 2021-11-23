import FilterListIcon from '@mui/icons-material/FilterList'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import SwipeableViews from 'react-swipeable-views'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import Switch from '@mui/material/Switch'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import queryString from 'query-string'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

export function dataTableFilterCreator(useStore) {
  const SwitchTable = ({ dataKey }) => {
    const [columnSetting, _toggleColumn] = useStore(
      (state) => [state.columnSetting[dataKey], state._toggleColumn],
      (ps, ns) => ps[0] == ns[0]
    )
    return (
      <Switch
        edge="end"
        onChange={(e, v) => {
          _toggleColumn(dataKey)
        }}
        checked={Boolean(columnSetting)}
        inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
      />
    )
  }

  const DataTableFilter = () => {
    const filterOpen = useStore((state) => state.filterOpen)

    const [activeTab, setActiveTab] = useState(0)
    const _handleChangeTab = (e, v) => setActiveTab(v)
    const _handleChangeIndex = (v) => setActiveTab(v)
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'rgb(243, 244, 246)',
          borderRight: '1px solid rgb(229, 231, 235)',
          width: filterOpen?260:0,
        }}
        // css={['flex flex-col h-full bg-gray-100 border-0 border-r border-gray-200 border-solid transition-width transition-slowest ease-in-out transform', filterOpen && tw`w-80`, !filterOpen && tw`w-0`]}
      >
        {/* <AppBar position="static" > */}
        <Tabs
          sx={{ height: '4rem' }}
          value={activeTab}
          onChange={_handleChangeTab}
          variant="standard"
          indicatorColor="primary"
          // textColor="primary"
          // centered
        >
          <Tab sx={{ height: '4rem' }} icon={<FilterListIcon />} />
          <Tab sx={{ height: '4rem' }} icon={<ViewColumnIcon />} />
        </Tabs>

        <SwipeableViews
          tw="flex-1"
          index={activeTab}
          onChangeIndex={_handleChangeIndex}
        >
          <Box sx={{ flex: 1 }}>
            <ColumnSort />
            <Divider />
            <ColumnFilter />
          </Box>
          <div>
            <ColumnSelector />
          </div>
        </SwipeableViews>

        {/* </AppBar> */}
      </Box>
    )
  }

  const ColumnSelector = () => {
    const columns = useStore(
      (state) => state.columns,
      (ps, ns) => true
    )

    return (
      <List
        subheader={
          <Typography
            // tw={classes.dividerFullWidth}
            sx={{ padding: '1rem' }}
            color="textSecondary"
            display="block"
            variant="caption"
          >
            Kolom
          </Typography>
        }
      >
        {columns
          .filter((d) => !(d.key == 'action_' || d.key == 'check_'))
          .map((d) => {
            return (
              <ListItem key={d.key}>
                <ListItemText id={'switch_' + d.key} primary={d.title} />
                <ListItemSecondaryAction>
                  <SwitchTable dataKey={d.key} />
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
      </List>
    )
  }

  const ColumnSort = () => {
    const [columns, _setSort, _fetch] = useStore(
      (state) => [state.columns, state._setSort, state._fetch],
      (ps, ns) => true
    )

    const defaultValues = useStore(
      (state) => ({
        sort: state.sort,
        order: state.order,
        page: state.page,
        limit: state.limit,
        filter: state.filter,
      }),
      (ps, ns) => JSON.stringify(ps) == JSON.stringify(ns)
    )

    const { control, handleSubmit } = useForm({
      defaultValues,
    })

    const onSubmit = (data) => {
      var query = queryString.parse(window.location.hash)
      if (!query) query = {}
      query.sort = data.sort
      query.order = data.order

      window.location.hash = '#' + queryString.stringify(query)
    }
    return (
      <Grid container spacing={2}>
        <Typography
          // tw={classes.dividerFullWidth}
          sx={{
            gridColumn: 12,
          }}
          color="textSecondary"
          display="block"
          variant="caption"
        >
          Urutan
        </Typography>
        <Controller
          name="sort"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl sx={{ gridColumn: 'span 7' }} variant="filled">
              <InputLabel id="id-kolom-input-label">Kolom</InputLabel>
              <Select
                labelId="id-kolom-label"
                id="id-kolom"
                value={value ? value : ''}
                defaultValue=""
                onChange={onChange}
              >
                <MenuItem value=""></MenuItem>
                {columns
                  .filter((d) => !(d.key == 'action_' || d.key == 'check_'))
                  .map((d) => {
                    return (
                      <MenuItem key={d.key} value={d.key}>
                        {d.title}
                      </MenuItem>
                    )
                  })}
              </Select>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
          rules={{ required: 'First name required' }}
        />
        <Controller
          name="order"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl sx={{ gridColumn: 'span 5' }} variant="filled">
              <InputLabel id="id-sort-input-label">ORDER</InputLabel>
              <Select
                labelId="id-sort-label"
                id="id-sort"
                defaultValue=""
                value={value ? value : ''}
                onChange={onChange}
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value={'ASC'}>ASC</MenuItem>
                <MenuItem value={'DESC'}>DESC</MenuItem>
              </Select>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
          rules={{ required: 'First name required' }}
        />

        <Box sx={{ display: 'flex', gridColumn: 'span 12' }}>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit(onSubmit)}
          >
            Urutkan
          </Button>
        </Box>
      </Grid>
    )
  }

  const ColumnFilter = () => {
    const [columns, _fetch] = useStore(
      (state) => [state.columns, state._fetch],
      (ps, ns) => true
    )

    const defaultValues = useStore(
      (state) => ({
        sort: state.sort,
        order: state.order,
        page: state.page,
        limit: state.limit,
        filter: state.filter,
      }),
      (ps, ns) => JSON.stringify(ps) == JSON.stringify(ns)
    )

    const { control, handleSubmit, reset } = useForm({
      defaultValues: {
        ...defaultValues,
        ...queryString.parse(window.location.hash),
      },
    })

    const onSubmit = (data) => {
      var query = queryString.parse(window.location.hash)
      if (!query) query = {}
      query.field = data.field
      query.criteria = data.criteria
      query.key = data.key

      window.location.hash = '#' + queryString.stringify(query)
    }

    const _clear = () => {
      reset({})
      window.location.hash = '#'
    }

    return (
      <Grid container spacing={2}>
        <Typography
          // tw={classes.dividerFullWidth}
          sx={{
            gridColumn: 12,
          }}
          color="textSecondary"
          display="block"
          variant="caption"
        >
          Pencarian
        </Typography>
        <Controller
          name="field"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl
              sx={{
                gridColumn: 'span 12',
              }}
              variant="filled"
            >
              <InputLabel id="id-field-input-label">Kolom</InputLabel>
              <Select
                labelId="id-field-label"
                id="id-field"
                defaultValue=""
                value={value ? value : ''}
                onChange={onChange}
              >
                <MenuItem value=""></MenuItem>
                {columns
                  .filter((d) => !(d.key == 'action_' || d.key == 'check_'))
                  .map((d) => {
                    return (
                      <MenuItem key={d.key} value={d.key}>
                        {d.title}
                      </MenuItem>
                    )
                  })}
              </Select>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
          rules={{ required: 'First name required' }}
        />
        <Controller
          name="criteria"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl
              sx={{
                gridColumn: 'span 12',
              }}
              variant="filled"
            >
              <InputLabel id="id-criteria-select-label">Kriteria</InputLabel>
              <Select
                labelId="id-criteria-label"
                id="id-criteria"
                value={value ? value : ''}
                defaultValue=""
                onChange={onChange}
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="contains">Contains</MenuItem>
                <MenuItem value="startswith">Starts with</MenuItem>
                <MenuItem value="endswith">Ends with</MenuItem>\
                <MenuItem value="isnull">Is null</MenuItem>
                <MenuItem value="lt">Lower than</MenuItem>
                <MenuItem value="lte">Lower than equals</MenuItem>
                <MenuItem value="gt">Greater than</MenuItem>
                <MenuItem value="gte">Greater than equals</MenuItem>
              </Select>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
          rules={{ required: 'First name required' }}
        />
        <Controller
          name="key"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              label="Kata Kunci"
              sx={{
                gridColumn: 'span 12',
              }}
              variant="filled"
              value={value ? value : ''}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
          rules={{ required: 'First name required' }}
        />
        <Box sx={{display: 'flex', gridColumn: 'span 12',}}>
          <Box sx={{flex: 1}} />
          <Button sx={{marginRight: '0.5rem'}} variant="text" color="secondary" onClick={_clear}>
            Clear
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit(onSubmit)}
          >
            Cari
          </Button>
        </Box>
      </Grid>
    )
  }

  return DataTableFilter
}

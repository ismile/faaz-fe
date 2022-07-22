import FilterListIcon from '@mui/icons-material/FilterList'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import queryString from 'query-string'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import SwipeableViews from 'react-swipeable-views'
import DataFilterField from '../form/DataFilterField'

export function dataTableFilterCreator(useStore) {
  const SwitchTable = ({ dataKey, hidden }) => {
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
        checked={!hidden}
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
          bgcolor: 'background.default',
          borderRight: '1px solid rgba(0,0,0,.1)',
          width: filterOpen ? 260 : 0,
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
          sx={{ flex: 1 }}
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
      (ps, ns) => JSON.stringify(ps) === JSON.stringify(ns)
    )

    return (
      <List
        subheader={
          <Typography
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
          .map((d, i) => {
            return (
              <ListItem key={d.key}>
                <ListItemText id={'switch_' + d.key} primary={d.title} />
                <ListItemSecondaryAction>
                  <SwitchTable dataKey={d.key} hidden={d.hidden} />
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
      <Grid container spacing={2} padding={4}>
        <Grid item xs={12}>
          <Typography color="textSecondary" display="block" variant="caption">
            Urutan
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <Controller
            name="sort"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl sx={{ width: '100%' }} variant="filled">
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
        </Grid>
        <Grid item xs={5}>
          <Controller
            name="order"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl sx={{ width: '100%' }} variant="filled">
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
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex' }}>
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
        filter: state.filter?state.filter:[]
      }),
      (ps, ns) => true
    )

    const { control, handleSubmit, reset } = useForm({
      defaultValues: {
        ...defaultValues,
        filter:Object.keys(queryString.parse(
          typeof window !== 'undefined' ? window.location.hash : '#'
        )).filter(x => x.search("__") >= 0).map(x => {
          var d = x.split("__");

          return {field: d[0], operator: d[1], value: queryString.parse(
            typeof window !== 'undefined' ? window.location.hash : '#'
          )[x]}
        }),
        ...queryString.parse(
          typeof window !== 'undefined' ? window.location.hash : '#'
        ),
      },
    })

    const onSubmit = (data) => {
      var query = queryString.parse(window.location.hash)
      if (!query) query = {}

      Object.keys(query).forEach(x => {
        if(x.search("__") >= 0) {
          delete query[x]
        }
      })
      query.filter = data.filter.forEach(x => {
        query[`${x.field}__${x.operator}`] = x.value
      })

      console.log(data, 'data')
      window.location.hash = '#' + queryString.stringify(query)
    }

    const _clear = () => {
      reset({})
      window.location.hash = '#'
    }

    return (
      <Grid container spacing={2} padding={4}>
        <Grid item xs={12}>
          <Typography
            sx={{
              gridColumn: 12,
            }}
            color="textSecondary"
            display="block"
            variant="caption"
          >
            Pencarian
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <DataFilterField
            control={control}
            label="Filter"
            name="filter"
            options={columns
              .filter((d) => !(d.key == 'action_' || d.key == 'check_'))
              .map((x) => {
                var d = (() => {
                  switch (x.type) {
                    case 'string':
                      return DataFilterField.TYPE_STRING
                    case 'number':
                      return DataFilterField.TYPE_NUMBER
                    default:
                      return DataFilterField.TYPE_STRING
                  }
                })()

                return {
                  field: x.key,
                  label: x.title,
                  ...d
                }
              })}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: 1 }} />
            <Button
              sx={{ marginRight: '0.5rem' }}
              variant="text"
              color="secondary"
              onClick={_clear}
            >
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
      </Grid>
    )
  }

  return DataTableFilter
}

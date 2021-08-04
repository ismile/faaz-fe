import ListItemIcon from '@material-ui/core/ListItemIcon'
import FilterListIcon from '@material-ui/icons/FilterList'
import ViewColumnIcon from '@material-ui/icons/ViewColumn'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Divider from '@material-ui/core/Divider'
import SwipeableViews from 'react-swipeable-views'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Switch from '@material-ui/core/Switch'
import clsx from 'clsx'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'
import { useState } from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

export function dataTableFilterCreator(useStore) {

  const SwitchTable = ({dataKey})=> {
    const [columnSetting, _toggleColumn] = useStore(
      (state) => [state.columnSetting[dataKey], state._toggleColumn],
      (ps, ns) => ps[0]== ns[0]
    )
    return <Switch
    edge="end"
    onChange={(e,v)=> {_toggleColumn(dataKey)}}
    checked={Boolean(columnSetting)}
    inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
  />
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
            // className={classes.dividerFullWidth}
            className="p-4"
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
            return <ListItem key={d.key}>
              <ListItemText id={"switch_"+d.key} primary={d.title} />
              <ListItemSecondaryAction>
                <SwitchTable dataKey={d.key} />
              </ListItemSecondaryAction>
            </ListItem>
          })}
      </List>
    )
  }
  const DataTableFilter = () => {
    const filterOpen = useStore((state) => state.filterOpen)

    const [activeTab, setActiveTab] = useState(0)
    const _handleChangeTab = (e, v) => setActiveTab(v)
    const _handleChangeIndex = (v) => setActiveTab(v)

    const { control, handleSubmit } = useForm()
    const onSubmit = (data) => console.log(data)

    return (
      <div
        className={clsx(
          'flex flex-col h-full bg-gray-100 border-0 border-r border-gray-200 border-solid transition-width transition-slowest ease-in-out transform ',
          {
            'w-80': filterOpen,
            'w-0': !filterOpen,
          }
        )}
      >
        {/* <AppBar position="static" > */}
        <Tabs
          value={activeTab}
          onChange={_handleChangeTab}
          variant="standard"
          indicatorColor="primary"
          className="h-16"
          // textColor="primary"
          // centered
        >
          <Tab className="h-16" icon={<FilterListIcon />} />
          <Tab className="h-16" icon={<ViewColumnIcon />} />
        </Tabs>

        <SwipeableViews
          className="flex-1"
          index={activeTab}
          onChangeIndex={_handleChangeIndex}
        >
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="">
              <div className="grid grid-cols-12 gap-4 p-4">
                <Typography
                  // className={classes.dividerFullWidth}
                  className="col-span-12"
                  color="textSecondary"
                  display="block"
                  variant="caption"
                >
                  Urutan
                </Typography>
                <Controller
                  name="criteria"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl className="col-span-7" variant="filled">
                      <InputLabel id="demo-simple-select-label">
                        Kolom
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={value}
                        onChange={onChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                      {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                  rules={{ required: 'First name required' }}
                />
                <Controller
                  name="criteria"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl className="col-span-5" variant="filled">
                      <InputLabel id="demo-simple-select-label">
                        ORDER
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={value}
                        onChange={onChange}
                      >
                        <MenuItem value={10}>ASC</MenuItem>
                        <MenuItem value={20}>DESC</MenuItem>
                      </Select>
                      {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                  rules={{ required: 'First name required' }}
                />

                <div className="flex col-span-12">
                  <div className="flex-1" />
                  <Button variant="contained" color="secondary">
                    Urutkan
                  </Button>
                </div>
              </div>
            </form>
            <Divider />
            <form onSubmit={handleSubmit(onSubmit)} className="">
              <div className="grid grid-cols-12 gap-4 p-4">
                <Typography
                  // className={classes.dividerFullWidth}
                  className="col-span-12"
                  color="textSecondary"
                  display="block"
                  variant="caption"
                >
                  Pencarian
                </Typography>
                <Controller
                  name="column"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl className="col-span-12" variant="filled">
                      <InputLabel id="demo-simple-select-label">
                        Kolom
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={value}
                        onChange={onChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                      {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                  rules={{ required: 'First name required' }}
                />
                <Controller
                  name="criteria"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl className="col-span-12" variant="filled">
                      <InputLabel id="demo-simple-select-label">
                        Kriteria
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={value}
                        onChange={onChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                      {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                  rules={{ required: 'First name required' }}
                />
                <Controller
                  name="key"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      label="Kata Kunci"
                      className="col-span-12"
                      variant="filled"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                  rules={{ required: 'First name required' }}
                />
                <div className="flex col-span-12">
                  <div className="flex-1" />
                  <Button variant="contained" color="secondary">
                    Cari
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div>
            <ColumnSelector />
          </div>
        </SwipeableViews>

        {/* </AppBar> */}
      </div>
    )
  }

  return DataTableFilter
}

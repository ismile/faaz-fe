import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'

import FilterListIcon from '@material-ui/icons/FilterList'
import storeCreator from '../components/creators/storeCreator'
import dataTableCreator from '../components/creators/dataTableCreator'
import MenuIcon from '@material-ui/icons/Menu'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const { useStore } = storeCreator()
const { DataTable, TableFilter, TablePagination } = dataTableCreator({
  useStore: useStore,
  colAction: true,
  ActionElement: ({ data, anchorEl, handleClick, handleClose }) => {
    return (
      <>
        <IconButton
          size="small"
          color="inherit"
          aria-label="open drawer"
          onClick={handleClick}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </>
    )
  },
  columns: [
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 100,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      resizeable: true,
      width: 800,
    },
    {
      title: 'Operations',
      dataIndex: '',
      key: 'operations',
      width: 100,
      render: (d) => <a href="#">{d.age}</a>,
    },
  ],
})

export default function Home() {
  const [data, _toggleFilterOpen] = useStore(
    (state) => [state.data, state._toggleFilterOpen],
    (oldTreats, newTreats) =>
      JSON.stringify(oldTreats[0]) == JSON.stringify(newTreats[0])
  )
  const columns = useStore(
    (state) => state.columns,
    (ps, ns) => true
  )

  return (
    <div className="h-full w-full flex flex-col">
      <Toolbar>
        <Typography variant="h6">SAMPLE GRID</Typography>
        <div className="flex-1" />
        <Button variant="contained" color="secondary" className="mr-2">
          hellow
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={_toggleFilterOpen}
        >
          <FilterListIcon />
        </Button>
      </Toolbar>

      {/* <Paper className="mt-2 p-6"> */}
      <Paper className="flex flex-1 flex-row ag-theme-material mb-1">
        <TableFilter />
        <div className="flex-1 flex flex-col w-full">
          <div className="flex-1 flex-row">
            <DataTable data={data} columns={columns} />
          </div>
          <Toolbar className="flex flex-row">
            <IconButton onClick={_toggleFilterOpen}>
              <FilterListIcon />
            </IconButton>
            <div className="flex-1" />
            <TablePagination />
          </Toolbar>
        </div>
      </Paper>

      {/* </Paper> */}
    </div>
  )
}

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import storeCreator from '../components/creators/storeCreator'
import dataTableCreator from '../components/creators/dataTableCreator'
import MenuIcon from '@material-ui/icons/Menu'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { useEffect } from 'react'
import FilterListIcon from '@material-ui/icons/FilterList'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

export default function Home() {
  const [_toggleFilterOpen, _fetch] = useStore(
    (state) => [state._toggleFilterOpen, state._fetch],
    (ps, ns) => true
  )

  useEffect(() => {
    _fetch()
  }, [])

  return (
    <div className="h-full w-full flex flex-col">
      <Toolbar>
        <Typography variant="h6">SAMPLE GRID</Typography>
        <div className="flex-1" />
        <DefaultTopAction />
      </Toolbar>

      {/* <Paper className="mt-2 p-6"> */}
      <Paper className="flex flex-1 flex-row ag-theme-material mb-1">
        <TableFilter />
        <div className="flex-1 flex flex-col w-full">
          <div className="flex-1 flex-row">
            <DataTable />
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

const { useStore } = storeCreator()
const { DataTable, TableFilter, TablePagination, DefaultTopAction } =
  dataTableCreator({
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
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              Edit
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Menu>
        </>
      )
    },
    columns: [
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        width: 100,
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        resizeable: true,
        width: 800,
      },
    ],
  })

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'

import IconButton from '@material-ui/core/IconButton'
import FilterListIcon from '@material-ui/icons/FilterList'
import storeCreator from '../components/creators/storeCreator'
import dataTableCreator from '../components/creators/dataTableCreator'

const {useStore} = storeCreator()
const {DataTable,TableFilter, TablePagination} = dataTableCreator({useStore: useStore})

export default function Home() {
  const [data, _toggleFilterOpen] = useStore(
    (state) => [state.data, state._toggleFilterOpen],
    (oldTreats, newTreats) =>  JSON.stringify(oldTreats[0]) == JSON.stringify(newTreats[0])
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





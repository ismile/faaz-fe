import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import FilterListIcon from '@mui/icons-material/FilterList'
import Divider from '@mui/material/Divider'
import FDataTablePagination from './FDataTablePagination'
import FDataTableWatcher from './FDataTableWatcher'
import Box from '@mui/material/Box'

const FDataTablePaginationBar = ({ useStore, FLeftContent }) => {
  const [_toggleFilterOpen] = useStore(
    (state) => [state._toggleFilterOpen],
    (ps, ns) => true
  )

  return (
    <>
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          borderTop: '1px solid rgba(0,0,0,.2)',
        }}
      >
        <IconButton sx={{ marginRight: 2 }} onClick={_toggleFilterOpen}>
          <FilterListIcon />
        </IconButton>
        {FLeftContent && <FLeftContent />}
        <Box sx={{ flex: 1 }} />
        <FDataTablePagination useStore={useStore} />
      </Toolbar>
      <FDataTableWatcher useStore={useStore} />
    </>
  )
}

export default FDataTablePaginationBar

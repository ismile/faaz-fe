import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import GridViewIcon from '@mui/icons-material/GridView'
import ListIcon from '@mui/icons-material/List'
import RefreshIcon from '@mui/icons-material/Refresh'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Toolbar from '@mui/material/Toolbar'
import { useRouter } from 'next/dist/client/router'
import { useState } from 'react'
import FLayout from '../components/faaz/layout/FLayout'
import FDataTable from '../components/faaz/table/FDataTable'
import FDataTableFilter from '../components/faaz/table/FDataTableFilter'
import FDataTablePagination from '../components/faaz/table/FDataTablePagination'
import FDataTablePaginationBar from '../components/faaz/table/FDataTablePaginationBar'
import FDataTableWatcher from '../components/faaz/table/FDataTableWatcher'
import FToolbar from '../components/faaz/toolbar/FToolbar'
import { useUserStore } from '../stores/UserStore'

export default function User() {
  const [_toggleFilterOpen, _fetch, routerPath] = useUserStore(
    (state) => [state._toggleFilterOpen, state._fetch, state.routerPath],
    (ps, ns) => true
  )
  const [view, setView] = useState('table')
  const router = useRouter()

  return (
    <FLayout
      FToolbar={() => (
        <FToolbar
          title="User"
          actions={[
            {
              text: 'Refresh',
              variant: 'text',
              icon: <RefreshIcon />,
              sx: {
                marginRight: '0.5rem',
                color: 'text.primary',
              },
              onClick: () => _fetch(),
            },
            {
              text: 'Tambah',
              color: 'secondary',
              variant: 'contained',
              icon: <AddIcon />,
              sx: {
                color: 'text.primary',
              },
              onClick: () => router.push(`${routerPath}/new`),
            },
          ]}
        />
      )}
      FLeftContent={() => <FDataTableFilter useStore={useUserStore} />}
      FContent={() => (
        <FDataTable
          useStore={useUserStore}
          columns={[
            {
              title: 'Nama',
              dataKey: 'nama',
              key: 'nama',
              width: 100,
              sortable: true,
            },
            {
              title: 'Email',
              dataKey: 'email',
              key: 'email',
              width: 200,
              sortable: true,
            },
            {
              title: 'Nomor Identitas',
              dataKey: 'nomorIdentitas',
              key: 'nomorIdentitas',
              resizeable: true,
              width: 1200,
            },
          ]}
        />
      )}
      FBottomContent={() => (
        <FDataTablePaginationBar
          useStore={useUserStore}
          FLeftContent={() => {
            return (
              <>
                <Divider sx={{ marginRight: 3 }} orientation="vertical" />
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={view}
                  onChange={(e, v) => setView(v)}
                >
                  <ToggleButton value="table">
                    <ListIcon />
                  </ToggleButton>
                  <ToggleButton value="grid">
                    <GridViewIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </>
            )
          }}
        />
      )}
    />
  )
}

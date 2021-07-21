import Head from 'next/head'
import Image from 'next/image'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Layout from '../components/layout'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import { TABLE_ICONS } from '../configs/table'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useRef, useState } from 'react'
import { useWindowResize } from '../components/hooks/useWindowResize'
import RCTable from 'rc-table'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TablePagination from '@material-ui/core/TablePagination'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import immer from 'immer'
import zustand from 'zustand'
import { memo } from 'react'
import { Resizable } from 'react-resizable'
import debounce from 'lodash/debounce'
import shallow from 'zustand/shallow'

const rowKey = 'id'

const useStore = zustand((set) => ({
  isAllSelected: false,
  selected: {},
  selectedArr: [],
  _handleSingleSelect: (d, val) =>
    set(
      immer((draft) => {
        if (draft.selected[d[rowKey]]) {
          delete draft.selected[d[rowKey]]
        } else {
          draft.selected[d[rowKey]] = d
        }

        draft.selectedArr = Object.keys(draft.selected).map((key) => {
          return draft.selected[key]
        })
      })
    ),
  _handleSelectAll: (data) =>
    set(
      immer((draft) => {
        draft.isAllSelected = !draft.isAllSelected
        if (draft.isAllSelected) {
          data.forEach((d, i) => {
            draft.selected[d[rowKey]] = d
          })
        } else {
          data.forEach((d, i) => {
            delete draft.selected[d[rowKey]]
          })
        }

        draft.selectedArr = Object.keys(draft.selected).map((key) => {
          return draft.selected[key]
        })
      })
    ),
}))



export default function Home() {


  const [
    selected,
    selectedArr,
    isAllSelected,
    _handleSingleSelect,
    _handleSelectAll,
  ] = useStore((state) => [
    state.selected,
    state.selectedArr,
    state.isAllSelected,
    state._handleSingleSelect,
    state._handleSelectAll,
  ])

  const columns = [
    {
      title: (
        <Checkbox
          key={`check-all`}
          className="p-0"
          checked={isAllSelected}
          onChange={() => {
            _handleSelectAll(data)
          }}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      ),
      dataIndex: 'check',
      key: 'check',
      width: 60,
      fixed: 'left',
      render: (v, d) => {
        return (
          <Checkbox
            key={`checkbox-${d[rowKey]}`}
            className="p-0"
            checked={selected[d[rowKey]]}
            onChange={function (ev, val) {
              _handleSingleSelect(d, val)
            }}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        )
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'name',
      width: 80,
      fixed: 'left',
      render: (d) => (
        <IconButton
          size="small"
          color="inherit"
          aria-label="open drawer"
          onClick={() => {}}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
      ),
    },
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
      title: 'Name 1',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: 'Age 1',
      dataIndex: 'age',
      key: 'age',
      width: 100,
    },
    {
      title: 'Address 1',
      dataIndex: 'address',
      key: 'address',
      width: 200,
    },
    {
      title: 'Name 2',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: 'Age 2',
      dataIndex: 'age',
      key: 'age',
      width: 100,
    },
    {
      title: 'Address 2',
      dataIndex: 'address',
      key: 'address',
      width: 200,
    },
    {
      title: 'Operations',
      dataIndex: '',
      key: 'operations',
      width: 100,
      render: (d) => <a href="#">{d.age}</a>,
    },
  ]

  return (
    <Layout>
      <div className="h-full w-full flex flex-col">
        <Toolbar>
          <Typography variant="h6">SAMPLE GRID</Typography>
          <div className="flex-1" />
          <Button variant="contained" color="secondary" className="mr-2">
            hellow
          </Button>
          <Button variant="contained" color="secondary">
            hellow
          </Button>
        </Toolbar>

        {/* <Paper className="mt-2 p-6"> */}
        <Paper className="flex flex-1 flex-col ag-theme-material mb-1">
          <div className="flex-1 w-full">
            <div className="h-full w-full">
              <DataTable columns={columns} />
            </div>
          </div>
          <Toolbar className="flex flex-row">
            <div className="flex-1">Selected: {selectedArr.length}</div>
            <TablePagination
              component="div"
              count={100}
              page={1}
              onPageChange={() => {}}
              rowsPerPage={10}
              onRowsPerPageChange={() => {}}
            />
          </Toolbar>
        </Paper>

        {/* </Paper> */}
      </div>
    </Layout>
  )
}

const DataTable = ({ width, height, columns }) => {
  const [size, setSize] = useState({ height: 0, width: 0 })
  const _handleSetSize = debounce(({ height, width }) => {
    console.log(width, height)
    setSize({ height, width })
  }, 500)
  return (
    <>
      <AutoSizer
        onResize={({ height, width }) => {
          _handleSetSize({ height, width })
        }}
      >
        {({ height, width }) => (
          <RCTable
            // tableLayout="fixed"
            // sticky
            style={{ width: size.width, height: size.height }}
            columns={columns}
            data={data}
            scroll={{ x: size.width, y: size.height - 53 }}
            rowKey={rowKey}
            components={{
              table: memo((props) => <Table {...props} />),
              header: {
                wrapper: memo((props) => <TableHead {...props} />),
                row: memo((props) => <TableRow {...props} />),
                cell: memo((props) => {
                  const { onResize, width, resizeable, ...restProps } = props
                  if (!(width && resizeable)) {
                    return <TableCell {...props} />
                  }

                  return (
                    <Resizable width={width} height={0} onResize={onResize}>
                      <TableCell {...restProps} />
                    </Resizable>
                  )
                }),
              },
              body: {
                wrapper: memo((props) => <TableBody {...props} />),
                row: memo((props) => <TableRow {...props} />),
                cell: memo((props) => <TableCell {...props} />),
              },
            }}
          />
        )}
      </AutoSizer>
    </>
  )
}

const data = [
  { name: 'Jack', age: 28, address: 'some where', id: '1' },
  { name: 'Rose', age: 36, address: 'some where', id: '2' },
  { name: 'Jack', age: 28, address: 'some where', id: '3' },
  { name: 'Rose', age: 36, address: 'some where', id: '4' },
  { name: 'Jack', age: 28, address: 'some where', id: '5' },
  { name: 'Rose', age: 36, address: 'some where', id: '6' },
  { name: 'Jack', age: 28, address: 'some where', id: '7' },
  { name: 'Rose', age: 36, address: 'some where', id: '8' },
  { name: 'Jack', age: 28, address: 'some where', id: '9' },
  { name: 'Rose', age: 36, address: 'some where', id: '10' },
  { name: 'Jack', age: 28, address: 'some where', id: '11' },
  { name: 'Rose', age: 36, address: 'some where', id: '12' },
  { name: 'Jack', age: 28, address: 'some where', id: '13' },
  { name: 'Rose', age: 36, address: 'some where', id: '14' },
  { name: 'Jack', age: 28, address: 'some where', id: '15' },
  { name: 'Rose', age: 36, address: 'some where', id: '16' },
  { name: 'Jack', age: 28, address: 'some where', id: '17' },
  { name: 'Rose', age: 36, address: 'some where', id: '18' },
]

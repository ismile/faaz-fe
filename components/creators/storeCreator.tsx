import immer from 'immer'
import zustand from 'zustand'
import MenuIcon from '@material-ui/icons/Menu'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'

interface IStoreCreatorConfig {
  rowKey?: String,

}

function storeCreator(config:IStoreCreatorConfig = {
  rowKey: 'id'
}) {
  const rowKey = config.rowKey

  const useStore = zustand((set) => ({
    data: [
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
    ],
    columns: [
      {
        title: 'Checkbox',
        key: 'check',
        dataIndex: 'check',
        width: 60,
        fixed: 'left',
        onHeaderCell: (column) => ({
          width: column.width,
          type: 'checkbox',
          Element: () => {
            const [isAllSelected, _handleSelectAll] = useStore((state) => [
              state.isAllSelected,
              state._handleSelectAll,
            ])
            return (
              <Checkbox
                key={`check-all`}
                className="p-0"
                checked={isAllSelected}
                onChange={_handleSelectAll}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            )
          },
        }),
        render: (v, d) => {
          const [selected, _handleSingleSelect] = useStore((state) => [
            state.selected,
            state._handleSingleSelect,
          ])
          return (
            <Checkbox
              key={`checkbox-${d[rowKey]}`}
              className="p-0"
              checked={!!selected[d[rowKey]]}
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
        title: 'Operations',
        dataIndex: '',
        key: 'operations',
        width: 100,
        render: (d) => <a href="#">{d.age}</a>,
      },
    ],
    isAllSelected: false,
    selected: {},
    selectedArr: [],

    filterOpen: false,

    _toggleFilterOpen: () => {
      if (window) window.dispatchEvent(new Event('resize'))
      return set(
        immer((draft) => {
          draft.filterOpen = !draft.filterOpen
        })
      )
    },

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
    _handleSelectAll: () =>
      set(
        immer((draft) => {
          draft.isAllSelected = !draft.isAllSelected
          if (draft.isAllSelected) {
            draft.data.forEach((d, i) => {
              draft.selected[d[rowKey]] = d
            })
          } else {
            draft.data.forEach((d, i) => {
              delete draft.selected[d[rowKey]]
            })
          }

          draft.selectedArr = Object.keys(draft.selected).map((key) => {
            return draft.selected[key]
          })
        })
      ),
  }))

  return {
    useStore
  }
}


export default storeCreator

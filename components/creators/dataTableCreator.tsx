
import RCTable from 'rc-table'
import { useRef } from 'react'
import useElementSize from '../hooks/useElementSize'
import TableComponents from '../TableComponents'
import { dataTableFilterCreator } from './DataTableFilterCreator'
import TablePaginationMaterial from '@material-ui/core/TablePagination'
interface IDataTableCreatorConfig {
  rowKey?: String,
  useStore?:any,
  dataTableFilterCreator: Function,
}

function dataTableCreator(config:IDataTableCreatorConfig={
  rowKey: 'id',
  dataTableFilterCreator: dataTableFilterCreator
}) {


  const DataTable = ({ data, columns}) => {
    const squareRef = useRef(null)
    const { width, height } = useElementSize(squareRef)

    return (
      <div className="h-full w-full" ref={squareRef}>
        <div className="fixed" style={{ width, height }}>
          <RCTable
            // tableLayout="fixed"
            // sticky
            // style={{ width: width, height: height }}
            columns={columns}
            data={data}
            scroll={{ x: width, y: height - 53 }}
            rowKey={config.rowKey}
            components={TableComponents}
          />
        </div>
      </div>
    )
  }

  const TablePagination =  ()=> {
    return <TablePaginationMaterial
    component="div"
    count={100}
    page={1}
    onPageChange={() => {}}
    rowsPerPage={10}
    onRowsPerPageChange={() => {}}
  />
  }

  const TableFilter = dataTableFilterCreator(config.useStore)

  return {
    DataTable,
    TableFilter,
    TablePagination
  }
}



export default dataTableCreator;

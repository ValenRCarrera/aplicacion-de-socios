import { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';

export default function DataTable(props){
    
    let array=[];
    let headers=[];

    if (props.data != null){ 
        array=props.data
        headers=Object.keys(array[0])
    }

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, array.length - page * rowsPerPage);

    return (
    <div>
        <TableContainer>
        <Table sx={{ minWidth: 650, marginTop: 5 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {headers.map((i) => (
                <TableCell>{i}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? array.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) 
              : array)
            .map((row, key) => (
              <TableRow key={key}>
              {headers.map((col) => (
                <TableCell sx={{width:"250px"}}>{row[col]}</TableCell>
                ))}
              </TableRow>
            ))}
            {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination 
        rowsPerPageOptions={[5]}
        component="div"
        count={array.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
    )
}
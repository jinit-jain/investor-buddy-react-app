import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {Box} from "@material-ui/core";
import axios from 'axios'

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#424242",
    color: theme.palette.common.white,
    fontSize: 14,
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: "#eeeeee" //theme.palette.action.hover,
    },
  },
}))(TableRow);

const columns = [
  { id: 'ticker', label: 'Ticker', minWidth: 20 },
  { id: 'company_name', label: 'Company Name', minWidth: 40 },
  { id: 'impact', label: 'Expected Impact', minWidth: 20, align: 'right' },
  { id: 'last_updated', label: 'Last Updated', minWidth: 20, align: 'right' },
  { id: 'news_source', label: 'News Source', minWidth: 80, align: 'right' },
];

function createData(ticker, company_name, impact, last_updated, news_source) {
  return { ticker, company_name, impact, last_updated, news_source };
}


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 650,
  },
});

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 'https://stackoverflow.com/questions/57136853/make-a-material-ui-component-in-react-sticky-when-scrolling-not-appbar'),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];


export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rowss, setRowss] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(async () => {
    console.log("Started")

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'React POST Request Example' })
    };

    const temp = []

    // fetch('https://webappsvc-investor-buddy.azurewebsites.net/users/getUpdates', requestOptions)
    //   .then(results => results.json())
    //   .then(data => {
    //     console.log("Data is here")
    //     console.log(data)
    //     Object.keys(data.table).map((e,i) => {
    //       console.log(i, " ", data.table[i])
    //       temp.push(createData(data.table[i].symbol, data.table[i].company, data.table[i].sentiment,
    //          data.table[i].date, data.table[i].news))
    //     })
    //     setRowss(temp)
    //     console.log(rowss)
    //     console.log(isLoading)
    //     setIsLoading(false)
    //   });
    // }, []);

    const response = await axios.post('https://webappsvc-investor-buddy.azurewebsites.net/users/getUpdates', {
      user: 'j@j.com'
    })

    setIsLoading(false)
    let ii = 0
    Object.keys(response.data.table).map((e,i) => {
      ii += 1
            console.log(i, " ", response.data.table[i])
            temp.push(createData(response.data.table[i].symbol, response.data.table[i].company, response.data.table[i].sentiment,
              response.data.table[i].date, response.data.table[i].news))
              setRowss(false)  
              if (ii == 3) {
                console.log("Done done done")
                setIsLoading(false)
              }
          })
         
    console.log(rowss);
    
  }, [])

  return (
      <div>
      {!rowss ? 
        <Box p={5} px={12}>
          <Card className={classes.root} raised={true}>
            <TableContainer className={classes.container} >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => <StyledTableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </StyledTableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowss.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return <StyledTableRow hover >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                                <StyledTableCell key={column.id} align={column.align}>
                                  {column.id === 'news_source' ? <a href={value}>{value}</a> : value}
                                </StyledTableCell>
                            );
                          })}
                        </StyledTableRow>;
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Card>
        </Box>

        : <p>Load ho raha hai bhai</p>
  }
  </div>
  )
}

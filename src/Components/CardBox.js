import { Box, Typography} from '@mui/material';
import DataTable from './DataTable';

export default function CardBox(props) {

    let title=props.title;
    let tableBool=props.tableBool
    let table;
    let text;

    if (tableBool===true) {
        table=props.table
    } else {
        text=props.text;
    }

    return (
        <Box sx={{backgroundColor:'white', borderRadius:3, padding:5, textAlign:'center', marginTop:6}}>
            <Typography variant='h5'>{title}</Typography>
            {tableBool ? 
            <DataTable 
              data={table}
            /> 
            :
            <Typography variant='h2' fontWeight='400'>{text}</Typography>
            }
        </Box>
        
    )

}
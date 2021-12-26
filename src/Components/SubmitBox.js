import { useState } from "react";
import {Box, Grid, Button, Typography} from '@mui/material';

export default function SubmitBox({setCsvArray}) {
    
    const [csvFile, setCsvFile] = useState();
    const [disableBool, setDisableBool] = useState(true)

    const handleSubmit = () => {
        const file = csvFile;
        const reader = new FileReader();
    
        reader.onload = function(e) {
            const text = e.target.result;
            processText(text);
        }
    
        reader.readAsText(file, 'ISO-8859-1');
    }
    
      const processText = (text) => {
          const lines = text.slice(text.indexOf('\n')+1).split('\n');
          const headers= ["Nombre", "Edad", "Equipo", "EstadoCivil", "Estudios"];
    
          const newArray = lines.map( lines => {
            const values = lines.split(";");
            const eachObject = headers.reduce((obj, header, i) => {
              obj[header] = values[i];
              return obj;
                }, {})
              return eachObject;
            })
          setCsvArray(newArray);
        };
    
    return (
        <Box sx={{backgroundColor:'white', borderRadius:3, padding:5, textAlign:'center', height:'250px', marginLeft:"100px"}}>
        <label htmlFor="csvFile">
          <Grid container>
            <Grid item>
              <Button variant="contained" component="span" sx={{borderRadius:'50%', height: '60px', width: '60px', fontSize: '40px'}}>+</Button>
            </Grid>
            <Grid item>
            <Typography variant='h6' sx={{cursor:'pointer', marginLeft:2}}>Añade el archivo socios.csv</Typography>
            <input
                type='file'
                accept='.csv'
                id='csvFile'
                onChange={(e) => {
                    setCsvFile(e.target.files[0])
                    setDisableBool(false)
                }}
            />
            </Grid>
          </Grid>
        </label>
        <Button
          sx={{marginTop:"100px", width:'150px', borderRadius:3}}
          variant="contained"
          disabled={disableBool}
          onClick={(e) => {
            e.preventDefault();
            if(csvFile) {
              handleSubmit();
            }
          }}>
          Enviar
        </Button>
      </Box>
    )
    
}
import './App.css';
import { useState } from "react";
import CardBox from './Components/CardBox';
import { AppBar, Box, Grid, Button, Typography, Toolbar} from '@mui/material';
import logo from './Assets/logo.png'

function App() {

  const [csvFile, setCsvFile] = useState();
  const [csvArray, setCsvArray] = useState([]);

  var totalLength = 0;
  var totalRacing = 0;
  var ageRacing = 0;
  var marriedPeople = [];
  var commonRiver = [];
  var commonRiverObj = [];
  var allTeams = [];
  

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

    const calcInfo = (array) => {
      totalLength = Object.keys(array).length;
      csvArray.forEach((i) => {
        if (i.Equipo==='Racing') {
          totalRacing+=1;
          ageRacing+=parseInt(i.Edad)
        }
        if (i.EstadoCivil === 'Casado' && i.Estudios=== 'Universitario\r' ) {
          marriedPeople.push({"Nombre":i.Nombre, "Edad":i.Edad, "Equipo":i.Equipo});
        }
        if (i.Equipo==='River') {
          commonRiver.push(i.Nombre);
        }
        if (allTeams.some(equipo => equipo.Nombre === i.Equipo) === false && i.Equipo !== undefined) {
          allTeams.push({"Nombre": i.Equipo, "Edad": parseInt(i.Edad), "Total": 1, "Min": parseInt(i.Edad), "Max": parseInt(i.Edad)})
        } 
        if (allTeams.some(equipo => equipo.Nombre === i.Equipo) === true) {
          const objIndex = allTeams.findIndex((obj => obj.Nombre === i.Equipo));
          allTeams[objIndex].Edad += parseInt(i.Edad);
          allTeams[objIndex].Total += 1;
          if (allTeams[objIndex].Min > parseInt(i.Edad)) {
            allTeams[objIndex].Min = parseInt(i.Edad)
          }
          if (allTeams[objIndex].Max < parseInt(i.Edad)) {
            allTeams[objIndex].Max = parseInt(i.Edad)
          }
        }
      })

      marriedPeople = marriedPeople.slice(0, 100).sort((a, b) => parseInt(a.Edad) - parseInt(b.Edad));

      commonRiver = commonRiver.reduce((counts, num) => {
        counts[num] = (counts[num] || 0) + 1;
        return counts;
      }, {});
      commonRiver = Object.entries(commonRiver).sort(([,a],[,b]) => b-a).slice(0,5)
      commonRiver.map((i) => (
        commonRiverObj.push({"Nombre": i[0], "Total": i[1]})
      ))

      allTeams = allTeams.map((i) => {
        return {...i, Promedio: (i.Edad / i.Total).toFixed(2)}
      })
      allTeams = allTeams.sort((a, b) => b.Total - a.Total)
      allTeams.forEach(function(v){
        delete v.Edad
      })
    }

  return (
    <div className="App">
      <AppBar sx={{padding:'10px', backgroundColor: '#0e0f0f'}}>
      <Toolbar>
        <img src={logo} alt="logo" width="40px" height="40px"/>
        <Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft:1}}>Aplicación de Socios</Typography>
        </Box>
      </Toolbar>
      </AppBar>
      
      {csvArray.length>0 
      ? 
      <Grid container rowSpacing={10} > 
        {calcInfo(csvArray)}
        <Grid item md={12}/>
        <Grid item md={1}/>
        <Grid item md={4}>
        <CardBox
          title="La cantidad total de personas registradas es:"
          text={totalLength}
          tableBool={false}
        />
        </Grid>
        <Grid item md={2}/>
        <Grid item md={4}>
          <CardBox
            title="El promedio de edad de los socios de Racing es de:"
            text={(ageRacing/totalRacing).toFixed(2) + " años"} 
            tableBool={false}
          />
        </Grid>
        <Grid item md={1}/>
        <Grid item md={1}/>
        <Grid item xs={12} md={4}>
          <CardBox
            title="Listado de las 100 primeras personas casadas con estudios universitarios"
            table={marriedPeople}
            tableBool={true}
          />
        </Grid>
        <Grid item md={2}/>
        <Grid item xs={12} md={4}>
          <CardBox
            title="Los nombres mas comúnes entre los hinchas de River son:"
            table={commonRiverObj}
            tableBool={true}
          />
        </Grid>
        <Grid item md={1}/>
        <Grid item md={2}/>
        <Grid item xs={12} md={8}>
          <CardBox
            title="Listado de los equipos con el promedio de edad de sus socios y la menor y mayor edad registrada"
            table={allTeams}
            tableBool={true}
          />
        </Grid>
        <Grid item md={4}/>
      </Grid>
      : 
      <Grid container sx={{backgroundColor:'#282c34', minHeight:'100vh', overflow:'hidden', overflowY:'hidden'}} direction="column" alignItems="start" justifyContent="center" >
          <Grid item>
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
                      }}
                  />
                  </Grid>
                </Grid>
              </label>
              <Button
                sx={{marginTop:"100px", width:'150px', borderRadius:3}}
                variant="contained"
                onClick={(e) => {
                  e.preventDefault();
                  if(csvFile) {
                    handleSubmit();
                  }
                }}>
                Enviar
              </Button>
            </Box>
          </Grid>
      </Grid>
      }
    </div>
  );
}

export default App;

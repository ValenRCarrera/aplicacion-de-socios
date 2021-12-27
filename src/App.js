import './App.css';
import { useState } from "react";
import CardBox from './Components/CardBox';
import SubmitBox from './Components/SubmitBox';
import { AppBar, Box, Grid, Typography, Toolbar} from '@mui/material';
import logo from './Assets/logo.png'

function App() {

  const [csvArray, setCsvArray] = useState([]);

  let totalLength = 0;
  let totalRacing = 0;
  let ageRacing = 0;
  let marriedPeople = [];
  let commonRiver = [];
  let commonRiverObj = [];
  let allTeams = [];

    const calcInfo = (array) => {

      totalLength = Object.keys(array).length;

      array.forEach((i) => {

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
      <Toolbar >
        <img src={logo} alt="logo" width="40px" height="40px" style={{cursor:'pointer'}} onClick={() => window.location.reload()}/>
        <Box>
          <Typography variant="h6" component="div" onClick={() => window.location.reload()} sx={{ flexGrow: 1, marginLeft:1, cursor:'pointer'}}>Aplicación de Socios</Typography>
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
            title="Los nombres más comunes entre los hinchas de River son:"
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
      <Grid container sx={{backgroundColor:'#282c34', minHeight:'100vh'}} alignItems="center" justifyContent="start">
        <Grid item md={1}/>
        <Grid item>
          <SubmitBox 
            setCsvArray={setCsvArray}
          />
        </Grid>
      </Grid>
      }
    </div>
  );
}

export default App;

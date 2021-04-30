import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {TextField} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {Timeline, TimelineItem} from "@material-ui/lab";
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineDot from "@material-ui/lab/TimelineDot";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import Paper from "@material-ui/core/Paper";
import FastfoodIcon from '@material-ui/icons/Fastfood';
import axios from "axios";

function Copyright() {
  return (
          <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
              Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const webServiceUrl = 'http://localhost:8080/life-events'

function createTimelineData(birthYearResp1, birthYearResp2, birthYear){
  const timelineData = {
    combinedEraEvents: []
  }
  const length = Math.min(...[birthYearResp1.data.lifeEventsEvents.length, birthYearResp2.data.lifeEventsEvents.length])
  for(let i = 0; i < length; i++){
    timelineData.combinedEraEvents.push({
      birthYear1Events: [...birthYearResp1.data.lifeEventsEvents[i].events],
      birthYear2Events: [...birthYearResp2.data.lifeEventsEvents[i].events],
      relativeYear: birthYearResp1.data.lifeEventsEvents[i].year - birthYear
    })
  }
  console.log("timeline data", timelineData)
  return timelineData
}

function EraEvents({era}){
  const classes = useStyles();
 return(
         <>
           {era.birthYear1Events.map((eraEvent, i) => (

         <TimelineItem>
           <TimelineOppositeContent>
             <Paper elevation={3} className={classes.paper}>
               <Typography variant="h6" component="h1">
                 {eraEvent?.name}
               </Typography>
               <Typography>{eraEvent?.imgUrl}</Typography>
             </Paper>
           </TimelineOppositeContent>
           <TimelineSeparator>
             <TimelineConnector />
           </TimelineSeparator>
           <TimelineContent>
             {era.birthYear2Events[i]?.name && (
             <Paper elevation={3} className={classes.paper}>
               <Typography variant="h6" component="h1">
                 {era.birthYear2Events[i]?.name}
               </Typography>
               <Typography>{era.birthYear2Events[i]?.imgUrl}</Typography>
             </Paper>
             )}
           </TimelineContent>
         </TimelineItem>
                                     )
            )
           }
           </>
 )
}

export default function App() {
  const [birthYear1, setBirthYear1] = React.useState('');
  const [birthYear2, setBirthYear2] = React.useState('');
  const [isComparedView, setIsComparedView] = React.useState(false)
  const [timelineData, setTimelineData] = React.useState()
  const classes = useStyles();

  async function compareClicked() {
    setIsComparedView(true)
    try {
    const birthYear1Response = await axios.get(`${webServiceUrl}/${birthYear1}`)
    const birthYear2Response = await axios.get(`${webServiceUrl}/${birthYear2}`)
    setTimelineData(createTimelineData(birthYear1Response, birthYear2Response, birthYear1))
    } catch (e) {
      console.log(e, "Something went wrong fetching date data")
    }
  }

  return (
          <React.Fragment>
            <CssBaseline />
            <AppBar position="relative">
              <Toolbar>
                <Typography variant="h6" color="inherit" noWrap>
                  Memory Compare
                </Typography>
              </Toolbar>
            </AppBar>
            {!isComparedView ? (
            <main>
              {/* Hero unit */}
              <div className={classes.heroContent}>
                <Container maxWidth="sm">
                  <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Memory Compare
                  </Typography>
                  <Typography variant="h5" align="center" color="textSecondary" paragraph>
                  Enter your birth year and the birth year of someone else. See how your memories compare.
                  </Typography>
                  <div className={classes.heroButtons}>
                    <Grid container justify={"center"} spacing={"4"}>
                      <Grid item container spacing={6} justify="center">
                        <Grid item>
                            <TextField variant={"outlined"} label={"Your Birth Year"} type={"number"} onChange={(e) => setBirthYear1(e.target.value)}/>
                        </Grid>
                        <Grid item>
                            <TextField variant={"outlined"} label={"Birth Year To Compare"} type={"number"} onChange={(e) => setBirthYear2(e.target.value)}/>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Button onClick={() => compareClicked()} color={"primary"} variant={"contained"}>Compare!</Button>
                      </Grid>
                    </Grid>
                  </div>
                </Container>
              </div>
              <Container className={classes.cardGrid} maxWidth="md">
                {/* End hero unit */}
              </Container>
            </main>
            ) : (
                    timelineData && (

                    <Grid container spacing={4} alignItems={"center"} justify={"center"}>
                      {/*<Grid item>*/}
                      {/*<Grid item>*/}
                      {/* <Typography>*/}
                      {/*   {birthYear1}*/}
                      {/* </Typography>*/}
                      {/*</Grid>*/}
                      {/*<Grid item>*/}
                      {/*  <Typography>*/}
                      {/*    {birthYear2}*/}
                      {/*  </Typography>*/}
                      {/*</Grid>*/}
                      {/*<Grid item>*/}
                      {/*</Grid>*/}

                      <Timeline>
                        {timelineData.combinedEraEvents.map(era => (
                                <>
                        <TimelineItem>
                          <TimelineOppositeContent>
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <Typography variant="body2" color="textSecondary">
                              {era.relativeYear > 0 ? `${era.relativeYear} years old` : 'Birth Year'}
                            </Typography>
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>
                          </TimelineContent>
                        </TimelineItem>
                                    <EraEvents era={era}/>
                                  {/*{era.}*/}
                                  {/*<TimelineItem>*/}
                                  {/*  <TimelineOppositeContent>*/}
                                  {/*    <Paper elevation={3} className={classes.paper}>*/}
                                  {/*      <Typography variant="h6" component="h1">*/}
                                  {/*        /!*{timeEvent.name}*!/*/}
                                  {/*      </Typography>*/}
                                  {/*      /!*<Typography>{timeEvent.imageUrl}</Typography>*!/*/}
                                  {/*    </Paper>*/}
                                  {/*  </TimelineOppositeContent>*/}
                                  {/*  <TimelineSeparator>*/}
                                  {/*    <TimelineConnector />*/}
                                  {/*  </TimelineSeparator>*/}
                                  {/*  <TimelineContent>*/}
                                  {/*    <Paper elevation={3} className={classes.paper}>*/}
                                  {/*      <Typography variant="h6" component="h1">*/}
                                  {/*        Eat*/}
                                  {/*      </Typography>*/}
                                  {/*      <Typography>Because you need strength</Typography>*/}
                                  {/*    </Paper>*/}
                                  {/*  </TimelineContent>*/}
                                  {/*</TimelineItem>*/}
                        </>
                        ))}
                        {/*{birthYear1Data.lifeEventsEvents.forEach((events, i) => {*/}
                        {/*  events.map((timeEvent, index) => {*/}
                        {/*  return (*/}


                        {/*  )})})*/}


                        {/*})*/}
                        {/*<TimelineItem>*/}
                        {/*  <TimelineOppositeContent>*/}
                        {/*    <Paper elevation={3} className={classes.paper}>*/}
                        {/*      <Typography variant="h6" component="h1">*/}
                        {/*        Eat*/}
                        {/*      </Typography>*/}
                        {/*      <Typography>Because you need strength</Typography>*/}
                        {/*    </Paper>*/}
                        {/*  </TimelineOppositeContent>*/}
                        {/*  <TimelineSeparator>*/}

                        {/*    <TimelineConnector />*/}
                        {/*  </TimelineSeparator>*/}
                        {/*  <TimelineContent>*/}
                        {/*    <Paper elevation={3} className={classes.paper}>*/}
                        {/*      <Typography variant="h6" component="h1">*/}
                        {/*        Eat*/}
                        {/*      </Typography>*/}
                        {/*      <Typography>Because you need strength</Typography>*/}
                        {/*    </Paper>*/}
                        {/*  </TimelineContent>*/}
                        {/*</TimelineItem>*/}
                        {/*<TimelineItem>*/}
                        {/*  <TimelineOppositeContent>*/}
                        {/*    <Paper elevation={3} className={classes.paper}>*/}
                        {/*      <Typography variant="h6" component="h1">*/}
                        {/*        Eat*/}
                        {/*      </Typography>*/}
                        {/*      <Typography>Because you need strength</Typography>*/}
                        {/*    </Paper>*/}
                        {/*  </TimelineOppositeContent>*/}
                        {/*  <TimelineSeparator>*/}

                        {/*    <TimelineConnector />*/}
                        {/*  </TimelineSeparator>*/}
                        {/*  <TimelineContent>*/}
                        {/*    <Paper elevation={3} className={classes.paper}>*/}
                        {/*      <Typography variant="h6" component="h1">*/}
                        {/*        Eat*/}
                        {/*      </Typography>*/}
                        {/*      <Typography>Because you need strength</Typography>*/}
                        {/*    </Paper>*/}
                        {/*  </TimelineContent>*/}
                        {/*</TimelineItem>*/}
                      </Timeline>
                      </Grid>
                    // </Grid>
                    )
            )}

            {/* Footer */}
            {/*<footer className={classes.footer}>*/}
            {/*  <Typography variant="h6" align="center" gutterBottom>*/}
            {/*    Footer*/}
            {/*  </Typography>*/}
            {/*  <Typography variant="subtitle1" align="center" color="textSecondary" component="p">*/}
            {/*    Something here to give the footer a purpose!*/}
            {/*  </Typography>*/}
            {/*  <Copyright />*/}
            {/*</footer>*/}
            {/* End footer */}
          </React.Fragment>
  );
}

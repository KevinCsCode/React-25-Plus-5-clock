import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Helmet,HelmetProvider } from 'react-helmet-async';
import './index.css';

/*******
GENERAL PURPOSE FUNCTIONS
*******/
/**
* Takes a millisecond value and renders in mm:ss format
* @param {Number} myInputTime
*/
function parseTimeAsMinutesSeconds(myInputTime) {
    console.log('Calling parseTimeAsMinutesSeconds to update the remaining time, ' + myInputTime);
    let outputTimeMins = Math.floor((myInputTime) / (1000 * 60));
    let outputTimeSeconds = Math.floor((myInputTime - (outputTimeMins * 1000 * 60)) / 1000);
    
    return outputTimeMins + ':' + String(outputTimeSeconds).padStart(2, '0');
}

/**
* For displaying the label of the active timer-type, i.e. 'session-label' --> Session and 'break-label' --> Break
* @param {String} myTimerLabelState
*/
function parseLabelCorrectly(myTimerLabelState) {
    let res = myTimerLabelState.replace('-label', '');
    res = res[0].toUpperCase() + res.substring(1, res.length);
    return res;
}

/*******
REACT COMPONENTS
*******/

/*
 * Main Component, storing state variables and final render
 */
function App() {
    /*Set-up of states*/
    const [timerPauseState, setTimerPauseState] = useState(false);
    const [timerLabelState, setTimerLabelState] = useState('session-label');
    const [breakTimeState, setBreakTimeState] = useState(5);
    const [sessionTimeState, setSessionTimeState] = useState(25);
    const [timerRemainingState, setTimerRemainingState] = useState('');
    const [resetState, setResetState] = useState(true);
    const [playAudioState, setPlayAudioState] = useState(false);
    const [myAudio] = useState(new Audio('./alarm_sound.wav'));

    /*Effects*/
    //E1: handle changing of the time remaining when the user presses the increment/decrement buttons for the active label
    useEffect(() => {
        if (resetState) {
            setResetState(false);
            let myUpdateTime = timerRemainingState;
            if (timerLabelState.includes('session')) {
                myUpdateTime = sessionTimeState * 60 * 1000;
            } else {
                myUpdateTime = breakTimeState * 60 * 1000;
            }
            setTimerRemainingState(myUpdateTime);
        }
    }
        , [timerLabelState, breakTimeState,timerPauseState, sessionTimeState,timerRemainingState,resetState])

    //E2: handle changing of the time remaining when the countdown is set to play
    useEffect(() => {
        if (timerPauseState) {
            //console.log('Running timer at time ' + new Date().getTime())
            let timerIntervalNew = setTimeout(
                function() {
                    if (timerRemainingState > 0) {
                        let oldTimerState = timerRemainingState;
                        setTimerRemainingState(oldTimerState - 1000);
                    } else {
                        setPlayAudioState(true);
                        let timerLabelNewValue;
                        timerLabelState === 'session-label' ? timerLabelNewValue = 'break-label' : timerLabelNewValue = 'session-label';
                        setTimerLabelState(timerLabelNewValue);
                        setResetState(true);
                    }
                }, 1000)
                return () => clearTimeout(timerIntervalNew);
                        }
    },[timerPauseState,timerRemainingState,timerLabelState])

    //E3: handle set-play for audio track, after the track has ended
    useEffect(() => {
        myAudio.addEventListener('ended', () => setPlayAudioState(false));
    },[myAudio])

    //E4: handle whether or not audio track should be played
    useEffect(() => {
        playAudioState ? myAudio.play() : myAudio.pause();
    },[myAudio,playAudioState])

    //Html for rendering
    return (
        <div className="AppMain">
            <HelmetProvider>
                <div>
                    <Helmet>
                        <title>React 25 + 5 Clock</title>
                        <meta charset="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.2.0/css/all.css" />
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" />
                        <link rel="preconnect" href="https://fonts.googleapis.com" />
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                        <link href="https://fonts.googleapis.com/css2?family=Orbitron&family=Rubik&display=swap" rel="stylesheet" />
                    </Helmet>
                </div>
            </HelmetProvider>
            <div id="main-section">
                <div className="justify-content-around d-flex" id="header-section">
                    <i className="h1 text-secondary fa-brands fa-free-code-camp"></i>
                    <h1 className="h1 text-secondary">25 + 5 Clock</h1>
                </div>
                <div className="justify-content-center" id="timer-lengths">
                    <DurationControls
                        durationType={'break'}
                        timeState={breakTimeState}
                        setTimeState={(newState) => setBreakTimeState(newState)}
                        timerRemainingState={timerRemainingState}
                        setTimerRemainingState={setTimerRemainingState}
                        timerLabelState={timerLabelState}
                        setTimerLabelState={setTimerLabelState}
                         />
                    <DurationControls
                        durationType={'session'}
                        timeState={sessionTimeState}
                        setTimeState={(newState) => setSessionTimeState(newState)}
                        timerRemainingState={timerRemainingState}
                        setTimerRemainingState={setTimerRemainingState}
                        timerLabelState={timerLabelState}
                        setTimerLabelState={setTimerLabelState}
                    />
                </div>
                <Clock
                    timerRemainingState={parseTimeAsMinutesSeconds(timerRemainingState)}
                    timerLabelState={parseLabelCorrectly(timerLabelState)}
                    playAudioState={playAudioState}
                    setPlayAudioState={setPlayAudioState}
                />
                <div id="sub-clock-controls" className="justify-content-center">
                    <div className="spacer-element"></div>
                    <PauseResetButtons
                        timerPauseState={timerPauseState}
                        setTimerPauseState={setTimerPauseState}
                        timerLabelState={timerLabelState}
                        setTimerLabelState={setTimerLabelState}
                        breakTimeState={breakTimeState}
                        setBreakTimeState={setBreakTimeState}
                        sessionTimeState={sessionTimeState}
                        setSessionTimeState={setSessionTimeState}
                        timerRemainingState={timerRemainingState}
                        setTimerRemainingState={setTimerRemainingState}
                        resetState={resetState}
                        setResetState={setResetState}
                    />
                    <div className="spacer-element"></div>
                </div>
                <div></div>
            </div>
        </div>
    );
}

/*
 * Component for Pause and Reset buttons below the main timer
 */
const PauseResetButtons = ({ timerPauseState,
    setTimerPauseState,
    timerLabelState,
    setTimerLabelState,
    breakTimeState,
    setBreakTimeState,
    sessionTimeState,
    setSessionTimeState,
    timerRemainingState,
    setTimerRemainingState,
    timerInterval,
    setTimerInterval,
    resetState,
    setResetState }) => {
    /*Event handlers */
    const handlePauseClick = () => {
        if (timerPauseState) {
            setTimerPauseState(false);
        } else {
            setTimerPauseState(true);
        }

    }

    const handleResetClick = () => {
        setResetState(true);
        setTimerLabelState('session-label');
        setBreakTimeState(5);
        setSessionTimeState(25);
        setTimerRemainingState(25 * 60 * 1000);
    }

    return (
        <div
            className="btn-group justify-content-between"
            role="group"
            id="sub-clock-controls-panel">
            <button
                className="border-0 bg-info font-weight-bold h3 text-secondary rounded"
                id="start-stop"
                type="button"
                onClick={() => handlePauseClick()}>
                <i className="fa fa-play"></i><i className="fa fa-pause"></i>
            </button>
            <div className="spacer-element"></div>
            <button
                className="border-0 bg-info font-weight-bold h3 text-secondary rounded"
                id="reset"
                type="button"
                onClick={() => handleResetClick()}>
                <i className="fa-solid fa-arrows-rotate"></i>
            </button>
        </div>
    )

}

/**
 * Component for break/session duration controls
 */
const DurationControls = ({ durationType,
    timeState,
    setTimeState,
    timerRemainingState,
    setTimerRemainingState,
    timerLabelState,
    setTimerLabelState }) => {

    /*Event handler functions*/
    const changeTimer = (bIncrement) => {
        //console.log('Change timer called for type ' + durationType + ' and with the Increment switch set to ' + bIncrement);
        let updatedTimeValue = timeState;
        //Update the relevant timer's controls
        if (bIncrement && timeState < 60) {
            updatedTimeValue+=1;
        } else if (!bIncrement &&timeState > 0) {
            updatedTimeValue-=1;
        }
        setTimeState(updatedTimeValue);

        //console.log(timerLabelState, durationType, durationType + '-label', timerLabelState === durationType + '-label');
        //If this timer is in focus, then must also update the remaining time on the form
        if (timerLabelState === durationType+'-label') {
            setTimerRemainingState(updatedTimeValue * 60 * 1000);
        }
    }

    /*Html for render*/
    return (
        <div
            className="timer-settings-box"
            id={durationType+"-items"}>
            <div
                className="btn-group justify-content-between text-secondary"
                role="group"
                id={durationType+"-buttons-container"}>
                <button
                    className="border-0 bg-info font-weight-bold h3 text-secondary rounded"
                    id={durationType+"-increment"}
                    type="button"
                    onClick={() => changeTimer(true)}>
                    <i className="fa-solid fa-arrow-up"></i>
                </button>
                <div className="spacer-element"></div>
                <p
                    className="h3 font-weight-bold text-secondary"
                    id={durationType+"-label"}>{timeState}</p>
                <div className="spacer-element"></div>
                <button
                    className="border-0 bg-info font-weight-bold h3 text-secondary rounded"
                    id={durationType+"-decrement"}
                    type="button"
                    onClick={() => changeTimer(false)}>
                    <i className="fa-solid fa-arrow-down"></i>
                </button>
            </div>
        </div>
    )

}

/**
 * Component for main countdown clock
 */
const Clock = ({ timerRemainingState,
    timerLabelState }) => {
    /*Html for render*/
    return (
        <div className="bg-info text-center rounded" id="clock">
            <p className="h2 text-primary" id="timer-label">{timerLabelState}</p>
            <p className="h2 text-danger font-weight-bold" id="time-left">{timerRemainingState}</p>
            <audio id="beep" ></audio>
        </div>
        )
}

/*******
REACT RENDER
*******/
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
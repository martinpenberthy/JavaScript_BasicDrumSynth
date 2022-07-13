/*
    Martin Penberthy
    Final Project
    Drum Synthesizer
*/

//New audio context
const audioContext = new AudioContext();
//Set up buffer for audio context
const buffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * 1,
    audioContext.sampleRate
);

//Fill buffer with random values for white noise
const channelData = buffer.getChannelData(0);
for (let i = 0; i < buffer.length; i++) {
    channelData[i] = Math.random() * 2 - 1;
    channelData[i] *= .2;
}

//Set up gain control
const primaryGainControl = audioContext.createGain();
primaryGainControl.gain.setValueAtTime(.1, 0);
primaryGainControl.connect(audioContext.destination);

//Add button for the white noise
const button = document.createElement('button');
button.innerText = "White Noise";

//When the button is clicked, give buffer to whiteNoiseSource, and play
button.addEventListener("click", () => {
    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.connect(primaryGainControl);
    whiteNoiseSource.start();
    //whiteNoiseSource.stop();
})
document.body.appendChild(button);




/**************SNARE DRUM**************/
/*
    Snare needs a highpass filter, noise and oscillator elements
*/
//Create instance of a filter
const snareFilter = audioContext.createBiquadFilter();
//Set type of filter to highpass
snareFilter.type = "highpass";
//Set cutoff to 1500hz
snareFilter.frequency.value = 1500;
//Connect snare filter to gain
snareFilter.connect(primaryGainControl);

//Make button for the snare
const snareButton = document.createElement('button');
snareButton.innerText = "Snare";

//Add event listener to the button
snareButton.addEventListener("click", () => {
    //Add white noise buffer to the whiteNoiseSource
    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = buffer;

    //Make new gain node
    const whiteNoiseGain = audioContext.createGain();
    //Set the envelope of gain
    whiteNoiseGain.gain.setValueAtTime(1, audioContext.currentTime);
    whiteNoiseGain.gain.exponentialRampToValueAtTime(.01, audioContext.currentTime + 0.2);

    //Connect to whiteNoiseSource and snare filter, then play
    whiteNoiseSource.connect(whiteNoiseGain);
    whiteNoiseGain.connect(snareFilter);
    whiteNoiseSource.start();
    whiteNoiseSource.stop(audioContext.currentTime + .2);   

    //Make an oscillator for fundamental of snare sound
    const snareOscillator = audioContext.createOscillator();
    //Set oscillator type to a triangle waveform
    snareOscillator.type = "triangle";
    //Set frequency of snare   
    snareOscillator.frequency.setValueAtTime(300, audioContext.currentTime);

    //Create gain node for oscillator
    const oscillatorGain = audioContext.createGain();
    //Set volume envelope
    oscillatorGain.gain.setValueAtTime(.7, audioContext.currentTime);
    oscillatorGain.gain.exponentialRampToValueAtTime(.01, audioContext.currentTime + .2);
    //Connect and play
    snareOscillator.connect(oscillatorGain);
    oscillatorGain.connect(primaryGainControl);
    snareOscillator.start();
    snareOscillator.stop(audioContext.currentTime + .2);

});

document.body.appendChild(snareButton);




/**************KICK DRUM**************/
/*
    Kick needs oscillator
*/
const kickButton = document.createElement("button");
kickButton.innerText = "Kick";

//Set up listener for the kick button
kickButton.addEventListener("click", () => {
    //Create an oscillator
    const kickOscillator = audioContext.createOscillator();
    //Set frequency for kick
    kickOscillator.frequency.setValueAtTime(150, 0);
    //Set envelope for frequency
    kickOscillator.frequency.exponentialRampToValueAtTime(.001, audioContext.currentTime + 0.5);

    //Get rid of click at end of kick by ramping down volume
    const kickGain = audioContext.createGain();
    kickGain.gain.setValueAtTime(1, 0);
    kickGain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime + .5);

    //Play kick
    kickOscillator.connect(kickGain);
    kickGain.connect(primaryGainControl);
    kickOscillator.start();
    kickOscillator.stop(audioContext.currentTime + 0.5);
});
document.body.appendChild(kickButton);

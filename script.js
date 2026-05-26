var firstClick = true;
var gDisplayText;
var gDisplayElement;
var gOptionsElement;
var gAudioElement;
var gAudioSource;
var gAudioHrefs;
var gAudioButtonElement;
var gImageElement;
var gIndex;
var audioPlaying;

var prompts;
var options;
var responses;
var gImageHrefs;


function consoleTest(s) {
	console.log(s);
}

function addOption (id, optionText, onClick) {
	let para = document.createElement("p");
	para.setAttribute("id", id);
	para.setAttribute("onclick", onClick);
	gOptionsElement.appendChild(para);
	document.getElementById(id).innerHTML = optionText;
}

function displayOptions(isOptions) {
	if (isOptions) {
		for (let i=0; i < options[gIndex].length; i++) {
			addOption(("option" + i.toString()), options[gIndex][i], "promptResponse(" + i.toString() + ")");
		}
	}
	else {
		addOption("continue", "Continue...", "startStage();");
	}
	
	gOptionsElement.style.display = "";
}

function hideOptions() {
	gOptionsElement.style.display = "none";
	gOptionsElement.innerHTML = "";
}

function typeTextRecursive(displayIndex, maxIndex, delay, isOptions) {
	if (displayIndex > maxIndex) {
		displayOptions(isOptions);
		return; 
	}
	else {
		let tempChar = gDisplayText.charAt(displayIndex);
		if (tempChar == " ") { tempChar = "&nbsp;"; }
		gDisplayElement.innerHTML += tempChar;
		setTimeout(typeTextRecursive, delay, displayIndex+1, maxIndex, delay, isOptions);
	}
}

function toggleAudio() {
	console.log("toggleAudio");
	if (firstClick) { return; }
	
	if (audioPlaying) {
		gAudioElement.pause();
		gAudioButtonElement.innerText = "Listen";
	}
	else {
		gAudioElement.play();
		gAudioButtonElement.innerText = "Pause";
	}
	audioPlaying = !(audioPlaying)
	console.log("audioPlaying " + audioPlaying);
}

function promptResponse(chosenOption) {
	//Display appropriate response
	hideOptions();
	gDisplayElement.innerText = "";
	gDisplayText = responses[gIndex][chosenOption];
	
	typeTextRecursive(0, (gDisplayText.length - 1), 20, false)
}

function startStage() {
	console.log("startStage");
	gIndex += 1;
	if (gIndex >= prompts.length) {
		// Game's over
		console.log("Finished");
		return;
	}
	
	if (audioPlaying) { toggleAudio(); }
	gAudioSource.src = "audio/" + gAudioHrefs[gIndex];
	gAudioElement.load();
	
	gImageElement.src = "images/" + gImageHrefs[gIndex];
	
	console.log("gAudioSource.src " + gAudioSource.src);
	console.log("gImageElement.src " + gImageElement.src);
	
	gDisplayElement.innerText = "";
	hideOptions();
	
	gDisplayText = prompts[gIndex];
		
	typeTextRecursive(0, (gDisplayText.length - 1), 20, true);
}

function startPage() {
	console.log("startPage");
	if (firstClick) {
		firstClick = false;
		
		gDisplayText = "";
		gDisplayElement = document.getElementById("clickPrompt");
		gOptionsElement = document.getElementById("options");
		gAudioElement = document.getElementById("audio0");
		gAudioButtonElement = document.getElementById("audioButton");
		gAudioSource = document.getElementById("audio_source");
		gImageElement = document.getElementById("mem_image");
		gIndex = -1;
		audioPlaying = false;

		prompts = ["Are these your memories? You know you can't go back, right?", "test prompt"];
		options = [["I know", "I want to go back"], ['temp']];
		responses = [["Good", 'Too bad'], ["temp1", "temp2"]];
		gImageHrefs = ["chelt_peace.png", "chelt_peace2.png"]
		gAudioHrefs = ["chelt_peace.wav", "test.mp3"]
		
		startStage();
	}
	else { return; }
}
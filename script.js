var firstClick = true;
var gDisplayText;
var gDisplayElement;
var gOptionsElement;
var gIndex;
var audioPlaying;

var prompts;
var options;
var responses;

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

function toggleAudio(audioElementID, audioButtonID) {
	console.log("toggleAudio")
	if (firstClick) { return; }
	
	let audioButtonElement = document.getElementById(audioButtonID);
	let audioElement = document.getElementById(audioElementID);
	if (audioPlaying) {
		audioElement.pause();
		audioButtonElement.innerText = "Listen";
		audioPlaying = false;
	}
	else {
		audioElement.play();
		audioButtonElement.innerText = "Pause";
		audioPlaying = true;
	}
}

function promptResponse(chosenOption) {
	//Display appropriate response
	hideOptions();
	gDisplayElement.innerText = "";
	gDisplayText = responses[gIndex][chosenOption];
	
	typeTextRecursive(0, (gDisplayText.length - 1), 50, false)
}

function startStage() {
	console.log("startStage");
	gIndex += 1;
	if (gIndex >= prompts.length) {
		// Game's over
		console.log("Finished");
		return;
	}
	
	// Update image and audio links too
	gDisplayElement.innerText = "";
	hideOptions();
	
	gDisplayText = prompts[gIndex];
		
	typeTextRecursive(0, (gDisplayText.length - 1), 50, true);
}

function startPage() {
	console.log("startPage");
	if (firstClick) {
		firstClick = false;
		
		gDisplayText = "";
		gDisplayElement = document.getElementById("clickPrompt");
		gOptionsElement = document.getElementById("options");
		gIndex = -1;
		audioPlaying = false;

		prompts = ["Are these your memories? You know you can't go back, right?"];
		options = [["I know", "I want to go back"], ['temp']];
		responses = [["Good", 'Too bad'], ["temp1", "temp2"]];
		
		startStage();
	}
	else { return; }
}
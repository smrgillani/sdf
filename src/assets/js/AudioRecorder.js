//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var recorder; 						//WebAudioRecorder object
var input; 							//MediaStreamAudioSourceNode  we'll be recording
var encodingType; 					//holds selected encoding for resulting audio (file)
var encodeAfterRecord = true;       // when to encode

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record

function startRecording() {
	var constraints = { audio: true, video:false }
	gumStream = ""
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		if (stream) {
			/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device
			*/
			audioContext = new AudioContext();

			//assign to gumStream for later use
			gumStream = stream;
			
			/* use the stream */
			input = audioContext.createMediaStreamSource(stream);
			
			recorder = new WebAudioRecorder(input, {
			workerDir: "../node_modules/web-audio-recorder-js/lib-minified/", // must end with slash
			encoding: "mp3",
			onEncoderLoading: function(recorder, encoding) {
			},
			onEncoderLoaded: function(recorder, encoding) {
			}
			});

			recorder.onComplete = function(recorder, blob) { 
				createDownloadLink(blob,recorder.encoding);
			}

			recorder.setOptions({
			timeLimit:120,
			encodeAfterRecord:encodeAfterRecord,
			ogg: {quality: 0.5},
			mp3: {bitRate: 160}
			});

			//start the recording process
			recorder.startRecording();
		}
	})
}

function stopRecording() {
	if (gumStream){
		//stop microphone access
		gumStream.getAudioTracks()[0].stop();
		//tell the recorder to finish the recording (stop recording + encode the recorded audio)
		recorder.finishRecording();
		return true;
	} else {
		this.clearRecording();
		p = document.createElement('p');
		p.setAttribute("class","text-center");
		p.innerHTML = "Please allow browser to access your microphone.";
		recordingList.appendChild(p);
		return false;
	}
}

function createDownloadLink(blob,encoding) {
	audio_blob = blob;
	url = URL.createObjectURL(blob);
	au = document.createElement('audio');
	var li = document.createElement('a');

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//add the new audio and a elements to the li element
	li.appendChild(au);
	
	//add the li element to the ordered list
	this.clearRecording();

	recordingList.appendChild(li);
}

function clearRecording() {
	recordingList.innerHTML = "";
}

function sendRecording(url, auth) {
	this.clearRecording()
	p = document.createElement('p')
	p.setAttribute("class","text-center")
	p.innerHTML = "Sending..."
	recordingList.appendChild(p)
	var mp3 = new File([audio_blob], new Date().toISOString() + '.mp3');
	var aud = new FormData();
	aud.append('audio', mp3);
	var response = $.ajax({
			method: 'POST',
			url: url,
			data: aud,
			cache:false,
			processData: false,
			contentType: false,
			headers: {
				'Authorization': auth
			},
			success : function(res){},
			error: function(res){clearRecording()},
		})
	return response
}
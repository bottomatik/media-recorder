;(function(){
	class Recorder{
		constructor(params, type){
			if(params){
				this.__types = params;
			}

			if(type){
				this.__setType(type);
			}

			this.__listeners = {
				dataavailable:[],
				stop:[],
				error:[],
				start:[],
				resume:[]
			}
		}
	
		record(type){
			if(type){
				this.__setType(type);
			}

			var parent = this;

			navigator.mediaDevices.getUserMedia(this.__types).
			then(function(stream){
				parent.__blobs = [];
				if(parent.type){
					parent.recorder = new MediaRecorder(stream, {mediaType:parent.type});
				} else {
					parent.recorder = new MediaRecorder(stream);
				}

				addListeners();

				parent.recorder.addEventListener('dataavailable', function(event){
					if(event.data.size > 0){
						parent.__blobs.push(event.data);
					}
				});

				parent.recorder.addEventListener('stop', function(event){
					if(parent.type){
						parent.__blob = new Blob(parent.__blobs, {
							type:parent.type
						});
					} else {
						parent.__blob = new Blob(parent.__blobs);
					}
					parent.__blobURL = URL.createObjectURL(parent.__blob);
				});

				parent.recorder.addEventListener('error', function(event){
					console.error(event);
				});

				parent.recorder.start();

				function addListeners(){
					for(var type in parent.__listeners){
						for(var l of parent.__listeners[type]){
							parent.recorder.addEventListener(type, l);
						}
					}
				}
			});
		}

		stop(){
			if(!this.recorder){
				throw new Error('No recorder attached. You need to call recorder#record() first');
			}
			this.recorder.stop();
		}

		resume(){
			if(!this.recorder){
				throw new Error('No recorder attached. You need to call recorder#record() first');
			}
			this.recorder.resume();	
		}

		requestData(){
			if(!this.recorder){
				throw new Error('No recorder attached. You need to call recorder#record() first');
			}
			return this.recorder.requestData();
		}

		getBlob(){
			return this.__blob || null;
		}

		getURL(){
			return this.__blobURL || null;
		}

		setParams(params){
			this.__types = params;
			return this;
		}

		__setType(type){
			if(!type){
				throw new Error('Type is required');
			}
			if(!(MediaRecorder.isTypeSupported(type))){
				throw new Error('Type is not supported, use one of audio/webm or video/webm');
			}
			
			this.type = type;
			var t = type.match(/^([a-z]+)\//);
			if(t && !this.types){
				this.__types = {};
				this.__types[t[1]] = true;	
			}
		}

		addEventListener(type, fun){
			if(!(type in this.__listeners)){
				throw new Error(`Unsupported listener ${type}`);
			}

			this.__listeners[type].push(fun);
		}
	}
	Recorder.prototype.on = Recorder.prototype.addEventListener;
	window.Recorder = Recorder;

})();
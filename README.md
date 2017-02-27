# Recorder

## Installation
Add a script tag, at the beginning or end of your HTML file:

`<script src="./path/to/recorder.js' type="text/javascript"></script>`

You can also use `async` or `defer`  to change the way the script loads.


## ;tldr
```
var r = new Recorder({audio:true, video:false}, 'audio/webm');
r.record();
setTimeout(()=>{
	r.stop();
	window.open(r.getURL());
}, 1000);
```

## Usage

You can instanciate a new Recorder using the `Recorder` class. It takes
2 arguments `params` and `type`.

| Param | Type | Required | Description |
|:-----:|:----:|:--------:|:-----------:|
|`params`| *Object* | `false`| `params` is an object, specifying the type of media to record, it can hold 2 keys, `audio` and `video`, which are `booleans`.|
|`type`| *String* | `false`| `type` specifies the type of media to record, for example `"audio/webm"`. The library will test if the type is supported by each navigator.|

### Methods

`Recorder` implements most methods from `MediaRecorder`: `stop()`, `resume()` and `requestData()`.

#### `#record(type)`

Begins recording the requested type of media.

| Param | Type | Required | Description |
|:-----:|:----:|:--------:|:-----------:|
|`type`| *String* | `false`| Same as in the constructor for `Recorder`|

#### `#getBlob()`

Returns the recorded `Blob`. You can use this method to get the blob and send it via AJAX.

Example:

```
var blob = recorder.getBlob();
var f = new FormData();
f.append('recording', blob, 'My Recording');
AJAX.send(f);
```

#### `#setParams(params)`

Sets the type of media params. The same argument that the constructor takes.

#### `#addEventListener` or `#on()`

Adds the same events listeners that `MediaRecorder` takes. Those being
*
	* `dataavailable`
	* `stop`
	* `start`
	* `resume`
	* `error`



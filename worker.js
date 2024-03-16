// src/index.js
var html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Upload Google Drive Files Securely - Hash Hackers</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.png">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@4/dist/materia/bootstrap.min.css">
<style>
#spinner {
    display: none;
}
</style>
<script>
document.addEventListener("DOMContentLoaded", function() {
    // Get the input element
    var input = document.getElementById("service_account");
    
    // Add event listener for paste event
    input.addEventListener("paste", function(event) {
      // Prevent default paste behavior
      event.preventDefault();
  
      // Get pasted data
      var pastedData = (event.clipboardData || window.clipboardData).getData('text');
      
      // Minify the JSON
      var minifiedJSON = JSON.stringify(JSON.parse(pastedData));
      
      // Update the input with the minified JSON
      input.value = minifiedJSON;
    });
});
<\/script>
<style media="screen">.footer { left: 0; bottom: 0; width: 100%; color: white; text-align: center; z-index: 1030; } html { position: relative; min-height: 100%; } .disabled-class { display: none; } body {  margin-bottom: 90px; } .footer { position: absolute; bottom: 0; width: 100%; /* Set the fixed height of the footer here */ height: 100px; line-height: 30px; background-color: #222222; } .footer > .container { padding: 15px 0; } #account_list table td:first-child { cursor: pointer; } .account_row.loading .close, .account_row:not(.loading) .spinner-border { display: none; } pre{ color:unset; }</style>
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark navbar-fixed-top">
<a class="navbar-brand" href="/"><img border="0" alt="Hash Hackers" src="https://images.cdn.hashhackers.com/logo/logo-white-d.svg" width="150px"></a>
<div class="collapse navbar-collapse" id="navbarColor01">
<ul class="navbar-nav mr-auto">
<li class="nav-item active">
<a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
</li>
<li class="nav-item">
<a class="nav-link" href="https://telegram.dog/HashHackers" target="_blank">Telegram</a>
</li>
</ul>
</div>
</nav>
<div class="modal fade show" id="myModal" data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="myModalLabel">Auth Required</h5>
            </div>
            <div class="modal-body">
                <form id="authForm">
                    <div class="form-group">
                        <label for="service_account">Service Account</label>
                        <input type="text" class="form-control" id="service_account" placeholder="Service Account JSON" required>
                    </div>
                    <div class="form-group">
                        <div class="alert alert-danger" role="alert" id="authError" style="display: none;"></div>
                        <div class="d-flex justify-content-center">
                        <div class="spinner-border text-primary" role="status" id="spinner">
                            <div class="spinner">
                            </div>
                        </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="document.getElementById('service_account').value = '';">Clear</button>
                <button type="button" class="btn btn-primary" onclick="generateNewAccessToken()">Submit</button>
            </div>
            <div class="modal-body text-center"><a href="#" onclick="initiateGoogleLogin()"><img src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png"></a></div>
        </div>
    </div>
</div>
<div class="container">
<div class="row">
<div class="col">
<div class="card my-4">
<div class="card-body">
<center>
<h3>Google Drive Web App</h3>
<p class="mt-3">Upload Files to Google Drive Remotely (Keep Browser Open)</p>
<p class="mt-3">Download Google Drive Files (Personal use 1 hour links)</p>
<div class="form-group align-items-center">
<p class="col-12 col-md-8" id="fileinfo"></p>
<p class="col-12 col-md-8" id="status"></p>
<p class="col-12 col-md-8" id="uploadedfile"></p>
<div class="row justify-content-center" id="file">
<div class="col-12 col-md-8"> <input id="url_to_upload" type="text" class="form-control" placeholder="High Speed Direct Download Link" value="" required></div>
<div class="col-12 col-md-8"> <input id="file_name" type="text" class="form-control" placeholder="File Name with Extention" value="" required></div>
<div class="col-12 col-md-8"> <input id="root_id" type="text" class="form-control" placeholder="Drive/Folder ID" value="" required></div>
<div class="col-12 col-md-8"><br><label for="chunk_size">Choose Per Request Upload Size (depends on your link speed)</label></div>
<div class="col-12 col-md-8">
<select name="chunk_size" id="chunk_size" type="text" class="form-control">
  <option value="10485760">10 MB</option>
  <option value="26214400">25 MB</option>
  <option value="52428800">50 MB</option>
  <option value="83886080">80 MB</option>
  <option value="104857600" selected>100 MB Default</option>
  <option value="209715200">200 MB</option>
  <option value="314572800">300 MB</option>
  <option value="419430400">400 MB</option>
  <option value="524288000">500 MB</option>
  <option value="1073741824">1 GB</option>
  <option value="2147483648">2 GB</option>
</select>
</div>
<div class="col-12 col-md-8"> <button id="upload_button" style="margin-top: 5px;" class="btn btn-primary btn-block">Upload</button></div>
<div class="col-12 col-md-8"> <button id="logout_button" style="margin-top: 5px; display:none;" class="btn btn-danger btn-block" onclick="logOut()">Logout</button></div>
</div><br>
</div>
<p class="mt-3">The Web App Uploads Data in 100 MB Chunk Size to avoid hitting Cloudflare 100 Second HTTP Timeout and Max Limit for Free User. Make Sure your links are fast enough to download 100 MB in 100 seconds or the upload with fail. If you encounter an error, please report to @HashHackers Comments on Telegram.</p>
<img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgoogledriveuploader.hashhackers.com&amp;count_bg=%2379C83D&amp;title_bg=%23555555&amp;icon=&amp;icon_color=%23E7E7E7&amp;title=hits&amp;edge_flat=false">
</center>
</div>
<div class="card-body">
<center>
<h4>Download Files</h4>
<div id="download_files" class="col-12 col-md-8">
<input id="file_id" type="text" class="form-control" placeholder="File ID" value="" required>
<button id="download_button" style="margin-top: 5px;" class="btn btn-primary btn-block" onclick="downloadFile()">Download</button>
<button id="copy_download_button" style="margin-top: 5px;" class="btn btn-secondary btn-block" onclick="copydownloadFile()">Copy</button>
</div>
</center>
</div>
</div>
</div>
</div>
</div>
<footer class="footer">
<div class="container">
<div class="text-muted">Made with \u2764\uFE0F by <b><a href="https://twitter.com/ParveenBhadoo">Parveen Bhadoo</a></b></div>
<div class="text-muted">Version: <b>3.1</b> | <a href="https://telegram.dog/HashHackers">Telegram</a></div>
</div>
</footer>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous" type="d6385f183e1df5ee21eb696f-text/javascript"><\/script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"><\/script>
<script src="/app.js"><\/script>
</body>
</html>`;

// src/app.js
var app_js = `let accessToken = localStorage.getItem('accessToken');
let expires = localStorage.getItem('expires');
let url_to_upload = localStorage.getItem('url_to_upload');
let file_name = localStorage.getItem('file_name');
let root_id = localStorage.getItem('root_id');
let chunk_size = localStorage.getItem('chunk_size');
let refresh_token = localStorage.getItem('refreshToken');
let service_account = localStorage.getItem('service_account');
let access_token = localStorage.getItem('accessToken');
let domains_list = ['']
let download_domain = domains_list[Math.floor(Math.random() * domains_list.length)];
if (access_token && access_token.length > 15) {
    document.getElementById('logout_button').style.display = 'block';
}
if (url_to_upload && url_to_upload.length > 5) {
    document.getElementById('url_to_upload').value = url_to_upload;
}
if (file_name && file_name.length > 5) {
    document.getElementById('file_name').value = file_name;
}
if (root_id && root_id.length > 5) {
    document.getElementById('root_id').value = root_id;
}
if (chunk_size && chunk_size.length > 0) {
    document.getElementById('chunk_size').value = chunk_size;
}
if (accessToken && expires && refresh_token) {
    if (Date.now() >= expires || expires == null || accessToken.length < 15) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expires');
        $('#myModal').modal('show');
        $('#spinner').show();
        generateNewAccessToken();
    }
} else if (accessToken && expires && service_account) {
	if (Date.now() >= expires || expires == null || accessToken.length < 15) {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('expires');
		$('#myModal').modal('show');
        if (refresh_token && refresh_token.length > 15) {
            $('#spinner').show();
            generateNewAccessToken();
        } else {
            if (service_account && service_account.length > 15) {
                document.getElementById('service_account').value = service_account;
                $('#spinner').show();
                generateNewAccessToken();
            }
        }
	}
} else {
	$('#myModal').modal('show');
    if (refresh_token && refresh_token.length > 15) {
        $('#spinner').show();
        generateNewAccessToken();
    } else if (service_account && service_account.length > 15) {
		document.getElementById('service_account').value = service_account;
		$('#spinner').show();
		generateNewAccessToken();
	}
}

async function checkAuthStillValid() {
	let accessToken = localStorage.getItem('accessToken');
	let expires = localStorage.getItem('expires');
	if (accessToken && expires) {
		if (Date.now() >= expires || expires == null || accessToken.length < 15) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('expires');
			$('#myModal').modal('show');
			let service_account = localStorage.getItem('service_account');
			if (service_account && service_account.length > 15) {
				document.getElementById('service_account').value = service_account;
				$('#spinner').show();
				generateNewAccessToken();
				return true;
			}
		} else {
			return true;
		}
	}
	return false;
}


async function get_upload_id(url_to_upload, file_name, root_id, chunk_size) {
    const checkAuth = await checkAuthStillValid();
    if (!checkAuth) {
        await generateNewAccessToken();
    }
    $('#status').html('<div class="alert alert-success" role="alert"> Getting Upload ID for this File </div></div></div>');
    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        $('#status').html('<div class="alert alert-danger" role="alert"> No Access Token Found </div></div></div>');
        $('#myModal').modal('show');
        generateNewAccessToken();
        return;
    }
    const json = {
        url: url_to_upload,
        file_name: file_name,
        root_id: root_id,
        accessToken: accessToken
    };
    try {
        const response = await fetch("/upload", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });

        if (!response.ok) {
            throw new Error('HTTP error! Status: ' + response.status);
        }

        const data = await response.json();

        if (response.status === 401) {
            $('#status').html('<div class="alert alert-danger" role="alert"> Error 401 while Getting Upload ID </div></div></div>');
        } else if (data && data.upload_id === "null") {
            $('#status').html('<div class="alert alert-danger" role="alert"> No Upload ID Generated By System </div></div></div>');
        } else if (data && data.upload_id && data.content_length) {
            const upload_id = data.upload_id;
            const file_size = data.content_length;
            if (upload_id === "null") {
                $('#fileinfo').html('<div class="alert alert-danger" role="alert"> Failed to Obtain Upload ID, Refresh Page and try again. </div></div></div>');
            } else {
                $('#fileinfo').html('<div class="alert alert-info" role="alert"> Found Upload ID, File Size ' + formatFileSize(file_size) + ' </div></div></div>');
                start_upload(url_to_upload, upload_id, file_size, chunk_size);
            }
        } else {
            $('#status').html('<div class="alert alert-danger" role="alert"> Else Executed while Getting Upload ID </div></div></div>');
        }
    } catch (error) {
        console.error('Error:', error);
        $('#status').html('<div class="alert alert-danger" role="alert"> Error occurred while Getting Upload ID: ' + error.message + ' </div></div></div>');
    }
}


async function initiateGoogleLogin() {
    // create google login link and open it in new tab
    const response = await fetch('/gdrivelogin', {
        method: 'POST'
    });
    const data = await response.json();
    if (data) {
        window.open(data.url, '_self');
    } else {
        console.error('Error:', data);
        $('#authError').show().html("Something went wrong. Please try again later.");
    }
}

async function generateNewAccessToken() {
	// sleep for 3 seconds
	$('#spinner').show();
	$('#authError').hide();
	await sleep(3000);
    let json = {}
    let refresh_token = localStorage.getItem('refreshToken');
    if (refresh_token && refresh_token.length > 15) {
        json.refresh_token = refresh_token;
    } else {
        let service_account = localStorage.getItem('service_account');
        let service_account_value = document.getElementById('service_account').value;
        if (service_account && service_account.length > 15) {
            json.service_account = service_account;
        } else if (service_account_value && service_account_value.length > 15) {
            json.service_account = service_account_value;
            localStorage.setItem('service_account', service_account_value);
        } else {
            $('#spinner').hide();
            $('#authError').show().html("Please Enter SA JSON Data or Login with Google.");
            return;
        }
    }
	try {
		let response = await fetch('/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(json)
		});
		let result = await response.json();
		if (result.success && result.accessToken) {
			localStorage.setItem('accessToken', result.accessToken);
			localStorage.setItem('expires', result.expires);
			$('#spinner').hide();
			$('#myModal').modal('hide');
            document.getElementById('logout_button').style.display = 'block';
		} else {
			$('#authError').show().html("Something went wrong. Please try again with valid service account JSON.");
		}
		$('#spinner').hide();
	} catch (e) {
		console.log(e);
		$('#spinner').hide();
		$('#authError').show().html("Something went wrong. Please try again with valid service account JSON.");
	}
}

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function start_upload(url_to_upload, upload_id, content_length, chunk_size) {
    const checkAuth = await checkAuthStillValid();
    if (!checkAuth) {
        await generateNewAccessToken();
    }
    $('#status').html("<div class='alert alert-success' role='alert'> Starting Upload Process </div></div></div>");
    document.getElementById("file").style.display = 'none';

    try {
        if (content_length <= 10428800) {
            var content_length_minus_one = Number(content_length) - 1;
            const result = await upload_resumeable_file(url_to_upload, upload_id, content_length, 0, content_length_minus_one, content_length, 1, 1);
            if (result === "FAILED") {
                $('#status').html("<div class='alert alert-danger' role='alert'> Check Permissions as we failed to upload File </div></div></div>");
            } else if (result === "404") {
                $('#status').html("<div class='alert alert-danger' role='alert'> File Not Found, Retry Upload </div></div></div>");
            }
        } else if (content_length <= 107374182400) {
            var single_part = Number(chunk_size);
            var quotient = Math.floor(Number(content_length) / single_part);
            var remainder = Number(content_length) % single_part;
            if (remainder == 0) {
                var total_times = Number(quotient);
            } else {
                var total_times = Number(quotient) + 1;
            }
        
            for (let i = 0; i < total_times; i++) {
                var times = Number(i) + 1;
                let range_from;
                if (times == 1) {
                    range_from = Number("0");
                } else {
                    range_from = Number(i) * single_part;
                }
                var range_to = Number(range_from) + single_part - 1;
                
                // Adjust range_to if it exceeds content_length
                if (range_to >= content_length) {
                    range_to = content_length - 1;
                }
                
                var result = await upload_resumeable_file(url_to_upload, upload_id, content_length, range_from, range_to, single_part, total_times, times);
                if (result == "FAILED") {
                    $('#status').html("<div class='alert alert-danger' role='alert'> Check Permissions as we failed to upload File </div></div></div>");
                    break;
                } else if (result == "404") {
                    $('#status').html("<div class='alert alert-danger' role='alert'> File Not Found, Retry Upload </div></div></div>");
                    break;
                } else if (result == "413") {
                    $('#status').html("<div class='alert alert-danger' role='alert'> Chunk Size Too Large, Shifted to Max Allowed. </div></div></div>");
                    get_upload_id(url_to_upload, localStorage.getItem('file_name'), localStorage.getItem('root_id'), 104857600);
                    break;
                }
            }
        } else {
            $('#status').html("<div class='alert alert-danger' role='alert'> Files bigger than 100 GB are not supported right now </div></div></div>");
        }
    } catch (error) {
        console.error(error);
        $('#status').html("<div class='alert alert-danger' role='alert'> Error occurred: " + error.message + " </div></div></div>");
    }
}



async function upload_resumeable_file(url_to_upload, upload_id, content_length, range_from, range_to, bytes, total_times, times) {
    const checkAuth = await checkAuthStillValid();
    if (!checkAuth) {
        await generateNewAccessToken();
    }
    $('#status').html("<div class='alert alert-success' role='alert'> Running Upload Part " + times + " out of " + total_times + " times</div></div></div>");

    let json = {
        url: url_to_upload,
        upload_id: upload_id,
        content_length: content_length,
        range: range_from + '-' + range_to,
        bytes: bytes,
        accessToken: localStorage.getItem("accessToken")
    };

    try {
        const response = await fetch("/resume_upload", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });

        if (!response.ok) {
            throw new Error("Error " + response.status + " while uploading file");
        }

        const data = await response.json();
        if (data.id != null) {
            $('#status').html("<div class='alert alert-success' role='alert'> File Uploaded <a href='https://drive.google.com/file/d/" + data.id + "/view'>" + data.id + "</a> </div></div></div>");
            const infoResponse = await fetch("/info", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: data.id,
                    accessToken: localStorage.getItem("accessToken")
                })
            });
            if (!infoResponse.ok) {
                throw new Error("Error " + infoResponse.status + " while getting info about uploaded file");
            }
            const fileInfo = await infoResponse.json();
            $('#uploadedfile').html("<div class='alert alert-info' role='alert'> Uploaded " + fileInfo.name + " with Size " + fileInfo.size + " </div></div></div>");
            // add a button to reload the page
            $('#status').append("<div class='alert alert-success' role='alert'> <a href='/'>Upload Another File</a> </div></div></div>");
        } else if (data.status == '308') {
            return "CONTINUE";
        } else if (data.status == '404') {
            return "404";
        } else if (data.status == '413') {
            return "413";
        } else {
            $('#status').html("<div class='alert alert-danger' role='alert'> Else Executed while uploading resumable file " + JSON.stringify(data) + "</div></div></div>");
            return "FAILED";
        }
    } catch (error) {
        console.error(error);
        $('#status').html("<div class='alert alert-danger' role='alert'> Error occurred while uploading resumable file: " + error.message + "</div></div></div>");
        return "FAILED";
    }
}



function formatFileSize(bytes) {
	if (bytes >= 1073741824) {
		bytes = (bytes / 1073741824).toFixed(2) + ' GB';
	} else if (bytes >= 1048576) {
		bytes = (bytes / 1048576).toFixed(2) + ' MB';
	} else if (bytes >= 1024) {
		bytes = (bytes / 1024).toFixed(2) + ' KB';
	} else if (bytes > 1) {
		bytes = bytes + ' bytes';
	} else if (bytes == 1) {
		bytes = bytes + ' byte';
	} else {
		bytes = '';
	}
	return bytes;
}

document.querySelector("#upload_button").addEventListener("click", async function(event) {
	event.preventDefault();
	try {
		var url_to_upload = document.getElementById("url_to_upload").value;
		var file_name = document.getElementById("file_name").value;
		var root_id = document.getElementById("root_id").value;
		var chunk_size = document.getElementById("chunk_size").value;
        // save all these to localstorage
        localStorage.setItem('url_to_upload', url_to_upload);
        localStorage.setItem('file_name', file_name);
        localStorage.setItem('root_id', root_id);
        localStorage.setItem('chunk_size', chunk_size);
		$('#status').html("<div class='alert alert-danger' role='alert'> Loading... </div></div></div>");
		if (url_to_upload.includes("https://")) {
			$('#status').html("<div class='alert alert-danger' role='alert'> Processing Started </div></div></div>");
			try {
				get_upload_id(url_to_upload, file_name, root_id, chunk_size);
			} catch (e) {
				$('#status').html("<div class='alert alert-danger' role='alert'> Caught Error on Request " + e + " </div></div></div>");
				//console.log(e)
			}
		} else {
			$('#status').html("<div class='alert alert-danger' role='alert'> Else Error Occurred </div></div></div>");
		}
	} catch (e) {
		$('#status').html("<div class='alert alert-danger' role='alert'> Catch Error " + e + "</div></div></div>");
	} finally {
		//$('#status').html("<div class='alert alert-danger' role='alert'> Finally Executed </div></div></div>");
	}
});



function copyFunction() {
	var copyText = document.getElementById("result");
	copyText.select();
	copyText.setSelectionRange(0, 99999);
	document.execCommand("copy");
	var tooltip = document.getElementById("copybuttonid");
	tooltip.innerHTML = "Copied";
}

function outFunc() {
	var tooltip = document.getElementById("copybuttonid");
	tooltip.innerHTML = "Copy Shareable Link";
}

function publiccopyFunction() {
	var copyText = document.getElementById("publicresult");
	copyText.select();
	copyText.setSelectionRange(0, 99999);
	document.execCommand("copy");
	var tooltip = document.getElementById("publiccopybuttonid");
	tooltip.innerHTML = "Copied";
}

function publicoutFunc() {
	var tooltip = document.getElementById("publiccopybuttonid");
	tooltip.innerHTML = "Copy Permanent Link";
}

// box to download files
async function downloadFile() {
    var link = document.getElementById("file_id").value;
    if (link.length < 5) {
        return;
    }
    var file_id = link.match(new RegExp('/([^/]+)(?=/[^/]*$)'))[1];
    let access_token = localStorage.getItem('accessToken');
    if (access_token && access_token.length > 15) {
        window.open(download_domain + '/download/' + file_id + '?accessToken=' + access_token, '_blank');
    } else {
        $('#myModal').modal('show');
        $('#spinner').show();
        await generateNewAccessToken();
        access_token = localStorage.getItem('accessToken');
        window.open(download_domain + '/download/' + file_id + '?accessToken=' + access_token, '_blank');
    }
}

async function copydownloadFile() {
    var link = document.getElementById("file_id").value;
    if (link.length < 5) {
        return;
    }
    var file_id = link.match(new RegExp('/([^/]+)(?=/[^/]*$)'))[1];
    let access_token = localStorage.getItem('accessToken');
    if (access_token && access_token.length > 15) {
        console.log("Access Token Found");
        var downloadLink = download_domain + '/download/' + file_id + '?accessToken=' + access_token;
        await navigator.clipboard.writeText(downloadLink); // Copy the download link to clipboard
        
        // Change button text to "Copied"
        var button = document.getElementById("copy_download_button");
        button.textContent = "Copied";
        
        // Revert button text to "Copy" after 5 seconds
        setTimeout(function() {
            button.textContent = "Copy";
        }, 5000);
    } else {
        $('#myModal').modal('show');
        $('#spinner').show();
        await generateNewAccessToken();
        access_token = localStorage.getItem('accessToken');
        var downloadLink = download_domain + '/download/' + file_id + '?accessToken=' + access_token;
        await navigator.clipboard.writeText(downloadLink); // Copy the download link to clipboard
        
        // Change button text to "Copied"
        var button = document.getElementById("copy_download_button");
        button.textContent = "Copied";
        
        // Revert button text to "Copy" after 5 seconds
        setTimeout(function() {
            button.textContent = "Copy";
        }, 5000);
    }
}


async function logOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expires');
    localStorage.removeItem('root_id');
    localStorage.removeItem('chunk_size');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('service_account');
    window.location.href = "/";
}`;

// src/worker.js
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const service_account_json = {};
    const client_id = "";
    const client_secret = "";
    const JSONWebToken = {
      header: {
        alg: "RS256",
        typ: "JWT"
      },
      importKey: async function(pemKey) {
        var pemDER = this.textUtils.base64ToArrayBuffer(pemKey.split("\n").map((s) => s.trim()).filter((l) => l.length && !l.startsWith("---")).join(""));
        return crypto.subtle.importKey("pkcs8", pemDER, {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256"
        }, false, ["sign"]);
      },
      createSignature: async function(text, key) {
        const textBuffer = this.textUtils.stringToArrayBuffer(text);
        return crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, textBuffer);
      },
      generateGCPToken: async function(serviceAccount2) {
        const iat = parseInt(Date.now() / 1e3);
        var payload = {
          "iss": serviceAccount2.client_email,
          "scope": "https://www.googleapis.com/auth/drive",
          "aud": "https://oauth2.googleapis.com/token",
          "exp": iat + 3600,
          "iat": iat
        };
        const encPayload = btoa(JSON.stringify(payload));
        const encHeader = btoa(JSON.stringify(this.header));
        var key = await this.importKey(serviceAccount2.private_key);
        var signed = await this.createSignature(encHeader + "." + encPayload, key);
        return encHeader + "." + encPayload + "." + this.textUtils.arrayBufferToBase64(signed).replace(/\//g, "_").replace(/\+/g, "-");
      },
      textUtils: {
        base64ToArrayBuffer: function(base64) {
          var binary_string = atob(base64);
          var len = binary_string.length;
          var bytes = new Uint8Array(len);
          for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
          }
          return bytes.buffer;
        },
        stringToArrayBuffer: function(str) {
          var len = str.length;
          var bytes = new Uint8Array(len);
          for (var i = 0; i < len; i++) {
            bytes[i] = str.charCodeAt(i);
          }
          return bytes.buffer;
        },
        arrayBufferToBase64: function(buffer) {
          let binary = "";
          let bytes = new Uint8Array(buffer);
          let len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          return btoa(binary);
        }
      }
    };
    if (path === "/") {
      return new Response(html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "max-age=0"
        }
      });
    } else if (path === "/app.js") {
      return new Response(app_js, {
        headers: {
          "content-type": "text/javascript; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "max-age=0"
        }
      });
    } else if (request.method === "POST" && path === "/gdrivelogin") {
      let json = {};
      try {
        const redirect_uri = "https://web.zindex.eu.org/callback";
        const scope = "https://www.googleapis.com/auth/drive";
        const access_type = "offline";
        const response_type = "code";
        const url2 = `https://accounts.google.com/o/oauth2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&access_type=${access_type}&response_type=${response_type}&&prompt=select_account+consent`;
        json.url = url2;
        json.success = true;
      } catch (e) {
        console.error(e);
        json.success = false;
      }
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "max-age=0"
        }
      });
    } else if (request.method === "GET" && path.startsWith("/download/")) {
      const file_id = path.split("/").pop();
      const accessToken2 = url.searchParams.get("accessToken");
      let headers = {};
      headers["authorization"] = "Bearer " + accessToken2;
      let file = await findItemById(file_id, accessToken2);
      if (!file.name) {
        return new Response(`{"error":"Private File"}`, {
          status: 500,
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "max-age=0"
          }
        });
      }
      let file_name2 = file.name;
      let file_size = file.size;
      let url2 = `https://www.googleapis.com/drive/v3/files/${file_id}?alt=media`;
      let res = await fetch(url2, {
        "method": "GET",
        "headers": headers
      });
      let headers2 = new Headers(res.headers);
      headers2.set("content-disposition", `attachment; filename="${file_name2}"; size=${file_size}`);
      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: headers2
      });
    } else if (request.method === "GET" && path === "/callback") {
      const code = url.searchParams.get("code");
      let json = {};
      const refreshToken2 = await getRefreshToken(code);
      if (refreshToken2) {
        json.success = true;
        json.refreshToken = refreshToken2;
      } else {
        json.success = false;
      }
      const html2 = `<script>localStorage.setItem('refreshToken', '${refreshToken2}');window.location.href = '/'<\/script>`;
      return new Response(html2, {
        status: 200,
        headers: {
          "content-type": "text/html",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "max-age=0"
        }
      });
    } else if (request.method === "POST" && path.startsWith("/auth")) {
      let json = {};
      try {
        let obj = await request.json();
        var serviceAccount = obj.service_account || null;
        var refreshToken = obj.refresh_token || null;
        let post_data;
        if (serviceAccount) {
          serviceAccount = JSON.parse(serviceAccount);
          let jwttoken = await JSONWebToken.generateGCPToken(serviceAccount);
          post_data = {
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: jwttoken
          };
        } else if (refreshToken) {
          post_data = {
            client_id: obj.client_id || client_id,
            client_secret: obj.client_secret || client_secret,
            refresh_token: refreshToken,
            grant_type: "refresh_token"
          };
        }
        const apiUrl = "https://www.googleapis.com/oauth2/v4/token";
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams(post_data)
        });
        const data2 = await res.json();
        const accessToken2 = data2.access_token;
        const expires = Date.now() + data2.expires_in * 1e3;
        if (accessToken2) {
          json.success = true;
          json.accessToken = accessToken2;
          json.expires = expires;
        } else {
          json.success = false;
        }
      } catch (e) {
        console.error(e);
        json.success = false;
      }
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "max-age=0"
        }
      });
    } else if (request.method === "POST" && path.startsWith("/upload")) {
      let obj = await request.json();
      var file_url = obj.url || "null";
      var file_name = obj.file_name || "";
      var root_id = obj.root_id || "null";
      var accessToken = obj.accessToken || "";
      let fileBody;
      let newfileName = "";
      if (file_url) {
        const u = new URL(file_url);
        const Referer = u.href;
        const Origin = u.protocol + "//" + u.host;
        var fetch_file = await fetch(file_url, {
          headers: {
            Referer,
            Origin
          }
        });
        fileBody = fetch_file.body;
        var content_length = fetch_file.headers.get("Content-Length");
        var content_disposition = fetch_file.headers.get("Content-Disposition");
        if (content_disposition && content_disposition.includes("filename")) {
          newfileName = content_disposition.split("filename=")[1].trim().replace(/["']/g, "");
        } else {
          newfileName = file_name;
        }
      }
      var data = await upload(accessToken, root_id, newfileName, fileBody, file_url, content_length);
      var data_Res = await data.json();
      return new Response(JSON.stringify(data_Res), {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "max-age=0"
        }
      });
    } else if (request.method === "POST" && path.startsWith("/resume_upload")) {
      let obj = await request.json();
      var range_of_data_dl = obj.range || "null";
      var requested_content_length = obj.content_length || "null";
      var upload_id = obj.upload_id || "null";
      var content_length = obj.content_length || "null";
      var accessToken = obj.accessToken || await generateAccessToken(service_account_json);
      var file_url = obj.url || "null";
      let fileBody;
      if (file_url) {
        const u = new URL(file_url);
        const Referer = u.href;
        const Origin = u.protocol + "//" + u.host;
        const Range = "bytes=" + range_of_data_dl;
        fileBody = (await fetch(file_url, {
          headers: {
            Referer,
            Origin,
            Range
          }
        })).body;
      }
      const response = await resume_upload(accessToken, fileBody, upload_id, content_length, range_of_data_dl, requested_content_length);
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "max-age=0"
        }
      });
    } else if (path.startsWith("/info")) {
      const obj = await request.json();
      let public_drive_id = obj.id || "null";
      var accessToken = obj.accessToken || await generateAccessToken(service_account_json);
      let file = await findItemById(public_drive_id, accessToken);
      console.log(file);
      if (!file.name) {
        return new Response(`{"error":"Private File"}`, {
          status: 500,
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "max-age=0"
          }
        });
      } else {
        return new Response(`{"name":"` + file.name + `","size":"` + formatFileSize(file.size) + `"}`, {
          status: 200,
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "max-age=0"
          }
        });
      }
    } else {
      return new Response("OK", {
        status: 200,
        headers: {
          "content-type": "text/plain",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "max-age=0"
        }
      });
    }
    async function getRefreshToken(authorizationCode) {
      const clientId = client_id;
      const clientSecret = client_secret;
      const redirectUri = "https://web.zindex.eu.org/callback";
      const tokenEndpoint = "https://oauth2.googleapis.com/token";
      const requestBody = {
        code: decodeURIComponent(authorizationCode),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      };
      try {
        const response = await fetch(tokenEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });
        if (response.ok) {
          const data2 = await response.json();
          console.log(data2);
          const refreshToken2 = data2.refresh_token;
          return refreshToken2;
        } else {
          const data2 = await response.json();
          console.error("Failed to get refresh token:", response.statusText, data2);
          return null;
        }
      } catch (error) {
        console.error("Error fetching refresh token:", error);
        return null;
      }
    }
    async function findItemById(id, accessToken2, headers = {}) {
      let url2 = `https://www.googleapis.com/drive/v3/files/${id}?fields=name,size&supportsAllDrives=true`;
      headers["authorization"] = "Bearer " + accessToken2;
      headers["content-type"] = "application/json";
      let res;
      for (let i = 0; i < 3; i++) {
        res = await fetch(url2, {
          "method": "GET",
          "headers": headers
        });
        if (res.ok) {
          break;
        }
      }
      const data2 = await res.json();
      console.log(data2);
      return data2;
    }
    async function upload(accessToken2, id, name, file, file_url2, content_length2, headers = {}) {
      headers["authorization"] = "Bearer " + accessToken2;
      headers["content-type"] = "application/json";
      let url2 = `https://www.googleapis.com/upload/drive/v3/files`;
      let res;
      let params = {
        uploadType: "resumable",
        supportsAllDrives: true
      };
      let json = {
        name,
        parents: [id]
      };
      url2 += "?" + enQuery(params);
      res = await fetch(url2, {
        "method": "POST",
        "headers": headers,
        "body": JSON.stringify(json)
      });
      var putUrl = res.headers.get("Location");
      var upload_id2 = res.headers.get("X-GUploader-UploadID");
      return new Response('{"upload_id":"' + upload_id2 + '","content_length":"' + content_length2 + '", "status":"200", "name":"' + name + '"}', {
        status: "200",
        headers: {
          "content-type": "application/json"
        }
      });
    }
    async function resume_upload(accessToken2, file, upload_id2, content_length2, range_of_data_dl2, requested_content_length2, headers = {}) {
      headers["authorization"] = "Bearer " + accessToken2;
      headers["content-type"] = "application/json";
      headers["Content-Length"] = requested_content_length2;
      headers["Content-Range"] = "bytes " + range_of_data_dl2 + "/" + content_length2;
      var putUrl = "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&upload_id=" + upload_id2;
      var upload_id2 = upload_id2;
      var res = await fetch(putUrl, {
        "method": "PUT",
        "headers": headers,
        "body": file
      });
      let json = {};
      if (res.status === 200 || res.status === 201) {
        const obj = await res.json();
        console.log(obj);
        json.status = 200;
        json.name = obj.name;
        json.id = obj.id;
      } else if (res.status === 308) {
        json.status = 308;
        json.range = res.headers.get("Range");
      } else {
        json.status = res.status;
      }
      return json;
    }
    async function generateAccessToken(serviceAccount2) {
      let jwttoken = await JSONWebToken.generateGCPToken(serviceAccount2);
      let post_data = {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwttoken
      };
      const apiUrl = "https://www.googleapis.com/oauth2/v4/token";
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(post_data)
      });
      const data2 = await res.json();
      return data2.access_token;
    }
    function formatFileSize(bytes) {
      if (bytes >= 1099511627776) {
        bytes = (bytes / 1099511627776).toFixed(2) + " TB";
      } else if (bytes >= 1073741824) {
        bytes = (bytes / 1073741824).toFixed(2) + " GB";
      } else if (bytes >= 1048576) {
        bytes = (bytes / 1048576).toFixed(2) + " MB";
      } else if (bytes >= 1024) {
        bytes = (bytes / 1024).toFixed(2) + " KB";
      } else if (bytes > 1) {
        bytes = bytes + " bytes";
      } else if (bytes === 1) {
        bytes = bytes + " byte";
      } else {
        bytes = "0 byte";
      }
      return bytes;
    }
    function enQuery(data2) {
      const ret = [];
      for (let d in data2) {
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data2[d]));
      }
      return ret.join("&");
    }
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map

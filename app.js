const fs = require("fs");
const url = require("url");
const http = require("http");
const https = require("https");

const port = 3000;
const server = http.createServer();

server.on("listening", listen_handler);
server.listen(port);
function listen_handler(){
    console.log(`Now Listening on Port ${port}`);
}

server.on("request", request_handler);
function request_handler(req, res){
    console.log(`New Request from ${req.socket.remoteAddress} for ${req.url}`);
    if(req.url === "/"){
        const form = fs.createReadStream("index.html");
		res.writeHead(200, {"Content-Type": "text/html"})
		form.pipe(res);
    }
    else if (req.url.startsWith("/search")){
		let {description, location} = url.parse(req.url,true).query;
		get_job_information(description, location, res);
    }
    else{
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end(`<h1>404 Not Found</h1>`);
    }
}

function get_job_information(description, location, res){
	const jobs_endpoint = `https://jobs.github.com/positions.json?description=${description}&location=${location}`;
	https.request(jobs_endpoint, {method:"GET"}, process_stream)
	     .end();
	function process_stream (jobs_stream){
		let jobs_data = "";
		jobs_stream.on("data", chunk => jobs_data += chunk);
		jobs_stream.on("end", () => serve_results(jobs_data, res));
	}
}

function serve_results(jobs_data, res){
	let jobs = JSON.parse(jobs_data);
	let results = jobs.map(formatJob).join('');
	results = `${results}`
	res.writeHead(200, {"Content-Type": "text/html"});
	res.end(results);

	function formatJob({title, description, url}){
		return `
		<style>
   :root {
    --color1:#323232;
    --color2:#ff1e56;
    --color3:#00005c;
    --color4:#6a097d;
    --color5:#c060a1;
    --color6:#142850;
    --color7:#27496d;
  }


::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  
body {
  background-color: var(--color6);
  font-family: 'DM Mono', monospace;

  }

.cards-list {
    z-index: 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  
  .card {
    margin: 1% auto;
    width: 80%;
    height: 20%;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.4s;
    position: relative;
    border-style: solid;
    background-color:var(--color7);
 
  }
  
  .card .card_image {
    width: 5em;;
    height: 5em;
    border-radius: 50%;
    position: absolute;
    top: 30%;
    left: 6%;
   transform: translate(-50%, -50%);
    
    
  }
  .card_title {
      padding-left: 19%;
      padding-top: 2%;
  }
  .card_description {
    padding-left: 19%;
    font-size: 0.8em;
    transform: translate(0%, -30%);
    
}
.card_tags {
    padding-left: 19%;
    font-size: 0.8em;
    
}
  
  .card .card_image img {
    width: inherit;
    height: inherit;
    border-radius: 40px;
    object-fit: cover;
    
  }
  h1 ,h2, h3, h4, h5, p{
         color: white;
  }

  ins {
    background: #83d5a8;
    height: auto;
    border-radius: .3em;
    display: inline; 
    -webkit-box-decoration-break: clone;
    -o-box-decoration-break: clone;
    box-decoration-break: clone;
    margin-left: 0.3em;
    margin-right: 0.3em;
   margin-top: 0.3em;
   margin-bottom:0.3em;
  }
  ins2 {
    background: #c060a1;
    height: auto;
    border-radius: .3em;
    display: inline; 
    -webkit-box-decoration-break: clone;
    -o-box-decoration-break: clone;
    box-decoration-break: clone;
    margin-left: 0.3em;
    margin-right: 0.3em;
   margin-top: 0.3em;
   margin-bottom:0.3em;
  }
  ins3 {
    background: #fa9191;
    height: auto;
    border-radius: .3em;
    display: inline; 
    -webkit-box-decoration-break: clone;
    -o-box-decoration-break: clone;
    box-decoration-break: clone;
    margin-left: 0.3em;
    margin-right: 0.3em;
   margin-top: 0.3em;
   margin-bottom:0.3em;
  }
  ins4 {
    background: #0779e4;
    height: auto;
    border-radius: .3em;
    display: inline; 
    -webkit-box-decoration-break: clone;
    -o-box-decoration-break: clone;
    box-decoration-break: clone;
    margin-left: 0.3em;
    margin-right: 0.3em;
   margin-top: 0.3em;
   margin-bottom:0.3em;
  }
  ins, del, ins2, ins3, ins4{
    text-decoration: none;
    display: inline-block;
    padding: 0 .3em;
  }
 </style>

		
		
		
		
		
		<div class="card 3">
        <div class="card_image">
          <img src="https://media.giphy.com/media/10SvWCbt1ytWCc/giphy.gif" />
        </div>
        <div class="card_title">
          <p>${title}</p>
        </div>
        <div class="card_description">
          <p>
          </p>
        </div>
        <div class="card_tags">
          <p>
          <ins>JavaScript</ins><ins2>AWS</ins2><ins3>NoSQL</ins3><ins4>Python</ins4>
         
          </p>
        </div>
      </div>`;
	}
}

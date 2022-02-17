//inserts html in to the media div depending on the media type received from the Nasa api
function getMedia(){

    parsedData = JSON.parse(document.getElementById('media').innerHTML)

    if (parsedData.media_type === "video"){
        document.getElementById("media").innerHTML = `<iframe width="1000" height="700" src="${parsedData.url}"></iframe>`
    }else{
        if(parsedData.hdurl !== undefined){
            document.getElementById("media").innerHTML = `<img width="1000" height="700" src="${parsedData.hdurl}">`
        }else{
            document.getElementById("media").innerHTML = `<img width="1000" height="700" src="${parsedData.url}">`

        }
    }
}

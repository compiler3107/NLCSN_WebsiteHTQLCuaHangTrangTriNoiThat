function setImage(image){
    return process.env.HOST_IMAGE +"/" + image;
}

module.exports = {setImage}
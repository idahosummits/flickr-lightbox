var Flickr = function(key){
  this.apiKey = key;
  this.getUrlForQuery = function(user,photoset){
    var url = "https://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=";
    url+=this.apiKey;
    url+="&user_id="+user+"&photoset_id="+photoset+"&format=json&per_page=20&nojsoncallback=?";
    return url;
  }
}
Flickr.prototype = (function(){
  return {
    getImages: function(user, photoset, callback){
      var self = this;
      var url = this.getUrlForQuery(user,photoset);
      var request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);
          var photos = [];
          data.photoset.photo.forEach(function(photo){
            var p = {};
            p.title = photo.title;
            p.thumb = self.getImageUrl(photo.farm,photo.server,photo.id, photo.secret,true);
            p.url = self.getImageUrl(photo.farm,photo.server,photo.id, photo.secret,false);
            photos.push(p);
          });
          callback(true, {photos: photos});
        }
      };

      request.onerror = function() {
        // There was a connection error of some sort
        callback(false, {});
      };
      request.send();
    },
    getImageUrl: function(farm,server,id,secret,thumb){
      var url = "https://farm"+farm+".staticflickr.com/"+server+"/"+id+"_"+secret;
      if(thumb)
        url+= "_t";
      url += ".jpg";
      return url;
    }
  };
}());

var Lightbox = (function(window) {

  //constructor
  function Lightbox(divId, flickrApiKey) {
    this.div = document.getElementById(divId);
    this.flickrUser = this.div.getAttribute('data-flickr-user');
    this.flickrPhotoset = this.div.getAttribute('data-flickr-photoset');
    this.images = [];
    this.flickr = new Flickr(flickrApiKey);

    this.fetchImages = function(user,photoset){
      this.flickr.getImages(user, photoset, function(success, data){
        if(success){
          console.log(data);
        }
        else{
          console.log("error: ", error);
        }
      });
    };

    this.addImage = function(){
    };
    this.fetchImages(this.flickrUser,this.flickrPhotoset);

  }

  return Lightbox;
  
})(window);

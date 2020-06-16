
const userAccessToken = "BQAjK7-JKbs1PI98XnLQNfsyzR1EatxVZDTU0Ml5NB_-_Yt5g7GPlSg3DisFF0zUTQGvNBnCoZIWRqP4KpFHBbgQDVTrwgsCfcz0LcHanXFTSvuhkG_OoRomZegsH_gRldBkZagIZE6Yup8";
let artistId = null;
const artistQuery = "q='haim'&type=artist";
const display = () => {
    $('img').remove();
    $('ul').empty();
    $('#a1Header').text($('#first').val());
    $('#a2Header').text($('#second').val());
    $('#a3Header').text($('#third').val());
    getInfo(($('#first').val()),$('#a1List'),$('#a1'));
    getInfo(($('#second').val()),$('#a2List'),$('#a2'));
    getInfo(($('#third').val()),$('#a3List'),$('#a3'));
    $('input').val("");
    $('h3').text("classified as: ")
}

$(() => {
    

});



const getInfo = (artist,uList,section) => {
    // let userAccessToken = null;
    // $.ajax ({
    //     url: "https://accounts.spotify.com/authorize?client_id=2483a99e8ce64d8fa66813fae67f3610&scopes=playlist-read-private&response_type=code&redirect_uri=https%3A%2F%2Fgithub.com%2F",
    //     success: function (data) {
    //         userAccessToken = data.code;
    //     }
    // })

    artist = artist.replace(/ /g,"%20");
    console.log(artist);
    $.ajax({
        url: `https://api.spotify.com/v1/search?q='${artist}'&type=artist`,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", `Bearer ${userAccessToken}`)
        }, success: function(data) {
            artistId = data.artists.items[0].id;
    
            // nested ajax call?
            $.ajax({
                url: `https://api.spotify.com/v1/artists/${artistId}`,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", `Bearer ${userAccessToken}`)
                }, success: function(data) {
                    console.log(data);
                    for (let genre of data.genres) {
                        const $li = $('<li>').text(genre);
                        (uList).append($li);
                    }
                    const $img = $('<img>').attr("src",data.images[0].url).attr("id","picture");
                    section.prepend($img);
                }
            })
        }  
    })
}

function getUserAccessToken(client_64) {
    const resp = $.ajax({
        url: "https://accounts.spotify.com/api/token",
        method: 'POST',
        data: "grant_type=client_credentials",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", `Basic ${client_64}`);
        },
    })
    return (resp);
}

const getIdInfo = (userAccessToken,artist,uList,section) => {
    artist = artist.replace(/ /g,"%20");
    // get artist id for user input
    $.ajax({
        url: `https://api.spotify.com/v1/search?q='${artist}'&type=artist`,
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", `Bearer ${userAccessToken}`)
        }, success: (data) => {
            const artistId = data.artists.items[0].id;
    
            // use id to get artist data
            $.ajax({
                url: `https://api.spotify.com/v1/artists/${artistId}`,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", `Bearer ${userAccessToken}`)
                }, success: (data) => {
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


const display = () => {
    const client_64 = "MjQ4M2E5OWU4Y2U2NGQ4ZmE2NjgxM2ZhZTY3ZjM2MTA6OGIwZDVjYjFmOTM4NDEyNThiNGJjMDBlMTAwZWVjOGY=";
    getUserAccessToken(client_64).then((response) => {   
        const userAccessToken = response.access_token; 
        $('img').remove();
        $('ul').empty();
        $('#a1Header').text($('#first').val());
        $('#a2Header').text($('#second').val());
        $('#a3Header').text($('#third').val());
        getIdInfo(userAccessToken,($('#first').val()),$('#a1List'),$('#a1'));
        getIdInfo(userAccessToken,($('#second').val()),$('#a2List'),$('#a2'));
        getIdInfo(userAccessToken,($('#third').val()),$('#a3List'),$('#a3'));
        $('input').val("");
        $('h3').text("classified as: ")
    });
}

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

// use seed artists, check if there are any common genres between, if so, use as 4th and or 5th seed; set limit as 5
// use a slider for tuneable track attributes? ex popularity, energy, acousticness
// figure out how to add web player?

const getInfo = (artist,uList,section) => {

    const userAccessToken = "BQArclFEu9MQgXEujIkmK4sHF_asGXCZ8QdlgLKNSw6zKzFMyNkZR9tvkWyfJ52QnR8qBgTP10nUtUScwo2OlNH9vmsFkyIY_m3lsM5KOBAP4-RGBB7ARSPy478xp4PfT4kJU8mNQ6PA2C4";

    const client_id = "2483a99e8ce64d8fa66813fae67f3610";
    const client_secret = "8b0d5cb1f93841258b4bc00e100eec8f";
    const redirect_uri = "https%3A%2F%2Froot2point0.github.io%2Fspot.me";
    const scopes = "user-read-private user-read-email";


    // let userAccessToken = null;
    // $.ajax ({
    //     url: `https://accounts.spotify.com/authorize?client_id=${client_id}&scopes=${scopes}&response_type=code&redirect_uri=${redirect_uri}`,
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

const getUserAccessToken = (client_64) => {
    const resp = $.ajax({
        url: "https://accounts.spotify.com/api/token",
        method: 'POST',
        data: "grant_type=client_credentials",
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", `Basic ${client_64}`);
        },
    })
    return (resp);
}

const getInfo = (userAccessToken,artist,uList,section) => {
    let toReturn = { name: artist, idNum: null, idGenres: [] };
    artist = artist.replace(/ /g,"%20");
    // get artist id from user input
    const artistData = $.ajax({
        url: `https://api.spotify.com/v1/search?q='${artist}'&type=artist`,
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", `Bearer ${userAccessToken}`)
        }, success: (data) => {
            for (let genre of data.artists.items[0].genres) {
                toReturn.idGenres.push(genre);
                const $li = $('<li>').text(genre);
                (uList).append($li);
            }
            const $img = $('<img>').attr("src",data.artists.items[0].images[0].url).attr("id","picture");
            section.prepend($img);
            toReturn.idNum = data.artists.items[0].id;
        }
    })
    return (toReturn);
}


const display = () => {
    const client_64 = "MjQ4M2E5OWU4Y2U2NGQ4ZmE2NjgxM2ZhZTY3ZjM2MTA6OGIwZDVjYjFmOTM4NDEyNThiNGJjMDBlMTAwZWVjOGY=";
    let artistList = [];
    //let seeds = { ids: [], genres: [] };
    //let tempSeeds = { ids: [], genres: [] };
    getUserAccessToken(client_64).then((response) => {   
        const userAccessToken = response.access_token; 
        $('img').remove();
        $('ul').empty();
        $('#a1Header').text($('#first').val());
        $('#a2Header').text($('#second').val());
        $('#a3Header').text($('#third').val());

        
        artistList.push(getInfo(userAccessToken,($('#first').val()),$('#a1List'),$('#a1')));

        artistList.push(getInfo(userAccessToken,($('#second').val()),$('#a2List'),$('#a2')));

        artistList.push(getInfo(userAccessToken,($('#third').val()),$('#a3List'),$('#a3')));

        // for (let i = 0; i< artistList.length; i++){
        //     console.log(artistList[i].idNum);
        // }

        console.log(artistList);
        for (let a of artistList){
            console.log("name "+a.name);
            console.log("id "+a.idNum);
            console.log(a.idGenres);
        }

        // console.log(tempSeeds);
        // seeds.ids.push(tempSeeds.id);
        // for (let g of tempSeeds.idGenres) {seeds.genres.push(g) };
        // console.log(seeds);
        $('input').val("");
        $('h3').text("classified as: ");
    });
}
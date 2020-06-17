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

const getIdInfo = (userAccessToken,artist,uList,section) => {
    let toReturn = { name: artist, idGenres: [] };
    artist = artist.replace(/ /g,"%20");
    // get artist id for user input
    const artistData = $.ajax({
        url: `https://api.spotify.com/v1/search?q='${artist}'&type=artist`,
        json: true,
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", `Bearer ${userAccessToken}`)
        }
            // //use id to get artist data
            // $.ajax({
            //     url: `https://api.spotify.com/v1/artists/${artistId}`,
            //     beforeSend: function (xhr) {
            //         xhr.setRequestHeader("Authorization", `Bearer ${userAccessToken}`)
            //     }, success: (data) => {
            //         toReturn.idNum = artistId;
            //         console.log(artistId);
            //         console.log("id: "+toReturn.idNum);
            //         for (let genre of data.genres) {
            //             toReturn.idGenres.push(genre);
            //             const $li = $('<li>').text(genre);
            //             (uList).append($li);
            //         }
            //         const $img = $('<img>').attr("src",data.images[0].url).attr("id","picture");
            //         section.prepend($img);
            //     }
            // })
        });
        return (artistData);
    }
    //console.log(artistData);
    // console.log("debug: "+toReturn);
    // console.log(toReturn.idNum);
    // console.log(toReturn.name);
    // console.log(toReturn.idGenres);
    //return toReturn;


const display = () => {
    const client_64 = "MjQ4M2E5OWU4Y2U2NGQ4ZmE2NjgxM2ZhZTY3ZjM2MTA6OGIwZDVjYjFmOTM4NDEyNThiNGJjMDBlMTAwZWVjOGY=";
    let artistList = [];
    let seeds = { ids: [], genres: [] };
    //let tempSeeds = { ids: [], genres: [] };
    getUserAccessToken(client_64).then((response) => {   
        const userAccessToken = response.access_token; 
        $('img').remove();
        $('ul').empty();
        $('#a1Header').text($('#first').val());
        $('#a2Header').text($('#second').val());
        $('#a3Header').text($('#third').val());

        // here is where we are trying to access the return from ajax
        let test = getIdInfo(userAccessToken,($('#first').val()),$('#a1List'),$('#a1'));
        console.log(test);
        //console.log(test.idGenres);
        //console.log(test.idNum);
        //console.log(test.name);
        //seeds.ids.push(tempSeeds.id);
        //for (let g of tempSeeds.idGenres) {seeds.genres.push(g) };


        getIdInfo(userAccessToken,($('#second').val()),$('#a2List'),$('#a2'));

        // console.log(tempSeeds);
        // seeds.ids.push(tempSeeds.id);
        // for (let g of tempSeeds.idGenres) {seeds.genres.push(g) };

        artistList.push(getIdInfo(userAccessToken,($('#third').val()),$('#a3List'),$('#a3')));

        // console.log(artistList);
        // for (let i = 0; i< artistList.length; i++){
        //     console.log(artistList[i].idNum);
        // }
        // for (let a of artistList){
        //     console.log(a.idNum);
        // }

        // console.log(tempSeeds);
        // seeds.ids.push(tempSeeds.id);
        // for (let g of tempSeeds.idGenres) {seeds.genres.push(g) };
        // console.log(seeds);
        $('input').val("");
        $('h3').text("classified as: ");
    });
}
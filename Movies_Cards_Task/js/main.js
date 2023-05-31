var eventsMediator = {
    events: {},
    on: function (eventName, callbackfn) {
      this.events[eventName] = this.events[eventName]
        ? this.events[eventName]
        : [];
      this.events[eventName].push(callbackfn);
    },
    emit: function (eventName, data) {
      if (this.events[eventName]) {
        this.events[eventName].forEach(function (callBackfn) {
          callBackfn(data);
        });
      }
    },
  };
var stats_module={


    Stats_modal:{
        stats_template:document.getElementById('s_template').innerHTML,
        current_page:1,
        number_of_movie:0,
        top_movie_name:'',
        top_movie_rate:0.0,
        IncrementCurrentPage:function () {
            stats_module.Stats_modal.current_page ++;
          
            stats_module.Stats_controller.fetchMovies();

        },
        decrementCurrentPage:function () {
            stats_module.Stats_modal.current_page --;
          
            stats_module.Stats_controller.fetchMovies();

        },

    },
    Stats_controller:{
        init:function name(params) {
           this.fetchMovies(); 
        },
        getPageNumber:function name(params) {
         return stats_module.Stats_modal.current_page  ;
        },
        fetchMovies:function (){
            const settings = {
            
                async: true,
                crossDomain: true,
                url: 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page='+this.getPageNumber()+'&sort_by=popularity.desc',
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNGVkZDYxOGFmMmIzOGI5NDYwZTE0NmIzNDk4MzE2ZSIsInN1YiI6IjY0NzczYTJlMjU1ZGJhMDBhOWEyMTBlZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UoiUoTnlprq4OuHe5dvV6XDRgkr_cZPwv5Pgt2rygrU'
                }
              };
              
              $.ajax(settings).done(function (response) {
                eventsMediator.emit("movies-is-fetched", response.results);
              });
        },
        setNumberOfMovies:eventsMediator.on("movies-is-fetched", function (movies) {
                stats_module.Stats_modal.number_of_movie=movies.length;

        }),
        setTopMovieDetails:eventsMediator.on("movies-is-fetched", function (movies) {
            var topMovieRate=0;
            var topindex=0;
         
            for (let index = 0; index < movies.length; index++) {
                 if(movies[index].vote_average >topMovieRate){
                    topMovieRate=movies[index].vote_average;
                        topindex=index;

                 }
                
            }
            stats_module.Stats_modal.top_movie_name=movies[topindex].title;
            stats_module.Stats_modal.top_movie_rate=movies[topindex].vote_average;

    }),
        

    },
    StatsView:{

        render:eventsMediator.on("movies-is-fetched", function (movies) {
            var c=$('#stats_wrapper');
            c.empty();
            var statstaget=$("#stats_target");
            statstaget.empty();
            var template = stats_module.Stats_modal.stats_template;
            var rendered = Mustache.render(template,stats_module.Stats_modal );
            statstaget.append( rendered);
    }),
    }
}

stats_module.Stats_controller.init();
var movies_list={

    movies_list_modal:{
        list_template:document.getElementById('g_template').innerHTML,
        current_page:stats_module.Stats_modal.current_page,
        popup:false,
        movies:[],
        setMovies:eventsMediator.on("movies-is-fetched", function (movies) {
           movies_list.movies_list_modal.movies=movies;

    }),
    },

    movies_list_view:{

           render_list:eventsMediator.on("movies-is-fetched", function (movies) {
            var arr=movies_list.movies_list_modal.movies;
            var target=$('#movies_target');
            var template = movies_list.movies_list_modal.list_template;
            target.empty();
            for (let index = 0; index < arr.length; index++) {
                const rendered = Mustache.render(template, arr[index]);
               target.append(rendered);
               $("#"+arr[index].id).on("click", function(){
                       
                        movies_list.movies_list_modal.popup=true;
                        $('#exampleModalCenter').modal('show');
                        
                    var img_cont=$('#movie_img');
                    img_cont.empty();
                    var img=$('<img class="" src="https://image.tmdb.org/t/p/w185'+arr[index].poster_path+'" />');
                    img_cont.append(img);


                    var details_cont=$('#movie_details');
                    details_cont.empty();
                    var title=$('<h3 class="pb-3">'+arr[index].title+'</h3>');
                    var rating=$('<h3 class="pb-3">IMDB Rating:'+arr[index].vote_average+'/10 ('+arr[index].vote_count+' votes)</h3>');
                    var desc=$('<p class="">'+arr[index].overview+'</p>');
                    details_cont.append(title).append(rating).append(desc);


              });
                
            }
           
           
    }),
    closemodel: $("#close").on("click", function(){
      
        movies_list.movies_list_modal.popup=false;
        $('#exampleModalCenter').modal('hide');

}),
    
    },
    movies_list_controller:{

        incrementPage: $("#next").on("click", function(){
     
            movies_list.movies_list_modal.current_page ++;
            stats_module.Stats_modal.IncrementCurrentPage();

        }),
        decrementPage: $("#previous").on("click", function(){
                if(stats_module.Stats_modal.current_page ==1){
                    alert('stop !!');
                }
                else{
                    stats_module.Stats_modal.current_page.current_page ++;
                    stats_module.Stats_modal.decrementCurrentPage();
                }
          

        }),


    }

   
    
}

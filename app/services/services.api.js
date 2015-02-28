angular.module('cr.services.api', ['ngResource', 'angular-storage'])

    .factory('Article', function($resource) {
        return $resource('http://127.0.0.1:8000/api/article/:article_id');
    })

    .factory('Vote', function($resource, CRAuth){
        var custom_actions = {};
        custom_actions.authGET = {method:'GET'};
        if(CRAuth.current_user && CRAuth.current_user.token){
            custom_actions.authGET.headers = {"Authorization": 'JWT '+ CRAuth.current_user.token }
        }

        return $resource('http://127.0.0.1:8000/api/article/:article_id/topic/:topic_id/vote/:vote_id', {}, custom_actions);
    })

    .factory('Question', function($resource, CRAuth){

        return $resource('http://127.0.0.1:8000/api/article/:article_id/question/:question_id/',{}, {
            'ask': {method: 'POST', url:'http://127.0.0.1:8000/api/article/:article_id/question/ask'},

            "upvote": {method: 'POST', url:'http://127.0.0.1:8000/api/article/:article_id/question/:question_id/upvote/:upvote_id'},
            'revokeUpvote': {method: 'DELETE', url:'http://127.0.0.1:8000/api/article/:article_id/question/:question_id/upvote/:upvote_id'},

            'follow': {method: 'POST', url:'http://127.0.0.1:8000/api/article/:article_id/question/:question_id/follow/:follow_id'},
            'revokeFollow': {method: 'DELETE', url:'http://127.0.0.1:8000/api/article/:article_id/question/:question_id/follow/:follow_id'},

            'all': {
                method: 'GET',
                headers: CRAuth.current_user && CRAuth.current_user.token ? {'Authorization':'JWT '+ CRAuth.current_user.token} : {},
                url:'http://127.0.0.1:8000/api/article/:article_id/questions/'
            }
        });
    })

    .factory('InsightVotes', function($resource){
        return $resource('http://127.0.0.1:8000/api/article/:article_id/topics');
    });
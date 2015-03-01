angular.module('cr.services.api', ['ngResource', 'angular-storage', 'cr.config'])

    .factory('Article', function($resource, CONFIG) {
        return $resource(CONFIG.API + '/article/:article_id', {});
    })

    .factory('Suggestion', function($resource, CONFIG) {
        return $resource(CONFIG.API + '/api/article/suggestion', {},{
            'post': {method: 'POST'}
        });
    })

    .factory('Vote', function($resource, CONFIG, CRAuth){
        var custom_actions = {};
        custom_actions.authGET = {method:'GET'};
        if(CRAuth.current_user && CRAuth.current_user.token){
            custom_actions.authGET.headers = {"Authorization": 'JWT '+ CRAuth.current_user.token }
        }

        return $resource(CONFIG.API + 'api/article/:article_id/topic/:topic_id/vote/:vote_id', {}, custom_actions);
    })

    .factory('Question', function($resource, CRAuth, CONFIG){

        return $resource(CONFIG.API + 'api/article/:article_id/question/:question_id/',{}, {
            'ask': {method: 'POST', url:CONFIG.API + 'api/article/:article_id/question/ask'},

            "upvote": {method: 'POST', url:CONFIG.API + 'api/article/:article_id/question/:question_id/upvote/:upvote_id'},
            'revokeUpvote': {method: 'DELETE', url:CONFIG.API + 'api/article/:article_id/question/:question_id/upvote/:upvote_id'},

            'follow': {method: 'POST', url:CONFIG.API + 'api/article/:article_id/question/:question_id/follow/:follow_id'},
            'revokeFollow': {method: 'DELETE', url:CONFIG.API + 'api/article/:article_id/question/:question_id/follow/:follow_id'},

            'all': {
                method: 'GET',
                headers: CRAuth.current_user && CRAuth.current_user.token ? {'Authorization':'JWT '+ CRAuth.current_user.token} : {},
                url:CONFIG.API + 'api/article/:article_id/questions/'
            }
        });
    })

    .factory('InsightVotes', function($resource){
        return $resource(CONFIG.API + 'api/article/:article_id/topics');
    });
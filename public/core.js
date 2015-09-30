// var md = window.markdownit();
// var result = md.render('# markdown-it rulezz!');

angular.module('squire', ['ngSanitize'])
  .controller('PostController', function($http) {
    var postList = this;
    
    // postList.posts = [
    //   {source: '*learn* __angular__', output: md.render('*learn* __angular__'), done:true},
    //   {source: 'build an *angular* app', output: md.render('build an *angular* app'), done:false}];
      
    $http.get('/api/1.0/posts')
        .success(function(data) {
            postList.posts = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

      postList.createPost = function() {
        var post = { source: postList.source };
        
          $http.post('/api/1.0/posts', post)
              .success(function(data) {
                  // postList.post = {}; // clear the form so our user is ready to enter another
                  postList.source = '';
                  postList.posts.push(data);
                  console.log(data);
                  $('#source').focus();
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });
      };

 
    // postList.createPost = function() {
    //   postList.posts.push({source: postList.source, output: md.render(postList.source), done:false});
    //   postList.source = '';
    // };
 
    postList.remaining = function() {
      var count = 0;
      angular.forEach(postList.posts, function(post) {
        count += post.done ? 0 : 1;
      });
      return count;
    };
 
    postList.archive = function() {
      var oldTodos = postList.todos;
      postList.posts = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) postList.todos.push(todo);
      });
    };
  });

// // public/core.js
// (function(angular) {
//   'use strict';
  
//   angular.module('squire', ['ngSanitize'])

// // html filter (render text as html)
// // scotchTodo.filter('html', ['$sce', function ($sce) { 
// //     return function (text) {
// //         return $sce.trustAsHtml(text);
// //     };    
// // }])

//     .controller('MainController', ['$scope', function($scope) {
//         $scope.formData = {};
    
//         // when landing on the page, get all users and show them
//         $http.get('/api/1.0/posts')
//             .success(function(data) {
//                 $scope.posts = data;
//                 console.log(data);
//             })
//             .error(function(data) {
//                 console.log('Error: ' + data);
//             });
    
//         // when submitting the add form, send the text to the node API
//         $scope.createPost = function() {
//             $http.post('/api/1.0/posts', $scope.post)
//                 .success(function(data) {
//                     $scope.post = {}; // clear the form so our user is ready to enter another
//                     $scope.posts.push(data);
//                     console.log(data);
//                     $('#source').focus();
//                 })
//                 .error(function(data) {
//                     console.log('Error: ' + data);
//                 });
//         };
    
//         // delete a todo after checking it
//         // $scope.deleteTodo = function(id) {
//         //     $http.delete('/api/todos/' + id)
//         //         .success(function(data) {
//         //             $scope.todos = data;
//         //             console.log(data);
//         //         })
//         //         .error(function(data) {
//         //             console.log('Error: ' + data);
//         //         });
//         // };
    
//     }]);
// })(window.angular);
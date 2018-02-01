/**
 * Created by ZQLan on 15/3/3.
 */


EventHandler = function() {
    this.electSuccess = function(course){};
    this.electError = function(course, message) {};
    this.validatePass = function() {};
    this.validateNotPass = function(message) {};
};

eventHandler = new EventHandler();
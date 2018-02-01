﻿/**
 * Created by ZQLan on 15/3/3.
 */


// 需要的域：除了构造参数，还需要$tr、name、currElectNum、maxElectNum
var Course = function(id, number, index) {
    this.id = id;
    this.number = number;
    this.index = index;
    this.isDone = false;
};


Course.prototype.courses = new Map();
Course.prototype.elect = function() {
    elect(this);
};
Course.prototype.save = function () {
    this.courses.put(this.id, this);
};
Course.prototype.refreshIndex = function(i) {
    if (i > 0) {
        for(var course in this.courses) {
            if (course.index > i) {
                course.index--;
            }
        }
    }
};
